# TMDb Movie & TV Series Manager

Versione moderna della tua applicazione Node.js - Da un semplice Task Manager a una completa app di gestione film e serie TV con integrazione all'API di TMDb!

## Quale Versione Usare?

### app.html (Versione Vecchia - Task Manager)
```
DEPRECATO - Per retrocompatibilità solo
- Gestione task (Todo list)
- Non funziona con nuova struttura database
- Database: mongodb://localhost:27017/Verifica (non esiste più)
```

### app_tmdb.html (VERSIONE NUOVA - Consigliata)
```
 ATTIVO E FUNZIONANTE
- Ricerca film e serie TV
- Gestione liste personali
- Sistema di review/rating
- Preferiti
- Database: mongodb://localhost:27017/TMDB
- URL: http://localhost:3000/app
```

## Quick Start

### 1. Avvio Veloce (2 minuti)
```bash
# Avvia il server
npm start

# Apri browser
http://localhost:3000
```

### 2. Primo Accesso
1. Clicca "Non hai un account? Registrati"
2. Inserisci credenziali
3. Accedi all'app
4. Inizia a cercare film!

### 3. Funzionalità Principali
- Ricerca: Digita titolo film/serie TV
- Preferiti: Salva i tuoi preferiti
- Liste: Crea liste personalizzate ("Da Vedere", "Visti", etc.)
- Valutazioni: Lascia review e commenti
- Dettagli: Vedi cast, trailer, generi, etc.

---

##  Documentazione

La documentazione è divisa in più file per facilità:

### Inizio
 **[QUICK_START.md](QUICK_START.md)** - Setup e primi passi 

### Uso dell'App
 **[README_TMDB.md](README_TMDB.md)** - Funzionalità, setup, utilizzo

