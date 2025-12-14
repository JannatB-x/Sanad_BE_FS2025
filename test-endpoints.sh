#!/bin/bash

# Test script for Sanad Backend API endpoints
# Usage: ./test-endpoints.sh

BASE_URL="http://134.122.96.197:3000/api"

echo "=========================================="
echo "Testing Sanad Backend API Endpoints"
echo "Base URL: $BASE_URL"
echo "=========================================="
echo ""

# Test 1: API Info Endpoint
echo "1. Testing API Info Endpoint (GET /api)"
echo "----------------------------------------"
curl -X GET "$BASE_URL" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""
echo ""

# Test 2: Calendar Health Check (No auth required)
echo "2. Testing Calendar Health Check (GET /api/calendar/health)"
echo "----------------------------------------"
curl -X GET "$BASE_URL/calendar/health" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""
echo ""

# Test 3: Calendar GET (Should return 401 without token)
echo "3. Testing Calendar GET without token (GET /api/calendar)"
echo "Expected: 401 Unauthorized"
echo "----------------------------------------"
curl -X GET "$BASE_URL/calendar" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""
echo ""

# Test 4: Calendar POST without token (Should return 401)
echo "4. Testing Calendar POST without token (POST /api/calendar)"
echo "Expected: 401 Unauthorized"
echo "----------------------------------------"
curl -X POST "$BASE_URL/calendar" \
  -H "Content-Type: application/json" \
  -d '{"Title":"Test","Location":"Test Location","Date":"2024-12-15","Time":"10:00"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""
echo ""

# Test 5: User Login (to get token for authenticated tests)
echo "5. Testing User Login (POST /api/users/login)"
echo "----------------------------------------"
LOGIN_RESPONSE=$(curl -X POST "$BASE_URL/users/login" \
  -H "Content-Type: application/json" \
  -d '{"Email":"test@example.com","Password":"testpassword"}' \
  -w "\nHTTP Status: %{http_code}" \
  -s)

echo "$LOGIN_RESPONSE"
echo ""

# Extract token if login successful
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Token received: ${TOKEN:0:20}..."
  echo ""
  
  # Test 6: Calendar GET with token
  echo "6. Testing Calendar GET with token (GET /api/calendar)"
  echo "----------------------------------------"
  curl -X GET "$BASE_URL/calendar" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -w "\nHTTP Status: %{http_code}\n" \
    -s
  echo ""
  echo ""
  
  # Test 7: Calendar POST with token
  echo "7. Testing Calendar POST with token (POST /api/calendar)"
  echo "----------------------------------------"
  curl -X POST "$BASE_URL/calendar" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"Title":"Doctor Appointment","Location":"1234 Main Street","Date":"2024-12-20","Time":"14:30"}' \
    -w "\nHTTP Status: %{http_code}\n" \
    -s
  echo ""
  echo ""
else
  echo "⚠️  No token received. Skipping authenticated tests."
  echo "   (This is normal if test credentials don't exist)"
  echo ""
fi

echo "=========================================="
echo "Testing Complete"
echo "=========================================="
