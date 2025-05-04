// services/authService.js
const User = require('../models/User');

// Função para criar ou buscar um usuário no banco
exports.findOrCreateUser = async (profile, provider) => {
    let user = await User.findOne({ where: { email: profile.emails[0].value } });

    if (!user) {
        user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            imageUrl: profile.photos[0].value,
            provider
        });
    }

    return user;
};
