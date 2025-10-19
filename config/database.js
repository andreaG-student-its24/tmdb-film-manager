const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Opzioni di connessione per performance e stabilità
            maxPoolSize: 10, // Mantieni fino a 10 connessioni socket
            serverSelectionTimeoutMS: 5000, // Timeout dopo 5s invece di 30s
            socketTimeoutMS: 45000, // Chiudi socket dopo 45s di inattività
        });

        console.log(`✅ MongoDB connesso: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
        
        // Event listeners per monitorare la connessione
        mongoose.connection.on('connected', () => {
            console.log('🔗 Mongoose connesso a MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Errore connessione MongoDB:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 Mongoose disconnesso da MongoDB');
        });

        // Gestione chiusura applicazione (rimossa per evitare chiusure inaspettate)

    } catch (error) {
        console.error('❌ Errore connessione database:', error.message);
        console.error('💡 Assicurati che MongoDB sia in esecuzione su localhost:27017');
        console.error('💡 E che il database "Verifica" sia accessibile');
        process.exit(1);
    }
};

module.exports = connectDB;