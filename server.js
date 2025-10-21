require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const axios = require('axios');

// Import dei moduli personalizzati
const User = require('./models/User');
const Media = require('./models/Media');
const List = require('./models/List');
const { authenticateToken, generateToken } = require('./middleware/auth');
const { searchMedia, getMovieDetails, getTVDetails } = require('./config/tmdb');

const app = express();
const PORT = process.env.PORT || 3000;

// Connessione MongoDB
mongoose.connect('mongodb://localhost:27017/TMDB')
    .then(() => console.log(' MongoDB connesso'))
    .catch(err => {
        console.error(' Errore MongoDB:', err);
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
    res.sendFile(path.join(__dirname, 'public', 'app_tmdb.html'));
});

app.get('/app_tmdb', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app_tmdb.html'));
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
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('lists');
        
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    lists: user.lists,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero dei dati utente'
        });
    }
});

// ============================================
// TMDB SEARCH ROUTES
// ============================================

// GET /api/tmdb/search - Ricerca film e serie
app.get('/api/tmdb/search', async (req, res) => {
    try {
        const { query, type } = req.query;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'La query di ricerca è obbligatoria'
            });
        }

        const results = await searchMedia(query.trim(), type || 'all');

        res.json({
            success: true,
            data: results
        });

    } catch (error) {
        console.error('Errore ricerca TMDb:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nella ricerca del contenuto'
        });
    }
});

// GET /api/tmdb/movie/:id - Dettagli film
app.get('/api/tmdb/movie/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const details = await getMovieDetails(id);

        res.json({
            success: true,
            data: details
        });

    } catch (error) {
        console.error('Errore dettagli film:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero dei dettagli del film'
        });
    }
});

// GET /api/tmdb/tv/:id - Dettagli serie TV
app.get('/api/tmdb/tv/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const details = await getTVDetails(id);

        res.json({
            success: true,
            data: details
        });

    } catch (error) {
        console.error('Errore dettagli serie TV:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero dei dettagli della serie TV'
        });
    }
});

// ============================================
// MEDIA ROUTES (Salvataggio contenuti personali)
// ============================================

// POST /api/media - Salva un media nel database personale
app.post('/api/media', authenticateToken, async (req, res) => {
    try {
        const { tmdbId, title, type, description, posterPath, releaseDate, rating, genres, cast, director, trailerUrl, runtime, numberOfSeasons } = req.body;

        // Controlla se il media esiste già
        let media = await Media.findOne({ tmdbId });

        if (!media) {
            media = new Media({
                tmdbId,
                title,
                type,
                description,
                posterPath,
                releaseDate,
                rating,
                genres: genres || [],
                cast: cast || [],
                director: director || [],
                trailerUrl,
                runtime,
                numberOfSeasons
            });

            await media.save();
        }

        res.status(201).json({
            success: true,
            message: 'Contenuto salvato con successo',
            data: media
        });

    } catch (error) {
        console.error('Errore salvataggio media:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel salvataggio del contenuto'
        });
    }
});

// GET /api/media/:tmdbId - Ottieni dettagli media salvato
app.get('/api/media/:tmdbId', async (req, res) => {
    try {
        const { tmdbId } = req.params;

        const media = await Media.findOne({ tmdbId }).populate('reviews.userId', 'username');

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Contenuto non trovato'
            });
        }

        res.json({
            success: true,
            data: media
        });

    } catch (error) {
        console.error('Errore recupero media:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero del contenuto'
        });
    }
});

// ============================================
// REVIEWS/RATINGS ROUTES
// ============================================

// POST /api/media/:tmdbId/reviews - Aggiungi review a un media
app.post('/api/media/:tmdbId/reviews', authenticateToken, async (req, res) => {
    try {
        const { tmdbId } = req.params;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 10) {
            return res.status(400).json({
                success: false,
                message: 'La valutazione deve essere tra 1 e 10'
            });
        }

        const media = await Media.findOne({ tmdbId });

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Contenuto non trovato'
            });
        }

        // Controlla se l'utente ha già una review per questo media
        const existingReview = media.reviews.find(review => review.userId.toString() === req.user._id.toString());

        if (existingReview) {
            // Aggiorna la review esistente
            existingReview.rating = rating;
            existingReview.comment = comment || '';
        } else {
            // Aggiungi una nuova review
            media.reviews.push({
                userId: req.user._id,
                rating,
                comment: comment || ''
            });
        }

        await media.save();

        res.json({
            success: true,
            message: 'Review salvata con successo',
            data: media
        });

    } catch (error) {
        console.error('Errore salvataggio review:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel salvataggio della review'
        });
    }
});

// GET /api/media/:tmdbId/reviews - Ottieni tutte le review di un media
app.get('/api/media/:tmdbId/reviews', async (req, res) => {
    try {
        const { tmdbId } = req.params;

        const media = await Media.findOne({ tmdbId }).populate('reviews.userId', 'username');

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Contenuto non trovato'
            });
        }

        res.json({
            success: true,
            data: media.reviews
        });

    } catch (error) {
        console.error('Errore recupero reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero delle reviews'
        });
    }
});

