#!/bin/bash

# TestShop API Test Runner
# Usage: ./run-api-tests.sh <group> <prefix> <base_url>

set -e

GROUP=$1
PREFIX=$2
BASE_URL=$3
REPORT_DIR="test-reports"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "Running ${GROUP} tests..."
echo "Base URL: ${BASE_URL}"
echo "=========================================="

mkdir -p ${REPORT_DIR}

TOTAL=0
PASSED=0
FAILED=0

test_api() {
    local test_name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    local auth_token=$6
    
    TOTAL=$((TOTAL + 1))
    echo -n "Testing ${test_name}... "
    
    local curl_cmd="curl -s -w \"%{http_code}\" -X ${method} -H \"Content-Type: application/json\""
    
    if [ -n "${auth_token}" ]; then
        curl_cmd="${curl_cmd} -H \"Authorization: Bearer ${auth_token}\""
    fi
    
    if [ -n "${data}" ]; then
        curl_cmd="${curl_cmd} -d '${data}'"
    fi
    
    curl_cmd="${curl_cmd} \"${BASE_URL}${endpoint}\""
    
    local response=$(eval ${curl_cmd})
    local http_code=$(echo ${response} | tail -c 4)
    
    if [ "${http_code}" = "${expected_status}" ]; then
        echo -e "${GREEN}PASSED${NC} (${http_code})"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}FAILED${NC} (Expected: ${expected_status}, Got: ${http_code})"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Authentication Tests
if [ "${GROUP}" = "authentication" ]; then
    echo -e "\n${YELLOW}=== Authentication Tests ===${NC}"
    
    test_api "TC-AUTH-001: Register" "POST" "/api/auth/register" \
        '{"email": "test_'$(date +%s)'@example.com", "password": "password123", "fullName": "Test"}' \
        "200"
    
    test_api "TC-AUTH-002: Duplicate email" "POST" "/api/auth/register" \
        '{"email": "test1@gmail.com", "password": "pass123", "fullName": "Test"}' \
        "409"
    
    test_api "TC-AUTH-003: Missing fields" "POST" "/api/auth/register" \
        '{}' "400"
    
    test_api "TC-AUTH-005: Login success" "POST" "/api/auth/login" \
        '{"email": "test1@gmail.com", "password": "Aa123456"}' "200"
    
    test_api "TC-AUTH-006: Wrong password" "POST" "/api/auth/login" \
        '{"email": "test1@gmail.com", "password": "wrong"}' "401"
    
    test_api "TC-AUTH-009: No token" "GET" "/api/user/profile" "" "401"
fi

