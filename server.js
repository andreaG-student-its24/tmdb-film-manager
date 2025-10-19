require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');

// Import dei moduli personalizzati
const User = require('./models/User');
const Task = require('./models/Task');
const { authenticateToken, generateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Connessione MongoDB semplificata
mongoose.connect('mongodb://localhost:27017/Verifica')
    .then(() => console.log('✅ MongoDB connesso'))
    .catch(err => {
        console.error('❌ Errore MongoDB:', err);
        process.exit(1);
    });

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configurazione sessioni
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(express.static('public'));

// Route per servire le pagine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});



// POST /api/auth/register - Registrazione utente
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validazione dati
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Tutti i campi sono obbligatori'
            });
        }

        // Controllo se l'utente esiste già
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (existingUser) {
            const field = existingUser.username === username ? 'Username' : 'Email';
            return res.status(409).json({
                success: false,
                message: `${field} già in uso`
            });
        }

        // Crea nuovo utente
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Genera token JWT
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registrazione completata con successo',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Errore registrazione:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Errore interno del server'
        });
    }
});

// POST /api/auth/login - Login utente
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username e password sono richiesti'
            });
        }

        // Trova l'utente per username o email
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenziali non valide'
            });
        }

        // Verifica password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenziali non valide'
            });
        }

        // Genera token JWT
        const token = generateToken(user._id);

        // Aggiorna ultimo accesso
        user.lastLogin = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'Login effettuato con successo',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    lastLogin: user.lastLogin
                }
            }
        });

    } catch (error) {
        console.error('Errore login:', error);
        res.status(500).json({
            success: false,
            message: 'Errore interno del server'
        });
    }
});

// POST /api/auth/logout - Logout utente
app.post('/api/auth/logout', (req, res) => {
    try {
        // In un'implementazione reale con Redis o database session store,
        // qui cancelleresti il token dalla blacklist
        
        res.json({
            success: true,
            message: 'Logout effettuato con successo'
        });

    } catch (error) {
        console.error('Errore logout:', error);
        res.status(500).json({
            success: false,
            message: 'Errore interno del server'
        });
    }
});

// GET /api/auth/me - Informazioni utente corrente
app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: {
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                createdAt: req.user.createdAt,
                lastLogin: req.user.lastLogin
            }
        }
    });
});

// GET /api/tasks - Recupera le task dell'utente
app.get('/api/tasks', authenticateToken, async (req, res) => {
    try {
        const { status, priority, sort } = req.query;
        
        // Costruisci il filtro
        const filter = { userId: req.user._id };
        
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        if (priority && priority !== 'all') {
            filter.priority = priority;
        }

        // Costruisci l'ordinamento
        let sortOptions = {};
        switch (sort) {
            case 'date-asc':
                sortOptions.createdAt = 1;
                break;
            case 'date-desc':
                sortOptions.createdAt = -1;
                break;
            case 'priority':
                sortOptions.priority = -1;
                break;
            case 'title':
                sortOptions.title = 1;
                break;
            default:
                sortOptions.createdAt = -1;
        }

        const tasks = await Task.find(filter).sort(sortOptions);

        res.json({
            success: true,
            data: tasks
        });

    } catch (error) {
        console.error('Errore recupero task:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero delle task'
        });
    }
});

// POST /api/tasks - Crea una nuova task
app.post('/api/tasks', authenticateToken, async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Il titolo è obbligatorio'
            });
        }

        const task = new Task({
            title: title.trim(),
            description: description ? description.trim() : '',
            priority: priority || 'medium',
            dueDate: dueDate ? new Date(dueDate) : undefined,
            userId: req.user._id
        });

        await task.save();

        res.status(201).json({
            success: true,
            message: 'Task creata con successo',
            data: task
        });

    } catch (error) {
        console.error('Errore creazione task:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Errore nella creazione della task'
        });
    }
});

// PUT /api/tasks/:id - Aggiorna una task
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Verifica che la task appartenga all'utente
        const task = await Task.findOne({ _id: id, userId: req.user._id });
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task non trovata'
            });
        }

        // Aggiorna solo i campi forniti
        const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
        const updateObj = {};
        
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                updateObj[field] = updates[field];
            }
        });

        // Se la task viene completata, aggiungi la data di completamento
        if (updates.status === 'completed' && task.status !== 'completed') {
            updateObj.completedAt = new Date();
        } else if (updates.status !== 'completed') {
            updateObj.completedAt = null;
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            updateObj,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Task aggiornata con successo',
            data: updatedTask
        });

    } catch (error) {
        console.error('Errore aggiornamento task:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nell\'aggiornamento della task'
        });
    }
});

// DELETE /api/tasks/:id - Elimina una task
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica che la task appartenga all'utente
        const task = await Task.findOne({ _id: id, userId: req.user._id });
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task non trovata'
            });
        }

        await Task.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Task eliminata con successo'
        });

    } catch (error) {
        console.error('Errore eliminazione task:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nell\'eliminazione della task'
        });
    }
});

// GET /api/tasks/stats - Statistiche delle task
app.get('/api/tasks/stats', authenticateToken, async (req, res) => {
    try {
        const stats = await Task.getTaskStats(req.user._id);
        
        const result = stats[0] || {
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            highPriorityTasks: 0
        };

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Errore statistiche task:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero delle statistiche'
        });
    }
});

// Route per gestire errori 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint non trovato'
    });
});

// Gestione errori globale
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Errore interno del server'
    });
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`🚀 Server Todo avviato su http://localhost:${PORT}`);
    console.log(`📝 Apri il browser e vai su http://localhost:${PORT} per il login`);
    console.log(`🗄️  Database: mongodb://localhost:27017/Verifica`);
    console.log(`🔐 JWT Secret configurato: ${process.env.JWT_SECRET ? 'Sì' : 'No'}`);
    console.log('📝 Credenziali test: admin / admin123');
});

module.exports = app;