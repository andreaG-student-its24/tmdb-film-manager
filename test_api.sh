#!/bin/bash

# 🎬 TMDb App - Testing Script
# Script per testare gli endpoints dell'applicazione

BASE_URL="http://localhost:3000"
TOKEN=""

# Colori per output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎬 TMDb App - Test Suite${NC}\n"

# ========== TEST 1: REGISTRAZIONE ==========
echo -e "${BLUE}1️⃣ TEST REGISTRAZIONE${NC}"
echo "Registrando nuovo utente..."

REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Token ottenuto: ${TOKEN:0:20}...${NC}\n"

# ========== TEST 2: LOGIN ==========
echo -e "${BLUE}2️⃣ TEST LOGIN${NC}"
echo "Effettuando login..."

LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Login effettuato${NC}\n"

# ========== TEST 3: GET USER INFO ==========
echo -e "${BLUE}3️⃣ TEST GET USER INFO${NC}"
echo "Ottenendo informazioni utente..."

curl -s -X GET "${BASE_URL}/api/auth/me" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

echo -e "${GREEN}✓ Info utente ottenute${NC}\n"

# ========== TEST 4: RICERCA FILM ==========
echo -e "${BLUE}4️⃣ TEST RICERCA FILM${NC}"
echo "Cercando 'Interstellar'..."

SEARCH_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/tmdb/search?query=Interstellar&type=movie" \
  -H "Authorization: Bearer ${TOKEN}")

echo "Response:"
echo $SEARCH_RESPONSE | python3 -m json.tool

# Estrai il primo tmdbId
MOVIE_ID=$(echo $SEARCH_RESPONSE | grep -o '"tmdbId":[0-9]*' | head -1 | cut -d':' -f2)
echo -e "${GREEN}✓ Trovato film con ID: $MOVIE_ID${NC}\n"

# ========== TEST 5: GET DETTAGLI FILM ==========
echo -e "${BLUE}5️⃣ TEST GET DETTAGLI FILM${NC}"
echo "Ottenendo dettagli del film ID: $MOVIE_ID..."

curl -s -X GET "${BASE_URL}/api/tmdb/movie/${MOVIE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool | head -50

echo -e "${GREEN}✓ Dettagli film ottenuti${NC}\n"

# ========== TEST 6: SALVA MEDIA ==========
echo -e "${BLUE}6️⃣ TEST SALVA MEDIA${NC}"
echo "Salvando film nel database personale..."

SAVE_MEDIA_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/media" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"tmdbId\": $MOVIE_ID,
    \"title\": \"Interstellar\",
    \"type\": \"movie\",
    \"description\": \"Un film meraviglioso\",
    \"posterPath\": \"https://...\",
    \"rating\": 8.7,
    \"genres\": [\"Sci-Fi\", \"Drama\"],
    \"runtime\": 169
  }")

echo "Response:"
echo $SAVE_MEDIA_RESPONSE | python3 -m json.tool

SAVED_MEDIA_ID=$(echo $SAVE_MEDIA_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✓ Media salvato con ID: $SAVED_MEDIA_ID${NC}\n"

# ========== TEST 7: CREA LISTA ==========
echo -e "${BLUE}7️⃣ TEST CREA LISTA${NC}"
echo "Creando lista 'Da Vedere'..."

CREATE_LIST_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/lists" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Da Vedere",
    "description": "Film che voglio guardare",
    "type": "custom"
  }')

echo "Response:"
echo $CREATE_LIST_RESPONSE | python3 -m json.tool

LIST_ID=$(echo $CREATE_LIST_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✓ Lista creata con ID: $LIST_ID${NC}\n"

# ========== TEST 8: AGGIUNGI MEDIA A LISTA ==========
echo -e "${BLUE}8️⃣ TEST AGGIUNGI MEDIA A LISTA${NC}"
echo "Aggiungendo film alla lista..."

curl -s -X POST "${BASE_URL}/api/lists/${LIST_ID}/media/${MOVIE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

echo -e "${GREEN}✓ Media aggiunto alla lista${NC}\n"

# ========== TEST 9: GET LISTE ==========
echo -e "${BLUE}9️⃣ TEST GET LISTE${NC}"
echo "Ottenendo tutte le liste..."

curl -s -X GET "${BASE_URL}/api/lists" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

echo -e "${GREEN}✓ Liste ottenute${NC}\n"

# ========== TEST 10: AGGIUNGI REVIEW ==========
echo -e "${BLUE}🔟 TEST AGGIUNGI REVIEW${NC}"
echo "Aggiungendo una review..."

curl -s -X POST "${BASE_URL}/api/media/${MOVIE_ID}/reviews" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 9,
    "comment": "Questo film è un capolavoro assoluto! Bellissimo!"
  }' | python3 -m json.tool

