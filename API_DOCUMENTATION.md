# Documentazione API TMDb App

## Base URL
```
http://localhost:3000
```

## Autenticazione
Tutte le rotte protette richiedono:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints Autenticazione

### POST `/api/auth/register`
Registra un nuovo utente.

**Request Body:**
```json
{
  "username": "string (3-50 caratteri)",
  "email": "string (formato valido)",
  "password": "string (min 6 caratteri)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registrazione completata con successo",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Errori:**
- `400` - Campi obbligatori mancanti
- `409` - Username o Email già in uso

---

### POST `/api/auth/login`
Effettua il login dell'utente.

**Request Body:**
```json
{
  "username": "string (username o email)",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login effettuato con successo",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

**Errori:**
- `400` - Credenziali mancanti
- `401` - Credenziali non valide

---

### POST `/api/auth/logout`
Effettua il logout dell'utente.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout effettuato con successo"
}
```

---

### GET `/api/auth/me` Protetto
Ottieni i dati dell'utente attualmente autenticato.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "lists": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Da Vedere",
          "type": "custom"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

## Endpoints Ricerca TMDb

### GET `/api/tmdb/search`
Ricerca film e serie TV.

**Query Parameters:**
```
query: string (obbligatorio) - Termine di ricerca
type: "all" | "movie" | "tv" (default: "all")
```

**Esempio:**
```
GET /api/tmdb/search?query=Interstellar&type=movie
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "tmdbId": 157336,
      "title": "Interstellar",
      "type": "movie",
      "description": "Un team di astronauti...",
      "posterPath": "https://image.tmdb.org/t/p/w500/...",
      "backdropPath": "https://image.tmdb.org/t/p/w500/...",
      "releaseDate": "2014-11-07",
      "rating": 8.7,
      "genres": ["Adventure", "Drama", "Sci-Fi"]
    },
    ...
  ]
}
```

---

### GET `/api/tmdb/movie/:id`
Ottieni dettagli completi di un film.

**URL Parameters:**
```
id: string (TMDb Movie ID)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tmdbId": 157336,
    "title": "Interstellar",
    "type": "movie",
    "description": "A team of astronauts travel through a wormhole...",
    "posterPath": "https://image.tmdb.org/t/p/w500/...",
    "backdropPath": "https://image.tmdb.org/t/p/w500/...",
    "releaseDate": "2014-11-07",
    "rating": 8.7,
    "genres": ["Adventure", "Drama", "Sci-Fi"],
    "cast": [
      {
        "name": "Matthew McConaughey",
        "character": "Cooper",
        "profilePath": "https://image.tmdb.org/t/p/w500/..."
      },
      ...
    ],
    "director": [
      {
        "name": "Christopher Nolan"
      }
    ],
    "trailerUrl": "https://www.youtube.com/watch?v=...",
    "runtime": 169
  }
}
```

---

### GET `/api/tmdb/tv/:id`
Ottieni dettagli completi di una serie TV.

**URL Parameters:**
```
id: string (TMDb TV ID)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tmdbId": 1399,
    "title": "Game of Thrones",
    "type": "tv",
    "description": "Nine noble families fight...",
    "posterPath": "https://image.tmdb.org/t/p/w500/...",
    "backdropPath": "https://image.tmdb.org/t/p/w500/...",
    "releaseDate": "2011-04-17",
    "rating": 9.3,
    "genres": ["Action", "Adventure", "Drama"],
    "cast": [...],
    "director": [...],
    "trailerUrl": "https://www.youtube.com/watch?v=...",
    "numberOfSeasons": 8
  }
}
```

---

## Endpoints Media

### POST `/api/media` Protetto
Salva un media nel database personale.

**Request Body:**
```json
{
  "tmdbId": 157336,
  "title": "Interstellar",
  "type": "movie",
  "description": "...",
  "posterPath": "https://...",
  "releaseDate": "2014-11-07",
  "rating": 8.7,
  "genres": ["Adventure", "Drama"],
  "cast": [],
  "director": [],
  "trailerUrl": "https://youtube.com/watch?v=...",
  "runtime": 169
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Contenuto salvato con successo",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "tmdbId": 157336,
    "title": "Interstellar",
    ...
  }
}
```

---

### GET `/api/media/:tmdbId`
Ottieni i dettagli di un media salvato (con reviews).

**URL Parameters:**
```
tmdbId: number (TMDb ID)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "tmdbId": 157336,
    "title": "Interstellar",
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "userId": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "john_doe"
        },
        "rating": 9,
        "comment": "Capolavoro assoluto!",
        "createdAt": "2024-01-20T15:30:00Z"
      }
    ],
    ...
  }
}
```

---

## Endpoints Reviews

### POST `/api/media/:tmdbId/reviews` Protetto
Aggiungi o aggiorna una review per un media.

**URL Parameters:**
```
tmdbId: number
```

**Request Body:**
```json
{
  "rating": 8,
  "comment": "Bellissimo film, davvero emozionante!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Review salvata con successo",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "userId": "507f1f77bcf86cd799439011",
        "rating": 8,
        "comment": "Bellissimo film, davvero emozionante!",
        "createdAt": "2024-01-20T15:30:00Z"
      }
    ]
  }
}
```

**Errori:**
- `400` - Rating non valido (deve essere 1-10)
- `404` - Media non trovato

---

### GET `/api/media/:tmdbId/reviews`
Ottieni tutte le reviews di un media.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe"
      },
      "rating": 8,
      "comment": "Bellissimo!",
      "createdAt": "2024-01-20T15:30:00Z"
    },
    ...
  ]
}
```

