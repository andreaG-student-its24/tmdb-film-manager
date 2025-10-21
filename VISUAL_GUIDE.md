# 🎬 Guida Visuale Passo-Passo

Guida pratica con screenshot e passaggi chiari per usare l'app.

---

## 🚀 FASE 1: SETUP INIZIALE

### Passo 1: Avviare MongoDB
```
1. Apri PowerShell
2. Digita: mongod
3. Vedi: {"msg":"listening on port 27017"}
4. Tieni aperto
```

### Passo 2: Avviare il Server
```
1. Apri un NUOVO PowerShell
2. Vai in cartella: cd "c:\Users\Andrea.Giovene\Node.js - Verifica infermedia\VerificaNodeJs"
3. Digita: npm start
4. Vedi: "🚀 Server TMDb avviato su http://localhost:3000"
5. Vedi: "✅ MongoDB connesso"
```

### Passo 3: Aprire l'App
```
1. Apri il browser
2. Vai su: http://localhost:3000
3. Vedi: Pagina di Login
```

---

## 🔐 FASE 2: REGISTRAZIONE

### Passo 1: Clicca su Registrati
```
┌─────────────────────────┐
│  TMDB - Film e Serie TV │
├─────────────────────────┤
│  Username: ___________  │
│  Email:    ___________  │
│  Password: ___________  │
│  [Registrati]           │
│  Hai già un account? ->  │
└─────────────────────────┘
```

### Passo 2: Inserisci Dati
```
Username: testuser
Email: test@example.com
Password: password123
```

### Passo 3: Clicca Registrati
```
Attendi... Registrazione completata!
Reindirizzamento automatico al login
```

---

## 📝 FASE 3: LOGIN

### Passo 1: Inserisci Credenziali
```
┌─────────────────────────┐
│  TMDB - Film e Serie TV │
├─────────────────────────┤
│  Username: testuser     │
│  Password: password123  │
│  [Login]                │
│  Non hai un account? -> │
└─────────────────────────┘
```

### Passo 2: Clicca Login
```
Attendi... Accesso completato!
```

### Passo 3: Sei nell'App!
```
Vedi la dashboard con barra di ricerca
```

---

## 🎬 FASE 4: RICERCA FILM

### Layout App
```
┌─────────────────────────────────────────┬──────────────────┐
│ 🎬 TMDb - Film e Serie TV               │  Benvenuto, user │
├─────────────────────────────────────────┼──────────────────┤
│ RICERCA                                 │ SIDEBAR          │
├─────────────────────────────────────────┤ ┌──────────────┐ │
│ [Inserisci titolo] [Film/TV] [Cerca]    │ │ 📚 Le Mie... │ │
│ [Ricerca] [Preferiti] [Liste]           │ │              │ │
│                                         │ │ • Da Vedere  │ │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │ └──────────────┘ │
│ │Img  │ │Img  │ │Img  │ │Img  │      │                  │
│ │Film1│ │Film2│ │Film3│ │Film4│      │ [Nuova Lista]    │
│ │⭐8.7│ │⭐8.5│ │⭐8.2│ │⭐7.9│      │                  │
│ └─────┘ └─────┘ └─────┘ └─────┘      └──────────────────┘
└─────────────────────────────────────────┘
```

### Passo 1: Cercare un Film
```
1. Clicca su "Inserisci titolo"
2. Digita: Interstellar
3. Scegli: Film (dropdown)
4. Clicca: Cerca 🔍
```

### Risultati
```
Vedi una griglia di film con:
- Poster (immagine)
- Titolo
- Rating (es: ⭐ 8.7/10)
- 2 bottoni: [📋 Lista] [❤️ Favorito]
```

---

## 💚 FASE 5: AGGIUNGERE AI PREFERITI

### Passo 1: Trova un Film
```
Dalla ricerca, vedi film disponibili
```

### Passo 2: Clicca il Cuore
```
┌────────────────┐
│     POSTER     │
│                │
├────────────────┤
│ Titolo Film    │
│ ⭐ 8.7/10      │
│[📋 Lista][❤️]  │
└────────────────┘
     Clicca ❤️
```

### Risultato
```
✓ Film aggiunto ai preferiti!
Film visibile in tab "Preferiti"
```

---

## 📋 FASE 6: GESTIONE LISTE

### Passo 1: Crea una Lista
```
Sidebar destra:
┌──────────────┐
│ Nuova Lista  │
├──────────────┤
│[Inserisci]   │
│[Crea Lista]  │
└──────────────┘

Digita: "Da Vedere"
Clicca: "Crea Lista"
```

### Risultato
```
Nuova lista creata:
┌──────────────┐
│ 📚 Le Mie    │
│ 📋 Da Vedere │
│     (0)      │
└──────────────┘
```

### Passo 2: Aggiungi Film a Lista
```
1. Dalla ricerca, trova un film
2. Clicca: [📋 Lista]
3. Seleziona: "Da Vedere"
4. Film aggiunto!

Vedi il counter aumentare:
📋 Da Vedere (1)
```

---

## ⭐ FASE 7: LASCIARE REVIEW

### Passo 1: Clicca su un Film
```
Dalla griglia, clicca su un film
```

