const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware per verificare l'autenticazione JWT
const authenticateToken = async (req, res, next) => {
    try {
        // Controlla l'header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token di accesso mancante'
            });
        }

        // Verifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Cerca l'utente nel database
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utente non trovato'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account disattivato'
            });
        }

        // Aggiungi l'utente alla richiesta
        req.user = user;
        next();

    } catch (error) {
        console.error('Errore autenticazione:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token non valido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token scaduto'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Errore del server durante l\'autenticazione'
        });
    }
};

// Middleware opzionale per l'autenticazione (non blocca se non c'è token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user && user.isActive) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Ignora errori per l'auth opzionale
        next();
    }
};

// Middleware per verificare se l'utente è admin (per future funzionalità)
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Autenticazione richiesta'
        });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Privilegi amministratore richiesti'
        });
    }

    next();
};

// Utility per generare JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { 
            expiresIn: '7d', // Token valido per 7 giorni
            issuer: 'todo-app',
            audience: 'todo-users'
        }
    );
};

// Utility per generare refresh token (per future implementazioni)
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_SECRET,
        { 
            expiresIn: '30d',
            issuer: 'todo-app',
            audience: 'todo-users'
        }
    );
};

module.exports = {
    authenticateToken,
    optionalAuth,
    requireAdmin,
    generateToken,
    generateRefreshToken
};