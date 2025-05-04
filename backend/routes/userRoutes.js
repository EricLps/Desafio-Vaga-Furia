const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // Importação do modelo Post
const User = require('../models/User');
const mongoose = require('mongoose');
const upload = require('../config/upload'); // Middleware para upload de arquivos

// Endpoint para registrar um usuário
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuário já registrado.' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });
    } catch (err) {
        console.error('Erro ao registrar o usuário:', err);
        res.status(500).json({ error: 'Erro ao registrar o usuário.' });
    }
});

// Endpoint para login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        res.status(200).json({ message: 'Login bem-sucedido!', user });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

// Endpoint para atualizar o perfil do usuário
router.put('/profile', upload.single('avatar'), async (req, res) => {
    const { userId, name } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'ID do usuário inválido.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Atualiza o nome, se fornecido
        if (name) {
            user.name = name;
        }

        // Atualiza a imagem de perfil, se fornecida
        if (req.file) {
            const avatarUrl = `http://localhost:3000/uploads/${req.file.filename}`;
            user.avatarUrl = avatarUrl;
        }

        await user.save();

        res.status(200).json({ message: 'Perfil atualizado com sucesso!', user });
    } catch (err) {
        console.error('Erro ao atualizar o perfil:', err);
        res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
    }
});

// Endpoint para obter os dados do perfil do usuário
router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'ID do usuário inválido.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const posts = await Post.find({ user_id: userId });

        // Calcular postagens por dia
        const postsByDay = {};
        posts.forEach(post => {
            const day = new Date(post.created_at).toISOString().split('T')[0];
            postsByDay[day] = (postsByDay[day] || 0) + 1;
        });

        // Calcular sentimento geral
        const sentimentCounts = {
            "Muito Positivo": 0,
            "Positivo": 0,
            "Neutro": 0,
            "Negativo": 0,
            "Muito Negativo": 0
        };

        posts.forEach(post => {
            if (post.sentiment) {
                sentimentCounts[post.sentiment] = (sentimentCounts[post.sentiment] || 0) + 1;
            }
        });

        const totalSentiments = Object.values(sentimentCounts).reduce((a, b) => a + b, 0);
        const overallSentiment = totalSentiments > 0
            ? ((sentimentCounts["Muito Positivo"] + sentimentCounts["Positivo"]) / totalSentiments) * 100
            : 0;

        res.status(200).json({
            user: {
                name: user.name,
                avatarUrl: user.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/711/711769.png',
                bio: user.bio || 'Sem biografia',
            },
            totalPosts: posts.length,
            postsByDay,
            totalScore: posts.length * 10,
            overallSentiment: Math.round(overallSentiment)
        });
    } catch (err) {
        console.error('Erro ao obter o perfil do usuário:', err);
        res.status(500).json({ error: 'Erro ao obter o perfil do usuário.' });
    }
});

module.exports = router;