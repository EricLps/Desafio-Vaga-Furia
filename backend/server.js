const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

dotenv.config();

const app = express();

// Conectar ao banco de dados
connectDB();

// Configuração do CORS
app.use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configuração de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: false, // Alterado para false para evitar sessões desnecessárias
    cookie: {
        secure: false, // Deve ser true em produção com HTTPS
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // Sessão válida por 1 dia
    },
}));

// Configuração do Passport
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});