# 🎬 View Status Endpoints Reference

## Overview
Questi endpoints permettono di marcare film e serie TV come "visti" (watched) o "da vedere" (to-watch).

---

## Endpoints

### 1. PUT /api/media/:tmdbId/status
**Aggiorna lo stato di visualizzazione per il contenuto corrente**

#### Request
```
Method: PUT
URL: /api/media/:tmdbId/status
Auth: Required (Bearer Token)

Headers:
{
    "Authorization": "Bearer <JWT_TOKEN>",
    "Content-Type": "application/json"
}

Body:
{
    "status": "watched" | "to-watch" | "none"
}
```

#### Response (Success - 200)
```json
{
    "success": true,
    "message": "Stato aggiornato a: watched",
    "media": {
        "_id": "...",
        "tmdbId": 550,
        "title": "Fight Club",
        "userViewStatus": [
            {
                "userId": "...",
                "status": "watched",
                "watchedDate": "2024-01-15T10:30:00.000Z"
            }
        ]
    }
}
```

#### Errors
- `400` - Stato non valido
- `404` - Contenuto non trovato
- `401` - Non autenticato
- `500` - Errore server

---

### 2. GET /api/media/:tmdbId/status
**Recupera lo stato di visualizzazione per il contenuto corrente**

#### Request
```
Method: GET
URL: /api/media/:tmdbId/status
Auth: Required (Bearer Token)

Headers:
{
    "Authorization": "Bearer <JWT_TOKEN>"
}
```

#### Response (Success - 200)
```json
{
    "success": true,
    "status": "watched" | "to-watch" | "none",
    "watchedDate": "2024-01-15T10:30:00.000Z" | null
}
```

#### Errors
- `404` - Contenuto non trovato
- `401` - Non autenticato
- `500` - Errore server

---

## Status Values

| Valore | Significato | Uso |
|--------|-------------|-----|
| `watched` | Contenuto già visto | Marcato come visto dall'utente |
| `to-watch` | Da guardare | Aggiunto a lista da guardare |
| `none` | Nessuno stato | Rimosso da lista, non marcato come visto |

---

## Frontend Implementation Example

```javascript
// Marcaggio come visto
async function markAsWatched(tmdbId) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`/api/media/${tmdbId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'watched' })
    });
    
    const data = await response.json();
    if (data.success) {
        console.log('Marcato come visto!', data.media);
    }
}

// Recupero stato attuale
async function getViewStatus(tmdbId) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`/api/media/${tmdbId}/status`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    if (data.success) {
        console.log('Stato attuale:', data.status);
        console.log('Data visione:', data.watchedDate);
    }
}
```

---

## Database Impact

### Media Model
```javascript
userViewStatus: [{
    userId: ObjectId,                    // Riferimento utente
    status: 'watched'|'to-watch'|'none', // Stato
    watchedDate: Date,                   // Data marcatura come visto
    addedToWatchlistDate: Date           // Data aggiunta a watchlist
}]
```

Ogni utente può avere uno stato diverso per lo stesso contenuto. Lo status è **per-user**, non globale.

---

## Workflow di Utilizzo

### Scenario 1: Aggiungere a "Da Vedere"
```javascript
// Utente clicca "Aggiungi a da vedere"
await updateStatus(tmdbId, 'to-watch');
```

### Scenario 2: Marcaggio come Visto
```javascript
// Utente finisce di guardare il film e clicca "Segna come visto"
await updateStatus(tmdbId, 'watched');
```

### Scenario 3: Controllo Stato Attuale
```javascript
// Prima di mostrare UI, recupera stato
const status = await getViewStatus(tmdbId);
if (status === 'watched') {
    // Mostra badge "Visto"
}
```

---

## Note Importanti

⚠️ **Per-User Tracking**
- Ogni utente ha il proprio status per ogni media
- User A può aver visto un film, User B no - dati separati

⚠️ **Date Tracking**
- `watchedDate` si popola solo quando status = 'watched'
- Permette di tracciare quando l'utente ha marcato come visto

⚠️ **Integrazione con Liste**
- Questo sistema è complementare alla gestione liste
- Una lista "watched" può contenere gli stessi media di userViewStatus con status='watched'
- Offre flessibilità: tracking automatico + organizzazione manuale

---

## Integration with Lists Feature

I due sistemi (userViewStatus e Lists) sono complementari:

```
userViewStatus: Tracking asincrono dello stato per media
├── watched: Visto
├── to-watch: Da guardare
└── none: Nessuno stato

Lists: Organizzazione manuale
├── watchlist: Lista "Da Guardare"
├── watched: Lista "Visti"
├── favorites: Lista "Preferiti"
└── custom: Liste personalizz
