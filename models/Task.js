const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Il titolo della task è obbligatorio'],
        trim: true,
        maxlength: [200, 'Il titolo non può superare i 200 caratteri']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'La descrizione non può superare i 1000 caratteri']
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date
    },
    category: {
        type: String,
        trim: true,
        maxlength: [50, 'La categoria non può superare i 50 caratteri']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserId è obbligatorio']
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true // Aggiunge automaticamente createdAt e updatedAt
});

// Middleware per aggiornare completedAt quando la task viene completata
taskSchema.pre('save', function(next) {
    if (this.isModified('completed')) {
        if (this.completed && !this.completedAt) {
            this.completedAt = new Date();
        } else if (!this.completed) {
            this.completedAt = undefined;
        }
    }
    next();
});

// Indici per performance
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

// Metodi statici
taskSchema.statics.getTasksByUser = function(userId, filter = {}) {
    return this.find({ userId, ...filter }).sort({ createdAt: -1 });
};

taskSchema.statics.getTaskStats = function(userId) {
    return this.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                completedTasks: {
                    $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
                },
                pendingTasks: {
                    $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
                },
                highPriorityTasks: {
                    $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
                }
            }
        }
    ]);
};

// Virtual per il nome completo del proprietario
taskSchema.virtual('owner', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Assicurati che i virtual siano inclusi quando converti in JSON
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);