const User = require('../models/User');  // Modelo de usuário
const passport = require('passport');

// Lógica de callback do Google
exports.googleCallback = async (req, res) => {
    try {
        // Verifica se o usuário já existe no banco
        let user = await User.findOne({ googleId: req.user.id });

        if (!user) {
            // Caso não exista, cria um novo usuário
            user = new User({
                googleId: req.user.id,
                name: req.user.displayName,
                email: req.user.emails[0].value,
                profilePicture: req.user.photos[0].value,
            });

            // Salva o usuário no banco
            await user.save();
        }

        // Redireciona o usuário para a página de perfil
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: 'Erro ao realizar login' });
            res.redirect('/perfil');
        });
    } catch (error) {
        console.error('Erro ao autenticar com Google:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Lógica de callback do Twitter
exports.twitterCallback = async (req, res) => {
    try {
        // Verifica se o usuário já existe no banco
        let user = await User.findOne({ twitterId: req.user.id });

        if (!user) {
            // Caso não exista, cria um novo usuário
            user = new User({
                twitterId: req.user.id,
                name: req.user.displayName,
                profilePicture: req.user.photos[0].value, // Ou outra propriedade do Twitter
            });

            // Salva o usuário no banco
            await user.save();
        }

        // Redireciona o usuário para a página de perfil
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: 'Erro ao realizar login' });
            res.redirect('/perfil');
        });
    } catch (error) {
        console.error('Erro ao autenticar com Twitter:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
