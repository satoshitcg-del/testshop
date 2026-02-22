@echo off
echo ============================================
echo   Askmebill SIT - Playwright Setup
echo ============================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [!] Python not found. Please install Python first.
    exit /b 1
)

echo [*] Python found
echo.

:: Install playwright
echo [*] Installing Playwright...
pip install playwright

if errorlevel 1 (
    echo [!] Failed to install playwright
    exit /b 1
)

echo [*] Playwright installed successfully
echo.

:: Install Chromium
echo [*] Installing Chromium browser...
playwright install chromium

if errorlevel 1 (
    echo [!] Failed to install Chromium
    exit /b 1
)

echo [*] Chromium installed successfully
echo.

:: Run the test
echo [*] Running penetration tests...
echo [*] Target: https://sit.askmebill.com/
echo.

python askmebill_playwright_test.py

echo.
echo ============================================
echo   Setup and Testing Complete
echo ============================================
pause