### Per Sviluppatori
**[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Tutti gli endpoint, parametri, response
 **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Da Task Manager a TMDb Manager

**[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)** - Tutte le modifiche effettuate

### Test
**[test_api.sh](test_api.sh)** - Script automatico per testare gli endpoint

---

##  Tech Stack

```
Frontend:  HTML5 + CSS3 + Vanilla JavaScript
Backend:   Node.js + Express.js
Database:  MongoDB
API:       TMDb API v3
Auth:      JWT + bcryptjs
```

##  Requisiti Implementati

###  Integrazione TMDb (Requisito B)
- [x] Ricerca film e serie tramite API TMDb
- [x] Visualizzazione dettagli:
  - Titolo, trama
  - Cast e regia
  - Valutazioni
  - Trailer (link YouTube)
  - Immagini (poster, backdrop)
- [x] Salvataggio contenuti in database personale

### Gestione Contenuti (Requisito C)
- [x] Creazione liste personalizzate ("Da Vedere", "Visti", etc.)
- [x] Modifica/eliminazione liste
- [x] Modifica/eliminazione contenuti da liste
- [x] Commenti per ogni contenuto
- [x] Valutazioni (1-10) per ogni contenuto

###  Bonus
- [x] Sistema Preferiti
- [x] Review della community
- [x] UI moderna e responsive
- [x] Ricerca avanzata (film/tv/tutti)

---

## API Key TMDb

La tua API key è già configurata nel file `.env`:
```
API_KEY=2cc190c66d2ab8347597a0128cd71b61
```

Se scade o hai bisogno di una nuova:
1. Vai su https://www.themoviedb.org/settings/api
2. Copia la tua API Key
3. Aggiorna il file `.env`
4. Riavvia il server

---

## Struttura Progetto

```
VerificaNodeJs/
├── config/
│   ├── database.js          
│   └── tmdb.js               Integrazione API TMDb
├── middleware/
│   └── auth.js              Autenticazione JWT
├── models/
│   ├── User.js               Aggiornato (+ favoriti, liste)
│   ├── Media.js             Nuovo (film/serie + reviews)
│   └── List.js              Nuovo (liste personali)
├── public/
│   ├── app_tmdb.html      
│   ├── login.html            Compatibile
│   └── register.html         Compatibile
├── .env                      Configurato
├── package.json              Aggiornato
├── server.js                 Completamente riscritto
└── README_TMDB.md            Nuova documentazione
```

---

##  Flow Completo

### 1. Registrazione/Login
```
http://localhost:3000 → Login/Register
```

### 2. Dashboard
```
http://localhost:3000/app
├── Ricerca film/serie
├── Visualizza preferiti
└── Gestisci liste personali
```

### 3. Dettagli Media
```
Click su film → Modale con:
├── Trama e informazioni
├── Cast e trailer
├── Valutazioni
└── Commenti della community
```

### 4. Liste Personali
```
Sidebar → Crea lista → Aggiungi film
```

---

##  Comandi Principali

```bash
# Avviare il server
npm start

# Installare dipendenze
npm install

# Testare gli endpoint (bash/WSL)
bash test_api.sh

# Verificare MongoDB
mongosh
> use TMDB
> db.medias.find()
```

---

## Problemi Comuni?

### Errore: "MongoDB non connesso"
→ Assicurati che MongoDB sia avviato (`mongod`)

### Errore: "Porta 3000 già in uso"
→ Cambia PORT in `.env` o termina il processo su porta 3000

### "API Key non valida"
→ Verifica la chiave TMDb nel file `.env`

### App bianca/non carica
→ Apri la console del browser (F12) e vedi gli errori

**Per più dettagli**: Vedi [QUICK_START.md](QUICK_START.md) → Troubleshooting

---

##  API Endpoints Disponibili

```
Autenticazione:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/logout
  GET    /api/auth/me

Ricerca TMDb:
  GET    /api/tmdb/search?query=...&type=...
  GET    /api/tmdb/movie/:id
  GET    /api/tmdb/tv/:id

Media Personali:
  POST   /api/media
  GET    /api/media/:tmdbId

Review/Valutazioni:
  POST   /api/media/:tmdbId/reviews
  GET    /api/media/:tmdbId/reviews
  DELETE /api/media/:tmdbId/reviews/:reviewId

Liste:
  POST   /api/lists
  GET    /api/lists
  GET    /api/lists/:listId
  PUT    /api/lists/:listId
  DELETE /api/lists/:listId
  POST   /api/lists/:listId/media/:tmdbId
  DELETE /api/lists/:listId/media/:mediaId

Preferiti:
  POST   /api/favorites/:tmdbId
  DELETE /api/favorites/:mediaId
  GET    /api/favorites
```

**Documentazione completa**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

##  Per Chi Vuole Approfondire

### Leggere Prima
1. **QUICK_START.md** - Setup iniziale
2. **README_TMDB.md** - Overview funzionalità
3. **API_DOCUMENTATION.md** - Dettagli tecnici

### Per Lo Sviluppo
1. Esamina `server.js` - La logica principale
2. Esamina `config/tmdb.js` - Integrazione API
3. Esamina `public/app_tmdb.html` - Frontend
4. Leggi i commenti nel codice

### Per Testare
1. Usa `test_api.sh` per automatico
2. Usa curl/Postman per singolo endpoint
3. Usa browser DevTools (F12) per debug

---

## Checklist Primo Utilizzo

- [ ] File `.env` verificato
- [ ] MongoDB avviato
- [ ] Server avviato (`npm start`)
- [ ] App raggiungibile (http://localhost:3000)
- [ ] Registrazione completata
- [ ] Ricerca film funzionante
- [ ] Film aggiunto ai preferiti
- [ ] Lista creata
- [ ] Film aggiunto a lista
- [ ] Review lasciata
- [ ] Valutazione aggiunta

---

##  Congratulazioni!

Hai trasformato con successo il tuo Task Manager in una moderna **applicazione TMDb**!

### Cosa Puoi Fare Ora:
 Cercare film e serie TV in tempo reale  
 Salvare preferiti personalizzati  
 Creare liste personalizzate  
 Lasciare review e valutazioni  
 Esplorare contenuti  
 Scoprire nuovi film  

### Prossimi Step:
→ Leggi la documentazione  
→ Esplora l'API  
→ Personalizza l'interfaccia  
→ Aggiungi nuove funzionalità  

---

##  Supporto

Domande? Vedi:
- **Setup**: [QUICK_START.md](QUICK_START.md)
- **Uso App**: [README_TMDB.md](README_TMDB.md)
- **API**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Migrazione**: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **Modifiche**: [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)

---



