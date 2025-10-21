# Guida Rapida di Avvio

## Quick Start (5 minuti)

### 1. Verificare i Prerequisiti

```bash
# Verificare Node.js
node --version  # v14+

# Verificare npm
npm --version   # v6+

# Verificare MongoDB
mongosh         # Dovrebbe connettersi
exit
```

### 2. Installare Dipendenze

```bash
cd "c:\Users\Andrea.Giovene\Node.js - Verifica infermedia\VerificaNodeJs"
npm install
```

### 3. Verificare il File .env

```
✓ API_KEY=2cc190c66d2ab8347597a0128cd71b61 (già configurato)
✓ MONGODB_URI=localhost:27017/TMDB
✓ JWT_SECRET e SESSION_SECRET configurati
✓ PORT=3000
```

### 4. Avviare il Server

```bash
npm start
```

Output atteso:
```
Server TMDb avviato su http://localhost:3000
API TMDb integrata
MongoDB connesso
```

### 5. Accedere all'App

Apri il browser:
```
http://localhost:3000
```

---

## Prima Volta - Setup Completo

### Step 1: Avviare MongoDB

**Windows (da PowerShell):**
```powershell
# Se installato localmente
mongod

# O se usi MongoDB Compass, avvia da lì
```

Verifica connessione:
```bash
mongosh
> use TMDB
> db.version()
```

### Step 2: Ottenere API Key TMDb

1. Vai su https://www.themoviedb.org/settings/api
2. Copia la tua **API Key**
3. Il file `.env` ha già la key configurata ✓

### Step 3: Avviare l'App

```bash
npm start
```

### Step 4: Registrarsi

1. Vai a http://localhost:3000
2. Click "Non hai un account? Registrati"
3. Inserisci:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Registrati"

### Step 5: Iniziare a Cercare

1. Accedi con le credenziali create
2. Cerca "Interstellar" nella barra di ricerca
3. Clicca su un film per vederne i dettagli
4. Prova le funzionalità:
   - ❤️ Aggiungi ai preferiti
   - ⭐ Lascia una valutazione
   - 📋 Crea una lista e aggiungi film

---

##  Troubleshooting

### Errore: "MongoDB non connesso"

**Problema:** 
```
 Errore MongoDB: connect ECONNREFUSED 127.0.0.1:27017
```

**Soluzione:**
```bash
# 1. Avviare MongoDB
mongod

# 2. Verificare porta
netstat -ano | findstr 27017

# 3. Se non è disponibile, verificare nel file .env:
MONGODB_URI=localhost:27017/TMDB
```

---

### Errore: "EADDRINUSE - Porta 3000 già in uso"

**Problema:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Soluzione:**

**Opzione 1: Terminare processo sulla porta 3000**
```powershell
# Trovare il processo
netstat -ano | findstr 3000

# Terminare (sostituire PID con il numero trovato)
taskkill /PID PID_NUMBER /F

# Riavviare il server
npm start
```

**Opzione 2: Usare porta diversa**
```bash
# Nel file .env, cambia:
PORT=3001

# Quindi accedi a:
http://localhost:3001
```

---

### Errore: "API Key non valida"

**Problema:**
```
API TMDb: Invalid API Key
```

**Soluzione:**
1. Verifica il file `.env`:
   ```
   API_KEY=2cc190c66d2ab8347597a0128cd71b61
   ```

2. Se la key è scaduta, vai su https://www.themoviedb.org/settings/api
3. Copia la nuova key e aggiorna `.env`
4. Riavvia il server

---

### Errore: "Cannot find module 'axios'"

**Problema:**
```
Error: Cannot find module 'axios'
```

**Soluzione:**
```bash
# Reinstallare le dipendenze
rm -r node_modules
npm install

# Verificare package.json contiene axios
cat package.json | grep axios
```

---

### Token JWT Scaduto o Non Valido

**Problema:**
```
Token non valido o scaduto
```

**Soluzione:**
1. Effettua il logout
2. Cancella i cookie del browser (Ctrl+Shift+Del)
3. Fai il login di nuovo

