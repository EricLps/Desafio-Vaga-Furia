const express = require('express');
const router = express.Router(); // Inicializando o router corretamente
const User = require('../models/User'); // Supondo que você tenha um modelo User

// Rota para registro
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe!' });
        }

        const newUser = new User({
            name,
            email,
            password,
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
});

// Rota para login
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

        // Retorna o objeto do usuário (sem a senha)
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json({ message: 'Login bem-sucedido!', user: userWithoutPassword });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

module.exports = router;
