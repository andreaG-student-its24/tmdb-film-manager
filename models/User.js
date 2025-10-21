const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username è obbligatorio'],
        unique: true,
        trim: true,
        minlength: [3, 'Username deve essere di almeno 3 caratteri'],
        maxlength: [50, 'Username non può superare i 50 caratteri']
    },
    email: {
        type: String,
        required: [true, 'Email è obbligatoria'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Formato email non valido']
    },
    password: {
        type: String,
        required: [true, 'Password è obbligatoria'],
        minlength: [6, 'Password deve essere di almeno 6 caratteri']
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'Nome non può superare i 50 caratteri']
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Cognome non può superare i 50 caratteri']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    favoriteMedia: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    }],
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }]
}, {
    timestamps: true // Aggiunge automaticamente createdAt e updatedAt
});

// Middleware per l'hashing della password prima del salvataggio
userSchema.pre('save', async function(next) {
    // Solo se la password è stata modificata o è nuova
    if (!this.isModified('password')) return next();
    
    try {
        // Hash della password con salt rounds = 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Metodo per confrontare le password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Errore nella verifica della password');
    }
};

// Metodo per ottenere i dati pubblici dell'utente (senza password)
userSchema.methods.toPublicJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Indici per performance (gli indici unique sono già definiti sopra)
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);