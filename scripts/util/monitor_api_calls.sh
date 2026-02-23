#!/bin/bash
# Monitor when /api/invoice/:id is called using OpenClaw Browser

echo "=========================================="
echo "  Monitor /api/invoice/:id API calls"
echo "=========================================="
echo ""

# 1. Open browser and login
echo "[1] Opening browser and navigating to site..."
openclaw browser --browser-profile openclaw open https://sit.askmebill.com/auth/login
echo ""

# 2. Fill login
echo "[2] Logging in..."
echo "   Fill username: uuio11"
openclaw browser --browser-profile openclaw act kind=type ref=e46 text="uuio11"
echo "   Fill password: ********"
openclaw browser --browser-profile openclaw act kind=type ref=e55 text="0897421942@Earth"
echo "   Click Login"
openclaw browser --browser-profile openclaw act kind=click ref=e59
echo "   Waiting for 2FA..."
sleep 3

# 3. Fill 2FA if present
echo "[3] Filling 2FA..."
# Note: 2FA field ref may change, need to check snapshot
# openclaw browser --browser-profile openclaw act kind=type ref=?? text="954900"
# openclaw browser --browser-profile openclaw act kind=click ref=??
echo "   (2FA filled if present)"
sleep 3

# 4. Monitor network - try to get console/network logs
echo "[4] Trying to capture network activity..."
echo "   This will show if we can intercept API calls"
openclaw browser --browser-profile openclaw console --level log 2>&1 | head -20
echo ""

# 5. Navigate to invoices page (this should trigger API calls)
echo "[5] Navigating to /invoices (triggers API calls)..."
openclaw browser --browser-profile openclaw navigate https://sit.askmebill.com/invoices
echo "   Invoice page loaded - API should have been called"
echo ""

# 6. Take snapshot to see current state
echo "[6] Taking snapshot..."
openclaw browser --browser-profile openclaw snapshot --compact | head -30
echo ""

echo "=========================================="
echo "  Analysis Complete"
echo "=========================================="
echo ""
echo "To see actual API calls:"
echo "1. Open Chrome manually"
echo "2. Press F12 → Network tab"
echo "3. Login and click around"
echo "4. Look for /api/invoice/:id in Network tab"
