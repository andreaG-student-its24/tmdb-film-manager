const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserId è obbligatorio']
    },
    name: {
        type: String,
        required: [true, 'Il nome della lista è obbligatorio'],
        trim: true,
        maxlength: [100, 'Il nome non può superare i 100 caratteri']
    },
    description: {
        type: String,
        maxlength: [500, 'La descrizione non può superare i 500 caratteri']
    },
    type: {
        type: String,
        enum: ['custom', 'watchlist', 'watched', 'favorites'],
        default: 'custom'
    },
    mediaItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    }],
    isPrivate: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('List', listSchema);
