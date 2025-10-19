# Todo App - Node.js

Un'applicazione web completa per la gestione delle attività (Todo) costruita con Node.js, Express e vanilla JavaScript.

## 🚀 Caratteristiche

- ✅ **Crea task** - Aggiungi nuove attività con titolo e descrizione
- ✏️ **Modifica task** - Modifica titolo e descrizione delle task esistenti
- ✔️ **Completa task** - Segna le task come completate o ripristinale
- 🗑️ **Elimina task** - Rimuovi definitivamente le task
- 🎯 **Filtra task** - Visualizza tutte, solo completate o solo in sospeso
- 📊 **Statistiche** - Vedi il conteggio totale, completate e in sospeso
- 📱 **Responsive** - Interfaccia ottimizzata per desktop e mobile
- 🎨 **Design moderno** - UI accattivante con animazioni e gradienti

## 🛠️ Tecnologie Utilizzate

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **CORS** - Cross-Origin Resource Sharing
- **UUID** - Generazione ID univoci

### Frontend
- **HTML5** - Struttura semantica
- **CSS3** - Styling moderno con Flexbox/Grid, animazioni
- **Vanilla JavaScript** - Logica client-side
- **Font Awesome** - Icone

## 📁 Struttura del Progetto

```
todo-app-nodejs/
├── server.js          # Server Express principale
├── package.json       # Dipendenze e configurazione npm
├── README.md          # Documentazione
└── public/            # File statici
    ├── index.html     # Interfaccia principale
    ├── styles.css     # Stili CSS
    └── script.js      # Logica JavaScript
```

## 🚀 Installazione e Avvio

### Prerequisiti
- Node.js (versione 14 o superiore)
- npm (incluso con Node.js)

### Passaggi

1. **Clona la repository**
   ```bash
   git clone https://github.com/Walterprop/VerificaNodeJs.git
   cd VerificaNodeJs
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Avvia l'applicazione**
   ```bash
   npm start
   ```

4. **Apri nel browser**
   Vai su `http://localhost:3000`

## 📡 API Endpoints

L'applicazione espone le seguenti API REST:

### GET /api/tasks
Recupera tutte le task
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Titolo task",
      "description": "Descrizione task",
      "completed": false,
      "createdAt": "2025-10-19T...",
      "updatedAt": "2025-10-19T..."
    }
  ]
}
```

### POST /api/tasks
Crea una nuova task
```json
// Request body
{
  "title": "Nuova task",
  "description": "Descrizione opzionale"
}

// Response
{
  "success": true,
  "data": { /* task creata */ },
  "message": "Task creata con successo"
}
```

### PUT /api/tasks/:id
Aggiorna una task esistente
```json
// Request body
{
  "title": "Titolo aggiornato",
  "description": "Nuova descrizione",
  "completed": true
}
```

### DELETE /api/tasks/:id
Elimina una task
```json
{
  "success": true,
  "data": { /* task eliminata */ },
  "message": "Task eliminata con successo"
}
```

## 💡 Funzionalità Avanzate

### Interfaccia Utente
- **Filtri dinamici**: Visualizza task per stato (tutte/completate/in sospeso)
- **Statistiche in tempo reale**: Contatori aggiornati automaticamente
- **Modal per editing**: Finestra popup per modificare le task
- **Toast notifications**: Messaggi di feedback per le azioni
- **Loading indicators**: Feedback visivo durante le operazioni
- **Responsive design**: Adattabile a tutti i dispositivi

### Scorciatoie da Tastiera
- `Ctrl + Enter`: Aggiunge rapidamente una task quando il focus è sul campo titolo
- `Esc`: Chiude il modal di modifica

### Persistenza Locale
- Auto-salvataggio del contenuto del form nel localStorage
- Ripristino automatico al ricaricamento della pagina

## 🎨 Personalizzazione

### Colori
I colori principali possono essere modificati nel file `public/styles.css`:
- Gradiente principale: `#667eea` → `#764ba2`
- Colori di stato: successo, errore, info

### Stili
L'interfaccia utilizza:
- Font: Segoe UI (system font)
- Border radius: 8-15px per elementi arrotondati
- Box shadows: Per effetti di profondità
- Transitions: Animazioni fluide di 0.3s

## 🔧 Configurazione

### Porta del Server
La porta predefinita è 3000, ma può essere modificata tramite variabile d'ambiente:
```bash
PORT=8080 npm start
```

### CORS
Il server è configurato per accettare richieste da qualsiasi origine. Per produzione, configura CORS in modo più restrittivo in `server.js`.

## 📝 Note di Sviluppo

### Archiviazione Dati
Attualmente le task sono memorizzate in memoria (array). Per un ambiente di produzione, considera l'integrazione con:
- Database (MongoDB, PostgreSQL, SQLite)
- File system (JSON files)
- Redis per caching

### Sicurezza
Per un deployment in produzione, aggiungi:
- Validazione input più robusta
- Rate limiting
- Helmet.js per sicurezza HTTP
- HTTPS/SSL

### Performance
- Implementa paginazione per molte task
- Considera il caching per API frequenti
- Ottimizza le immagini e assets statici

## 🐛 Troubleshooting

### Errore porta già in uso
```bash
Error: listen EADDRINUSE: address already in use :::3000
```
**Soluzione**: Cambia porta o termina il processo:
```bash
PORT=3001 npm start
# oppure
pkill -f node
```

### Errori CORS
Se accedi da un dominio diverso, configura CORS in `server.js`:
```javascript
app.use(cors({
  origin: 'http://your-domain.com'
}));
```

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 🤝 Contributi

I contributi sono benvenuti! Per contribuire:

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/amazing-feature`)
3. Commit delle modifiche (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## 📞 Supporto

Per domande o supporto, apri un issue su GitHub o contatta il maintainer.

---

Sviluppato con ❤️ per la verifica Node.js