// DELETE /api/media/:tmdbId/reviews/:reviewId - Elimina una review
app.delete('/api/media/:tmdbId/reviews/:reviewId', authenticateToken, async (req, res) => {
    try {
        const { tmdbId, reviewId } = req.params;

        const media = await Media.findOne({ tmdbId });

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Contenuto non trovato'
            });
        }

        const review = media.reviews.id(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review non trovata'
            });
        }

        if (review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Non hai il permesso di eliminare questa review'
            });
        }

        media.reviews.id(reviewId).remove();
        await media.save();

        res.json({
            success: true,
            message: 'Review eliminata con successo'
        });

    } catch (error) {
        console.error('Errore eliminazione review:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nell\'eliminazione della review'
        });
    }
});

// ============================================
// VIEW STATUS ROUTES (Marcatura visto/da vedere)
// ============================================

// PUT /api/media/:tmdbId/status - Aggiorna stato visualizzazione (watched/to-watch/none)
app.put('/api/media/:tmdbId/status', authenticateToken, async (req, res) => {
    try {
        const { tmdbId } = req.params;
        const { status } = req.body;

        if (!['watched', 'to-watch', 'none'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Stato non valido. Usa: watched, to-watch, none'
            });
        }

        let media = await Media.findOne({ tmdbId });

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Contenuto non trovato'
            });
        }

        // Cercare o creare entry per questo utente
        const userStatusIndex = media.userViewStatus.findIndex(
            u => u.userId.toString() === req.user._id.toString()
        );

        if (userStatusIndex > -1) {
            // Aggiorna stato esistente
            media.userViewStatus[userStatusIndex].status = status;
            if (status === 'watched') {
                media.userViewStatus[userStatusIndex].watchedDate = new Date();
            }
        } else {
            // Crea nuovo entry per questo utente
            media.userViewStatus.push({
                userId: req.user._id,
                status: status,
                watchedDate: status === 'watched' ? new Date() : null
            });
        }

        await media.save();

        res.json({
            success: true,
            message: `Stato aggiornato a: ${status}`,
            media: media
        });

    } catch (error) {
        console.error('Errore aggiornamento stato:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nell\'aggiornamento dello stato'
        });
    }
});

// GET /api/media/:tmdbId/status - Ottieni stato visualizzazione per utente corrente
app.get('/api/media/:tmdbId/status', authenticateToken, async (req, res) => {
    try {
        const { tmdbId } = req.params;

        const media = await Media.findOne({ tmdbId });

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Contenuto non trovato',
                status: 'none'
            });
        }

        const userStatus = media.userViewStatus.find(
            u => u.userId.toString() === req.user._id.toString()
        );

        res.json({
            success: true,
            status: userStatus ? userStatus.status : 'none',
            watchedDate: userStatus ? userStatus.watchedDate : null
        });

    } catch (error) {
        console.error('Errore recupero stato:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero dello stato'
        });
    }
});

// ============================================
// LISTS ROUTES (Gestione liste personali)
// ============================================

// POST /api/lists - Crea una nuova lista
app.post('/api/lists', authenticateToken, async (req, res) => {
    try {
        const { name, description, type, isPrivate } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Il nome della lista è obbligatorio'
            });
        }

        const list = new List({
            userId: req.user._id,
            name: name.trim(),
            description: description || '',
            type: type || 'custom',
            isPrivate: isPrivate || false
        });

        await list.save();

        // Aggiungi la lista all'utente
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { lists: list._id } }
        );

        res.status(201).json({
            success: true,
            message: 'Lista creata con successo',
            data: list
        });

    } catch (error) {
        console.error('Errore creazione lista:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nella creazione della lista'
        });
    }
});

// GET /api/lists - Ottieni tutte le liste dell'utente
app.get('/api/lists', authenticateToken, async (req, res) => {
    try {
        const lists = await List.find({ userId: req.user._id }).populate('mediaItems');

        res.json({
            success: true,
            data: lists
        });

    } catch (error) {
        console.error('Errore recupero liste:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero delle liste'
        });
    }
});

// GET /api/lists/:listId - Ottieni una lista specifica
app.get('/api/lists/:listId', authenticateToken, async (req, res) => {
    try {
        const { listId } = req.params;

        const list = await List.findOne({ _id: listId, userId: req.user._id }).populate('mediaItems');

        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'Lista non trovata'
            });
        }

        res.json({
            success: true,
            data: list
        });

    } catch (error) {
        console.error('Errore recupero lista:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero della lista'
        });
    }
});