# User Tests
if [ "${GROUP}" = "user-profile" ]; then
    echo -e "\n${YELLOW}=== User Tests ===${NC}"
    
    # Get token
    LOGIN=$(curl -s -X POST -H "Content-Type: application/json" \
        -d '{"email": "test1@gmail.com", "password": "Aa123456"}' \
        "${BASE_URL}/api/auth/login")
    TOKEN=$(echo ${LOGIN} | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    
    test_api "TC-USER-001: Get profile" "GET" "/api/user/profile" "" "200" "${TOKEN}"
    test_api "TC-USER-002: Update profile" "PATCH" "/api/user/profile" \
        '{"fullName": "Updated"}' "200" "${TOKEN}"
    test_api "TC-USER-004: Wrong password" "PATCH" "/api/user/profile" \
        '{"currentPassword": "wrong", "newPassword": "new"}' "400" "${TOKEN}"
fi

# Product Tests
if [ "${GROUP}" = "products" ]; then
    echo -e "\n${YELLOW}=== Product Tests ===${NC}"
    
    test_api "TC-PROD-001: List products" "GET" "/api/products" "" "200"
    test_api "TC-PROD-002: Search" "GET" "/api/products?search=test" "" "200"
    test_api "TC-PROD-005: Not found" "GET" "/api/products/not-found" "" "404"
fi

# Cart Tests
if [ "${GROUP}" = "cart" ]; then
    echo -e "\n${YELLOW}=== Cart Tests ===${NC}"
    
    LOGIN=$(curl -s -X POST -H "Content-Type: application/json" \
        -d '{"email": "test1@gmail.com", "password": "Aa123456"}' \
        "${BASE_URL}/api/auth/login")
    TOKEN=$(echo ${LOGIN} | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    
    test_api "TC-CART-001: Get cart" "GET" "/api/cart/items" "" "200" "${TOKEN}"
    test_api "TC-ORDER-002: Empty cart order" "POST" "/api/orders" "" "400" "${TOKEN}"
fi

# Order Tests
if [ "${GROUP}" = "orders" ]; then
    echo -e "\n${YELLOW}=== Order Tests ===${NC}"
    
    LOGIN=$(curl -s -X POST -H "Content-Type: application/json" \
        -d '{"email": "test1@gmail.com", "password": "Aa123456"}' \
        "${BASE_URL}/api/auth/login")
    TOKEN=$(echo ${LOGIN} | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    
    test_api "TC-ORDER-004: List orders" "GET" "/api/orders" "" "200" "${TOKEN}"
    test_api "TC-ORDER-006: Not found" "GET" "/api/orders/not-found" "" "404" "${TOKEN}"
fi

# Admin Tests
if [ "${GROUP}" = "admin" ]; then
    echo -e "\n${YELLOW}=== Admin Tests ===${NC}"
    
    LOGIN=$(curl -s -X POST -H "Content-Type: application/json" \
        -d '{"email": "test1@gmail.com", "password": "Aa123456"}' \
        "${BASE_URL}/api/auth/login")
    TOKEN=$(echo ${LOGIN} | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    
    test_api "TC-ADMIN-PROD-002: User access admin" "GET" "/api/admin/products" "" "403" "${TOKEN}"
fi

# Integration Tests
if [ "${GROUP}" = "integration" ]; then
    echo -e "\n${YELLOW}=== Integration Tests ===${NC}"
    
    echo "TC-INT-001: Complete flow test..."
    TIMESTAMP=$(date +%s)
    
    # Register
    REG=$(curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"email\": \"int_${TIMESTAMP}@test.com\", \"password\": \"pass123\", \"fullName\": \"Test\"}" \
        "${BASE_URL}/api/auth/register")
    
    if echo "${REG}" | grep -q '"success":true'; then
        echo "  Register: PASSED"
        PASSED=$((PASSED + 1))
        INT_TOKEN=$(echo ${REG} | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
        
        # Get profile
        PROF=$(curl -s -H "Authorization: Bearer ${INT_TOKEN}" \
            "${BASE_URL}/api/user/profile")
        if echo "${PROF}" | grep -q '"success":true'; then
            echo "  Profile: PASSED"
            PASSED=$((PASSED + 1))
        else
            echo "  Profile: FAILED"
            FAILED=$((FAILED + 1))
        fi
        TOTAL=$((TOTAL + 1))
        
        # Get products
        PROD=$(curl -s "${BASE_URL}/api/products")
        if echo "${PROD}" | grep -q '"success":true'; then
            echo "  Products: PASSED"
            PASSED=$((PASSED + 1))
        else
            echo "  Products: FAILED"
            FAILED=$((FAILED + 1))
        fi
        TOTAL=$((TOTAL + 1))
    else
        echo "  Register: FAILED"
        FAILED=$((FAILED + 1))
    fi
    TOTAL=$((TOTAL + 1))
fi

# Summary
echo ""
echo "=========================================="
echo "Summary: ${GROUP}"
echo "=========================================="
echo -e "Total: ${TOTAL}"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"

cat > ${REPORT_DIR}/${GROUP}-report.txt << EOF
Group: ${GROUP}
Date: $(date)
Total: ${TOTAL}
Passed: ${PASSED}
Failed: ${FAILED}
EOF

[ ${FAILED} -eq 0 ] && exit 0 || exit 1
