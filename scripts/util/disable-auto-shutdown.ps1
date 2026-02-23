# AWS EC2 Disable Auto-Shutdown Script
# Run as Administrator

Write-Host "=== EC2 Auto-Shutdown Prevention ===" -ForegroundColor Green

# 1. Check for idle shutdown scripts in common locations
$searchPaths = @(
    "C:\Users\Administrator\Documents",
    "C:\Users\Administrator\Desktop",
    "C:\",
    "C:\Windows",
    "C:\ProgramData"
)

Write-Host "`nChecking for idle shutdown scripts..." -ForegroundColor Yellow
foreach ($path in $searchPaths) {
    if (Test-Path $path) {
        $scripts = Get-ChildItem -Path $path -Filter "*.ps1" -Recurse -ErrorAction SilentlyContinue | 
                   Where-Object { $_.Name -match "idle|shutdown|stop|aws" }
        if ($scripts) {
            Write-Host "Found in $path`:" -ForegroundColor Red
            $scripts | Select-Object -ExpandProperty FullName
        }
    }
}

# 2. Check Scheduled Tasks
Write-Host "`nChecking Scheduled Tasks..." -ForegroundColor Yellow
Get-ScheduledTask | Where-Object { 
    $_.TaskName -match "shutdown|idle|aws|stop" -and $_.TaskName -ne "RegIdleBackup"
} | ForEach-Object {
    Write-Host "Found: $($_.TaskName) - State: $($_.State)" -ForegroundColor Red
    # Disable the task
    Disable-ScheduledTask -TaskName $_.TaskName -Confirm:$false
    Write-Host "  -> Disabled!" -ForegroundColor Green
}

# 3. Check for AWS Instance Scheduler tag (can't change from instance, just check)
Write-Host "`nNote: If using AWS Instance Scheduler (Lambda), you need to:" -ForegroundColor Cyan
Write-Host "  1. Go to AWS Console -> DynamoDB" -ForegroundColor White
Write-Host "  2. Find 'Schedule' table" -ForegroundColor White
Write-Host "  3. Delete schedule for this instance OR" -ForegroundColor White
Write-Host "  4. Change EC2 instance tag 'Schedule' to 'running'" -ForegroundColor White

# 4. Set Windows to never sleep
Write-Host "`nSetting Windows Power Options..." -ForegroundColor Yellow
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
powercfg /change monitor-timeout-ac 0
Write-Host "  -> Disabled sleep/hibernate!" -ForegroundColor Green

# 5. Create keep-alive script (optional)
$keepAliveScript = @'
# Keep-Alive Script - Prevents idle shutdown
while ($true) {
    # Send mouse movement every 5 minutes
    Add-Type -AssemblyName System.Windows.Forms
    $pos = [System.Windows.Forms.Cursor]::Position
    [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(($pos.X + 1), $pos.Y)
    Start-Sleep -Milliseconds 100
    [System.Windows.Forms.Cursor]::Position = $pos
    
    # Log activity
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path "C:\keep-alive.log" -Value "[$timestamp] Keep-alive signal sent"
    
    # Wait 5 minutes
    Start-Sleep -Seconds 300
}
'@

$keepAlivePath = "C:\keep-alive.ps1"
$keepAliveScript | Out-File -FilePath $keepAlivePath -Encoding UTF8
Write-Host "`nCreated keep-alive script at: $keepAlivePath" -ForegroundColor Green

# 6. Create startup task for keep-alive
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -File $keepAlivePath"
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName "EC2-Keep-Alive" -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest -Force -ErrorAction SilentlyContinue
Write-Host "Created startup task: EC2-Keep-Alive" -ForegroundColor Green

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "Instance should no longer auto-shutdown due to idle." -ForegroundColor Green
Write-Host "`nIMPORTANT: If using AWS Instance Scheduler Lambda, disable it in AWS Console!" -ForegroundColor Red