### Passo 2: Si Apre un Modale
```
┌────────────────────────────────┐
│ Interstellar                   │
│ ────────────────────────────   │
│ Trama: "Un team di astronauti" │
│                                │
│ Cast: Matthew McConaughey,...  │
│ Generi: Sci-Fi, Drama          │
│ ⭐ Rating: 8.7/10              │
│ 📹 Trailer: [Link YouTube]     │
│                                │
│ ───────────────────────────    │
│ COMMENTI E VALUTAZIONI         │
│ La tua valutazione (1-10): [9] │
│ Commento: [Meraviglioso!]      │
│ [Invia Valutazione]            │
│                                │
│ Valutazioni Community:         │
│ • user1: ⭐9 "Perfetto!"       │
│ • user2: ⭐8 "Molto bello"     │
└────────────────────────────────┘
```

### Passo 2: Inserisci Valutazione
```
1. Inserisci numero: 9
2. Inserisci commento (opzionale)
3. Clicca: "Invia Valutazione"
```

### Risultato
```
✓ Valutazione salvata!
Vedi il tuo commento nella lista
```

---

## 🔍 FASE 8: TAB PREFERITI

### Accedi ai Preferiti
```
1. In alto, clicca: [❤️ Preferiti]
2. Vedi griglia con soli film preferiti
3. Stesso layout di ricerca
```

### Rimuovi dai Preferiti
```
1. Dalla tab Preferiti
2. Clicca ❤️ di un film
3. Film rimosso dalla lista
```

---

## 📋 FASE 9: TAB LE MIE LISTE

### Accedi alle Liste
```
1. In alto, clicca: [📋 Le Mie Liste]
2. Vedi tutte le tue liste create
```

### Visualizza una Lista
```
1. Clicca su una lista
2. Vedi i film aggiunti
3. Stessi film della ricerca
```

### Rimuovi Film da Lista
```
1. Apri una lista
2. Clicca X su un film
3. Film rimosso (ma non dai preferiti)
```

---

## 🚪 FASE 10: LOGOUT

### Passo 1: Clicca Logout
```
In alto a destra:
[testuser] [Logout]
     Clicca: Logout
```

### Risultato
```
✓ Logout effettuato
Reindirizzamento a pagina login
```

---

## 🎯 FUNZIONALITÀ PRINCIPALI - RIEPILOGO

```
┌──────────────────────────────────────┐
│ RICERCA                              │
│ ├─ Digita titolo                    │
│ ├─ Scegli Film/TV/Tutti             │
│ └─ Clicca Cerca                     │
├──────────────────────────────────────┤
│ PREFERITI                            │
│ ├─ Clicca ❤️ su film               │
│ ├─ Tab "Preferiti" per vederli      │
│ └─ Clicca ❤️ per rimuovere        │
├──────────────────────────────────────┤
│ LISTE PERSONALI                      │
│ ├─ Crea lista nella sidebar         │
│ ├─ Aggiungi film con [📋 Lista]    │
│ ├─ Modifica/Elimina liste           │
│ └─ Tab "Liste" per gestire         │
├──────────────────────────────────────┤
│ VALUTAZIONI & COMMENTI               │
│ ├─ Clicca su film per aprire       │
│ ├─ Inserisci rating (1-10)         │
│ ├─ Aggiungi commento                │
│ └─ Vedi community reviews           │
└──────────────────────────────────────┘
```

---

## 🎨 COLORI E ICONE

```
🎬 = App/Film
❤️  = Preferiti
⭐  = Rating
📋  = Liste
🔍  = Ricerca
👤  = Utente
🚪  = Logout
📱  = Mobile
🖥️  = Desktop
✓   = Successo
✗   = Errore
```

---

## 📱 SU MOBILE (Responsive)

```
La app funziona anche su smartphone!

Layout mobile:
┌─────────────┐
│ 🎬 TMDb     │
│ [👤] [🚪]   │
├─────────────┤
│[Ricerca ]   │
│[Film/TV]    │
│[🔍]         │
├─────────────┤
│ ┌────────┐  │
│ │ Film 1 │  │
│ ├────────┤  │
│ │ Film 2 │  │
│ ├────────┤  │
│ │ Film 3 │  │
│ └────────┘  │
├─────────────┤
│ [Tab basso] │
│ [Ricerca]   │
│ [Preferiti] │
│ [Liste]     │
└─────────────┘
```

---

## ⌨️ SCORCIATOIE CONSIGLIATE

```
DESKTOP:
F12         = Apri console sviluppatore
Ctrl+Shift+R = Ricarica pagina (svuota cache)
Ctrl+Shift+Del = Cancella dati browser

BROWSER:
Ctrl+F      = Cerca nella pagina
Ctrl+Scroll = Zoom in/out
```

---

## 🆘 SE QUALCOSA NON FUNZIONA

```
1. Aggiorna la pagina (Ctrl+F5)
2. Cancella cache browser
3. Verifica console (F12)
4. Controlla server stia girando
5. Verifica MongoDB sia acceso
6. Leggi QUICK_START.md sezione Troubleshooting
```

---

## 🎓 PROSSIME COSE DA PROVARE

```
✓ Cercare film diversi
✓ Creare più liste
✓ Seguire altri utenti (futura feature)
✓ Esportare liste (futura feature)
✓ Condividere review (futura feature)
✓ Ottenere raccomandazioni (futura feature)
```

---

**Divertiti a scoprire nuovi film! 🎬🍿**
