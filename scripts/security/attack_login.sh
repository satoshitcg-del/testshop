#!/bin/bash
# Attack Script: Login Brute Force via OpenClaw CLI Browser
# Target: http://sit.askmebill.com/auth/login

TARGET="http://sit.askmebill.com/auth/login"
USERNAME="uuio11"
PASSWORD="0897421942@Earth"

echo "=========================================="
echo "  Login Attack Test - OpenClaw Browser"
echo "  Target: $TARGET"
echo "=========================================="
echo ""

# 1. Open browser and navigate
echo "[1] Opening browser..."
openclaw browser --browser-profile openclaw open "$TARGET"
sleep 2

# 2. Get snapshot to find refs
echo "[2] Analyzing page structure..."
openclaw browser --browser-profile openclaw snapshot --format aria --compact > /tmp/snapshot.txt
cat /tmp/snapshot.txt | grep -E "textbox|button"
echo ""

# 3. Fill username (ref จาก snapshot)
echo "[3] Filling username..."
openclaw browser --browser-profile openclaw act kind=type ref=e46 text="$USERNAME"
echo "   Username: $USERNAME"
sleep 1

# 4. Fill password
echo "[4] Filling password..."
openclaw browser --browser-profile openclaw act kind=type ref=e55 text="$PASSWORD"
echo "   Password: ********"
sleep 1

# 5. Take screenshot before submit
echo "[5] Taking screenshot..."
openclaw browser --browser-profile openclaw screenshot --full-page
echo ""

# 6. Click login
echo "[6] Clicking login button..."
openclaw browser --browser-profile openclaw act kind=click ref=e59
echo "   Login submitted!"
sleep 3

# 7. Check result
echo "[7] Checking result..."
openclaw browser --browser-profile openclaw snapshot --format aria --compact | head -20
echo ""

# 8. Screenshot after
echo "[8] Taking final screenshot..."
openclaw browser --browser-profile openclaw screenshot --full-page
echo ""

echo "=========================================="
echo "  Attack Test Complete!"
echo "=========================================="