---

### La Ricerca Film Non Funziona

**Problema:**
```
Errore nella ricerca del contenuto
```

**Soluzione:**
1. Verifica connessione internet
2. Verifica API Key nel `.env`
3. Prova una ricerca semplice (es: "Interstellar" instead of "film123***")
4. Controlla i log del server

---

### Il Database Non Contiene Dati

**Problema:**
```
Nessun film trovato (lista vuota)
```

**Soluzione:**
1. La ricerca fa una query a TMDb, non al database locale
2. I film vengono salvati quando clicchi su uno
3. Per vedere i film salvati:
   ```bash
   mongosh
   use TMDB
   db.medias.find()
   ```

---

## 🔧 Comandi Utili

### Avviare MongoDB
```bash
mongod
```

### Connessione MongoDB
```bash
mongosh
```

### Visualizzare Database
```bash
mongosh
> show dbs
> use TMDB
> db.users.find()
> db.medias.find()
> db.lists.find()
```

### Pulire il Database
```bash
mongosh
> use TMDB
> db.dropDatabase()  # ⚠️ ATTENZIONE: Cancella tutto!
```

### Testare un Endpoint
```bash
# Registrazione
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Ricerca
curl "http://localhost:3000/api/tmdb/search?query=Interstellar"
```

### Visualizzare Log del Server
Il server stampa i log nella console. Cerca:
- ✅ Operazioni riuscite
- ❌ Errori
- 🔑 Chiavi di accesso

---

## 📊 Struttura Dati MongoDB

### Utenti
```json
{
  "_id": ObjectId,
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "favoriteMedia": [ObjectId, ObjectId],
  "lists": [ObjectId, ObjectId],
  "isActive": true,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Media
```json
{
  "_id": ObjectId,
  "tmdbId": 157336,
  "title": "Interstellar",
  "type": "movie",
  "rating": 8.7,
  "reviews": [
    {
      "userId": ObjectId,
      "rating": 9,
      "comment": "Bellissimo!",
      "createdAt": Date
    }
  ],
  "createdAt": Date
}
```

### Liste
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "name": "Da Vedere",
  "description": "Film che voglio guardare",
  "mediaItems": [ObjectId, ObjectId],
  "type": "custom",
  "isPrivate": false,
  "createdAt": Date
}
```

---

## 🆘 Supporto

Se hai problemi:

1. **Controlla i log**: Guarda la console dove gira il server
2. **Verifica prerequisiti**: Node.js, npm, MongoDB
3. **Pulisci cache**: Ctrl+Shift+Del nel browser
4. **Riavvia tutto**: Server + Browser + MongoDB
5. **Reset database**: Elimina database TMDB e riparti

---

## ✅ Checklist di Avvio

- [ ] Node.js installato (`node --version`)
- [ ] npm installato (`npm --version`)
- [ ] MongoDB in esecuzione (`mongosh`)
- [ ] File `.env` corretto
- [ ] Dipendenze installate (`npm install`)
- [ ] Server avviato (`npm start`)
- [ ] Browser aperto a `http://localhost:3000`
- [ ] Registrazione completata
- [ ] Ricerca film funzionante
- [ ] Preferiti salvabili
- [ ] Liste creabili
- [ ] Review aggiungibili

---

## 🎓 Prossimi Step

Dopo il setup iniziale:

1. **Esplora l'API**: Leggi `API_DOCUMENTATION.md`
2. **Test gli Endpoints**: Usa `test_api.sh`
3. **Personalizza l'App**: Modifica `app_tmdb.html`
4. **Aggiungi Funzioni**: Leggi il codice in `server.js`
5. **Deploy**: Quando sei pronto, valuta l'hosting

---

## 📞 Contatti e Risorse

- **Documentazione TMDb**: https://www.themoviedb.org/settings/api
- **Documentazione Express**: https://expressjs.com
- **Documentazione MongoDB**: https://docs.mongodb.com
- **JWT**: https://jwt.io

---

**Buono sviluppo! 🚀**
