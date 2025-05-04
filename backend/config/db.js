const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