// PUT /api/lists/:listId - Aggiorna una lista
app.put('/api/lists/:listId', authenticateToken, async (req, res) => {
    try {
        const { listId } = req.params;
        const { name, description, type, isPrivate } = req.body;

        const list = await List.findOne({ _id: listId, userId: req.user._id });

        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'Lista non trovata'
            });
        }

        if (name) list.name = name;
        if (description !== undefined) list.description = description;
        if (type) list.type = type;
        if (isPrivate !== undefined) list.isPrivate = isPrivate;

        await list.save();

        res.json({
            success: true,
            message: 'Lista aggiornata con successo',
            data: list
        });

    } catch (error) {
        console.error('Errore aggiornamento lista:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nell\'aggiornamento della lista'
        });
    }
});

// DELETE /api/lists/:listId - Elimina una lista
app.delete('/api/lists/:listId', authenticateToken, async (req, res) => {
    try {
        const { listId } = req.params;

        const list = await List.findOne({ _id: listId, userId: req.user._id });

        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'Lista non trovata'
            });
        }

        await List.findByIdAndDelete(listId);

        // Rimuovi la lista dall'utente
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { lists: listId } }
        );

        res.json({
            success: true,
            message: 'Lista eliminata con successo'
        });

    } catch (error) {
        console.error('Errore eliminazione lista:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nell\'eliminazione della lista'
        });
    }
});

// POST /api/lists/:listId/media/:tmdbId - Aggiungi media a una lista
app.post('/api/lists/:listId/media/:tmdbId', authenticateToken, async (req, res) => {
    try {
        const { listId, tmdbId } = req.params;

        const list = await List.findOne({ _id: listId, userId: req.user._id });

        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'Lista non trovata'
            });
        }

        const media = await Media.findOne({ tmdbId });

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Contenuto non trovato'
            });
        }

        // Controlla se il media è già nella lista
        if (list.mediaItems.includes(media._id)) {
            return res.status(409).json({
                success: false,
                message: 'Questo contenuto è già nella lista'
            });
        }

        list.mediaItems.push(media._id);
        await list.save();

        res.json({
            success: true,
            message: 'Contenuto aggiunto alla lista',
            data: list
        });

    } catch (error) {
        console.error('Errore aggiunta media a lista:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nell\'aggiunta del contenuto alla lista'
        });
    }
});

// DELETE /api/lists/:listId/media/:mediaId - Rimuovi media da una lista
app.delete('/api/lists/:listId/media/:mediaId', authenticateToken, async (req, res) => {
    try {
        const { listId, mediaId } = req.params;

        const list = await List.findOne({ _id: listId, userId: req.user._id });

        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'Lista non trovata'
            });
        }

        list.mediaItems = list.mediaItems.filter(item => item.toString() !== mediaId);
        await list.save();

        res.json({
            success: true,
            message: 'Contenuto rimosso dalla lista',
            data: list
        });

    } catch (error) {
        console.error('Errore rimozione media da lista:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nella rimozione del contenuto dalla lista'
        });
    }
});

// ============================================
// FAVORITES ROUTES
// ============================================

// POST /api/favorites/:tmdbId - Aggiungi ai preferiti
app.post('/api/favorites/:tmdbId', authenticateToken, async (req, res) => {
    try {
        const { tmdbId } = req.params;

        const media = await Media.findOne({ tmdbId });

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Contenuto non trovato'
            });
        }

        const user = await User.findById(req.user._id);

        if (user.favoriteMedia.includes(media._id)) {
            return res.status(409).json({
                success: false,
                message: 'Questo contenuto è già nei preferiti'
            });
        }

        user.favoriteMedia.push(media._id);
        await user.save();

        res.json({
            success: true,
            message: 'Contenuto aggiunto ai preferiti'
        });

    } catch (error) {
        console.error('Errore aggiunta preferiti:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nell\'aggiunta ai preferiti'
        });
    }
});

// DELETE /api/favorites/:mediaId - Rimuovi dai preferiti
app.delete('/api/favorites/:mediaId', authenticateToken, async (req, res) => {
    try {
        const { mediaId } = req.params;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { favoriteMedia: mediaId } },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Contenuto rimosso dai preferiti'
        });

    } catch (error) {
        console.error('Errore rimozione preferiti:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nella rimozione dai preferiti'
        });
    }
});

// GET /api/favorites - Ottieni preferiti dell'utente
app.get('/api/favorites', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favoriteMedia');

        res.json({
            success: true,
            data: user.favoriteMedia
        });

    } catch (error) {
        console.error('Errore recupero preferiti:', error);
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero dei preferiti'
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
    console.log(`🚀 Server TMDb avviato su http://localhost:${PORT}`);
    console.log(`🎬 API TMDb integrata`);
    console.log(`🔑 API Key: ${process.env.API_KEY ? 'Configurata' : 'Non configurata'}`);
    console.log(`🗄️  Database: mongodb://localhost:27017/TMDB`);
    console.log(`🔐 JWT Secret configurato: ${process.env.JWT_SECRET ? 'Sì' : 'No'}`);
});

module.exports = app;