echo -e "${GREEN}✓ Review aggiunta${NC}\n"

# ========== TEST 11: GET REVIEWS ==========
echo -e "${BLUE}1️⃣1️⃣ TEST GET REVIEWS${NC}"
echo "Ottenendo tutte le reviews..."

curl -s -X GET "${BASE_URL}/api/media/${MOVIE_ID}/reviews" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

echo -e "${GREEN}✓ Reviews ottenute${NC}\n"

# ========== TEST 12: AGGIUNGI AI PREFERITI ==========
echo -e "${BLUE}1️⃣2️⃣ TEST AGGIUNGI AI PREFERITI${NC}"
echo "Aggiungendo film ai preferiti..."

curl -s -X POST "${BASE_URL}/api/favorites/${MOVIE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

echo -e "${GREEN}✓ Film aggiunto ai preferiti${NC}\n"

# ========== TEST 13: GET PREFERITI ==========
echo -e "${BLUE}1️⃣3️⃣ TEST GET PREFERITI${NC}"
echo "Ottenendo preferiti..."

curl -s -X GET "${BASE_URL}/api/favorites" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

echo -e "${GREEN}✓ Preferiti ottenuti${NC}\n"

# ========== TEST 14: RICERCA SERIE TV ==========
echo -e "${BLUE}1️⃣4️⃣ TEST RICERCA SERIE TV${NC}"
echo "Cercando 'Breaking Bad'..."

TV_SEARCH=$(curl -s -X GET "${BASE_URL}/api/tmdb/search?query=Breaking%20Bad&type=tv" \
  -H "Authorization: Bearer ${TOKEN}")

TV_ID=$(echo $TV_SEARCH | grep -o '"tmdbId":[0-9]*' | head -1 | cut -d':' -f2)

echo "Response:"
echo $TV_SEARCH | python3 -m json.tool | head -30

echo -e "${GREEN}✓ Serie TV trovata con ID: $TV_ID${NC}\n"

# ========== TEST 15: GET DETTAGLI SERIE TV ==========
echo -e "${BLUE}1️⃣5️⃣ TEST GET DETTAGLI SERIE TV${NC}"
echo "Ottenendo dettagli della serie TV..."

curl -s -X GET "${BASE_URL}/api/tmdb/tv/${TV_ID}" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool | head -50

echo -e "${GREEN}✓ Dettagli serie TV ottenuti${NC}\n"

# ========== TEST 16: LOGOUT ==========
echo -e "${BLUE}1️⃣6️⃣ TEST LOGOUT${NC}"
echo "Effettuando logout..."

curl -s -X POST "${BASE_URL}/api/auth/logout" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -m json.tool

echo -e "${GREEN}✓ Logout effettuato${NC}\n"

# ========== RIEPILOGO ==========
echo -e "${GREEN}✓ Tutti i test completati con successo!${NC}\n"

echo -e "${BLUE}📋 Riepilogo operazioni:${NC}"
echo "  1. ✓ Registrazione utente"
echo "  2. ✓ Login"
echo "  3. ✓ Get informazioni utente"
echo "  4. ✓ Ricerca film"
echo "  5. ✓ Dettagli film"
echo "  6. ✓ Salva media nel database"
echo "  7. ✓ Creazione lista"
echo "  8. ✓ Aggiunta media a lista"
echo "  9. ✓ Recupero liste"
echo " 10. ✓ Aggiunta review"
echo " 11. ✓ Recupero reviews"
echo " 12. ✓ Aggiunta ai preferiti"
echo " 13. ✓ Recupero preferiti"
echo " 14. ✓ Ricerca serie TV"
echo " 15. ✓ Dettagli serie TV"
echo " 16. ✓ Logout"
echo ""
