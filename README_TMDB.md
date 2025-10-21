# TMDb Film & Series App

Applicazione Node.js per la ricerca e gestione di film e serie TV tramite l'API di TMDb.

## Funzionalità Implementate

### A. Integrazione TMDb
- **Ricerca film e serie** tramite API TMDb
- **Visualizzazione dettagli** completi:
  - Titolo, trama, generi
  - Cast, regia, trailer
  - Valutazioni TMDB
  - Immagini (poster, backdrop)
- **Salvataggio contenuti** nel database personale dell'utente

### B. Gestione Contenuti Personali
- **Liste personali** di film e serie ("Da vedere", "Visti", etc.)
  - Creazione liste personalizzate
  - Modifica/eliminazione liste
  - Aggiunta/rimozione contenuti dalle liste
- **Commenti e Valutazioni** per ogni contenuto salvato (1-10)
- **Preferiti** - Salva i tuoi film e serie preferiti

### C. Autenticazione & Gestione Utenti
- Registrazione utenti con validazione email
- Login/Logout sicuro con JWT
- Hashing password con bcryptjs
- Gestione sessioni

##  Stack Tecnologico

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Autenticazione**: JWT + bcryptjs
- **API Esterna**: TMDb API v3
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript

##  Installazione

### Prerequisiti
- Node.js v14+
- MongoDB in esecuzione su `localhost:27017`

### Setup

1. **Installare le dipendenze**:
```bash
npm install
```

2. **Configurare variabili d'ambiente** (file `.env` già presente):
```
API_KEY=tua_chiave_api_tmdb
MONGODB_URI=localhost:27017/TMDB
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-session-secret-key-change-this-too
PORT=3000
NODE_ENV=development
```

3. **Avviare il server**:
```bash
npm start
```

4. **Accedere all'app**:
```
http://localhost:3000
```

##  Struttura Progetto

```
VerificaNodeJs/
├── config/
│   └── tmdb.js              # Integrazione API TMDb
├── middleware/
│   └── auth.js              # Middleware autenticazione JWT
├── models/
│   ├── User.js              # Schema utente
│   ├── Media.js             # Schema film/serie + reviews
│   └── List.js              # Schema liste personali
├── public/
│   ├── login.html           # Pagina login
│   ├── register.html        # Pagina registrazione
│   └── app_tmdb.html        # App principale
├── .env                     # Variabili ambiente
├── package.json             # Dipendenze
└── server.js                # Server principale
```

## API Endpoints

### Autenticazione
- `POST /api/auth/register` - Registrazione utente
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dati utente corrente

### Ricerca TMDb
- `GET /api/tmdb/search?query=...&type=all|movie|tv` - Ricerca film/serie
- `GET /api/tmdb/movie/:id` - Dettagli film
- `GET /api/tmdb/tv/:id` - Dettagli serie TV

### Media Personali
- `POST /api/media` - Salva un media nel database
- `GET /api/media/:tmdbId` - Ottieni media salvato

### Reviews & Valutazioni
- `POST /api/media/:tmdbId/reviews` - Aggiungi review
- `GET /api/media/:tmdbId/reviews` - Ottieni reviews
- `DELETE /api/media/:tmdbId/reviews/:reviewId` - Elimina review

### Liste Personali
- `POST /api/lists` - Crea lista
- `GET /api/lists` - Ottieni tutte le liste
- `GET /api/lists/:listId` - Ottieni lista specifica
- `PUT /api/lists/:listId` - Modifica lista
- `DELETE /api/lists/:listId` - Elimina lista
- `POST /api/lists/:listId/media/:tmdbId` - Aggiungi media a lista
- `DELETE /api/lists/:listId/media/:mediaId` - Rimuovi media da lista

### Preferiti
- `POST /api/favorites/:tmdbId` - Aggiungi ai preferiti
- `DELETE /api/favorites/:mediaId` - Rimuovi dai preferiti
- `GET /api/favorites` - Ottieni preferiti

##  Ottenere API Key TMDb

1. Registrati su [https://www.themoviedb.org](https://www.themoviedb.org)
2. Vai su Account → Settings → API
3. Copia la tua API Key
4. Inseriscila nel file `.env` come `API_KEY`

## Utilizzo dell'App

### Ricerca Film/Serie
1. Accedi con le tue credenziali
2. Inserisci il titolo nella barra di ricerca
3. Scegli se cercare "Film", "Serie TV" o "Tutti"
4. Clicca "Cerca"

### Aggiungi ai Preferiti
1. Dalla ricerca, clicca il bottone  su un film
2. Accedi alla tab "Preferiti" per vederli tutti

### Crea Liste Personali
1. Nella sidebar, inserisci il nome di una lista
2. Clicca "Crea Lista"
3. Aggiungi film/serie alle tue liste

### Valuta e Commenta
1. Clicca su un film/serie per vedere i dettagli
2. Inserisci una valutazione (1-10)
3. Aggiungi un commento
4. Clicca "Invia Valutazione"

## Troubleshooting

**Errore di connessione a MongoDB**:
- Assicurati che MongoDB sia in esecuzione
- Verifica che la porta sia 27017
- Controlla `MONGODB_URI` nel file `.env`

**Errore API TMDb**:
- Verifica che l'API Key sia corretta nel `.env`
- Controlla che la tua API Key sia attiva su TMDb
- Verifica la connessione internet

**Token non valido**:
- Effettua il logout e accedi di nuovo
- Cancella i dati locali del browser





##  Autore
Andrea Giovene
Progetto didattico - Node.js Verifica Intermedia

## Licenza

MIT
