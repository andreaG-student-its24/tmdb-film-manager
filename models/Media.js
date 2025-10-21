const mongoose = require('mongoose');

// Schema per i commenti/valutazioni sui media
const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    comment: {
        type: String,
        maxlength: [500, 'Il commento non può superare i 500 caratteri']
    }
}, {
    timestamps: true
});

const mediaSchema = new mongoose.Schema({
    // Dati da TMDb
    tmdbId: {
        type: Number,
        required: [true, 'ID TMDb è obbligatorio'],
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Il titolo è obbligatorio']
    },
    type: {
        type: String,
        enum: ['movie', 'tv'],
        required: true
    },
    description: {
        type: String
    },
    posterPath: {
        type: String
    },
    backdropPath: {
        type: String
    },
    releaseDate: {
        type: Date
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    genres: [{
        type: String
    }],
    cast: [{
        name: String,
        character: String,
        profilePath: String
    }],
    director: [{
        name: String
    }],
    trailerUrl: {
        type: String
    },
    runtime: {
        type: Number // in minuti
    },
    numberOfSeasons: {
        type: Number
    },
    
    // Dati personali dell'utente - Tracciamento stato visualizzazione
    userViewStatus: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['watched', 'to-watch', 'none'],
            default: 'none'
        },
        watchedDate: {
            type: Date
        },
        addedToWatchlistDate: {
            type: Date,
            default: Date.now
        }
    }],
    
    userLists: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        listId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List',
            required: true
        }
    }],
    
    reviews: [reviewSchema],
    
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Media', mediaSchema);
