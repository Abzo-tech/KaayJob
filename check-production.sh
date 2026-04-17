#!/bin/bash

# Script de vérification des données KaayJob en production
# Utilisation: ./check-production.sh [URL_API]

API_URL=${1:-"https://kaay-job.vercel.app/api"}
ADMIN_EMAIL=${2:-"admin@kaayjob.com"}
ADMIN_PASSWORD=${3:-"Password123"}

echo "🔍 Vérification des données KaayJob en production"
echo "📍 API URL: $API_URL"
echo "👤 Admin: $ADMIN_EMAIL"
echo ""

# Test 1: Health check
echo "🏥 Test 1: Health check"
curl -s -X GET "$API_URL/health" -H "Content-Type: application/json" | jq . || echo "❌ Health check échoué"
echo ""

# Test 2: Connexion admin
echo "🔐 Test 2: Connexion administrateur"
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" | jq -r '.data.token // empty')

if [ -z "$TOKEN" ]; then
  echo "❌ Échec de connexion admin"
  exit 1
fi

echo "✅ Connexion admin réussie"
echo ""

# Test 3: Statistiques admin
echo "📊 Test 3: Statistiques administrateur"
curl -s -X GET "$API_URL/admin/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq . || echo "❌ Stats admin échoué"
echo ""

# Test 4: Liste utilisateurs
echo "👥 Test 4: Liste utilisateurs"
curl -s -X GET "$API_URL/admin/users?limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.success, (.data | length)' || echo "❌ Liste users échoué"
echo ""

# Test 5: Liste services
echo "🔧 Test 5: Liste services"
curl -s -X GET "$API_URL/admin/services?limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.success, (.data | length)' || echo "❌ Liste services échoué"
echo ""

# Test 6: Liste réservations
echo "📅 Test 6: Liste réservations"
curl -s -X GET "$API_URL/admin/bookings?limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.success, (.data | length)' || echo "❌ Liste bookings échoué"
echo ""

# Test 7: API publique (catégories)
echo "📂 Test 7: API publique - Catégories"
curl -s -X GET "$API_URL/categories" \
  -H "Content-Type: application/json" | jq '.success, (.data | length)' || echo "❌ API catégories échoué"
echo ""

echo "✅ Vérifications terminées !"
echo ""
echo "📋 Résumé des endpoints disponibles :"
echo "   GET  $API_URL/health                    - Health check"
echo "   POST $API_URL/auth/login               - Connexion"
echo "   GET  $API_URL/admin/stats              - Stats admin"
echo "   GET  $API_URL/admin/users              - Liste users"
echo "   GET  $API_URL/admin/services           - Liste services"
echo "   GET  $API_URL/admin/bookings           - Liste réservations"
echo "   GET  $API_URL/categories               - Catégories publiques"
echo "   GET  $API_URL/providers               - Prestataires"
echo "   GET  $API_URL/services                - Services"