---

### DELETE `/api/media/:tmdbId/reviews/:reviewId` Protetto
Elimina una review (solo il proprietario).

**URL Parameters:**
```
tmdbId: number
reviewId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Review eliminata con successo"
}
```

**Errori:**
- `403` - Non sei il proprietario della review
- `404` - Review non trovata

---

## Endpoints Liste

### POST `/api/lists` Protetto
Crea una nuova lista personale.

**Request Body:**
```json
{
  "name": "Da Vedere",
  "description": "Film che voglio guardare",
  "type": "custom",
  "isPrivate": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Lista creata con successo",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "Da Vedere",
    "description": "Film che voglio guardare",
    "type": "custom",
    "mediaItems": [],
    "isPrivate": false,
    "createdAt": "2024-01-20T15:30:00Z"
  }
}
```

---

### GET `/api/lists` Protetto
Ottieni tutte le liste dell'utente.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Da Vedere",
      "type": "custom",
      "mediaItems": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "title": "Interstellar",
          ...
        }
      ],
      "isPrivate": false
    },
    ...
  ]
}
```

---

### GET `/api/lists/:listId` Protetto
Ottieni una lista specifica con i media al suo interno.

**URL Parameters:**
```
listId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Da Vedere",
    "mediaItems": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Interstellar",
        "rating": 8.7,
        ...
      }
    ]
  }
}
```

---

### PUT `/api/lists/:listId` ⚠️ Protetto
Modifica una lista.

**Request Body:**
```json
{
  "name": "Film da guardare",
  "description": "I miei film preferiti",
  "isPrivate": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Lista aggiornata con successo",
  "data": { ... }
}
```

---

### DELETE `/api/lists/:listId` ⚠️ Protetto
Elimina una lista.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Lista eliminata con successo"
}
```

---

### POST `/api/lists/:listId/media/:tmdbId` ⚠️ Protetto
Aggiungi un media a una lista.

**URL Parameters:**
```
listId: string
tmdbId: number
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Contenuto aggiunto alla lista",
  "data": { ... }
}
```

**Errori:**
- `409` - Media già presente nella lista

---

### DELETE `/api/lists/:listId/media/:mediaId` ⚠️ Protetto
Rimuovi un media da una lista.

**URL Parameters:**
```
listId: string
mediaId: string (MongoDB ObjectId del media)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Contenuto rimosso dalla lista",
  "data": { ... }
}
```

---

## ❤️ Endpoints Preferiti

### POST `/api/favorites/:tmdbId` ⚠️ Protetto
Aggiungi un media ai preferiti.

**URL Parameters:**
```
tmdbId: number
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Contenuto aggiunto ai preferiti"
}
```

---

### DELETE `/api/favorites/:mediaId` ⚠️ Protetto
Rimuovi un media dai preferiti.

**URL Parameters:**
```
mediaId: string (MongoDB ObjectId del media)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Contenuto rimosso dai preferiti"
}
```

---

### GET `/api/favorites` ⚠️ Protetto
Ottieni tutti i media preferiti dell'utente.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Interstellar",
      "rating": 8.7,
      ...
    },
    ...
  ]
}
```

---

## 🔴 Codici di Errore

| Codice | Significato |
|--------|------------|
| `200` | OK - Richiesta riuscita |
| `201` | Created - Risorsa creata |
| `400` | Bad Request - Parametri non validi |
| `401` | Unauthorized - Token mancante o non valido |
| `403` | Forbidden - Non autorizzato |
| `404` | Not Found - Risorsa non trovata |
| `409` | Conflict - Risorsa già esistente |
| `500` | Internal Server Error - Errore server |

---

## 📌 Note Importanti

1. **Token JWT**: Ha una durata limitata. Se scade, effettua il login di nuovo.
2. **TMDb API Key**: Deve essere configurata nel file `.env`
3. **Rate Limiting**: TMDb ha limiti di richieste (verificare la documentazione ufficiale)
4. **Data Validation**: Tutti gli input sono validati lato server
5. **User Privacy**: Ogni utente vede solo i propri dati

---

## 🧪 Esempio di Flow Completo

```bash
# 1. Registrazione
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Risposta: { token: "eyJ...", user: { id: "...", ... } }

# 2. Ricerca Film
curl http://localhost:3000/api/tmdb/search?query=Interstellar

# Risposta: [{ tmdbId: 157336, title: "Interstellar", ... }]

# 3. Ottieni Dettagli Film
curl http://localhost:3000/api/tmdb/movie/157336

# 4. Salva Film nel Database
curl -X POST http://localhost:3000/api/media \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{ tmdbId: 157336, title: "Interstellar", ... }'

# 5. Crea una Lista
curl -X POST http://localhost:3000/api/lists \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{ name: "Da Vedere" }'

# 6. Aggiungi Film alla Lista
curl -X POST http://localhost:3000/api/lists/{listId}/media/157336 \
  -H "Authorization: Bearer eyJ..."

# 7. Aggiungi ai Preferiti
curl -X POST http://localhost:3000/api/favorites/157336 \
  -H "Authorization: Bearer eyJ..."

# 8. Lascia una Review
curl -X POST http://localhost:3000/api/media/157336/reviews \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{ rating: 9, comment: "Capolavoro!" }'
```

---

## 📖 Ulteriori Risorse

- [TMDb API Documentation](https://www.themoviedb.org/settings/api)
- [JWT.io](https://jwt.io)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Documentation](https://expressjs.com)
