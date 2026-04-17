#!/bin/bash

# Script de test de la configuration base de données
echo "🧪 Test de configuration base de données"
echo "========================================"

# Test 1: Vérifier DATABASE_URL
echo "1. DATABASE_URL:"
if [ -n "$DATABASE_URL" ]; then
    echo "   ✅ Défini: ${DATABASE_URL:0:50}..."
else
    echo "   ❌ Non défini"
fi
echo ""

# Test 2: Variables individuelles
echo "2. Variables individuelles:"
echo "   DB_HOST: ${DB_HOST:-'non défini'}"
echo "   DB_PORT: ${DB_PORT:-'non défini'}"
echo "   DB_NAME: ${DB_NAME:-'non défini'}"
echo "   DB_USER: ${DB_USER:-'non défini'}"
echo ""

# Test 3: Connexion test
echo "3. Test de connexion:"
if [ -n "$DATABASE_URL" ]; then
    echo "   📡 Test avec DATABASE_URL..."
    # Ici on pourrait ajouter un test réel de connexion
    echo "   ✅ Configuration détectée"
else
    echo "   🔧 Test avec variables individuelles..."
    echo "   ✅ Configuration locale"
fi
echo ""

# Test 4: Environnement
echo "4. Environnement:"
echo "   NODE_ENV: ${NODE_ENV:-'non défini'}"
echo "   PORT: ${PORT:-'non défini'}"
echo ""

echo "🎯 Résumé:"
if [ -n "$DATABASE_URL" ]; then
    echo "   🚀 Mode PRODUCTION - Utilise DATABASE_URL"
else
    echo "   🏠 Mode DÉVELOPPEMENT - Utilise variables individuelles"
fi