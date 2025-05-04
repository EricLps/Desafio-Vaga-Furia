const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// SERIALIZAÇÃO
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// ESTRATÉGIA LOCAL PARA CRIAÇÃO DE CONTA E LOGIN
passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return done(null, false, { message: 'Email já está em uso!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name: req.body.name,  // Salva o nome do formulário
        });

        return done(null, newUser);

    } catch (error) {
        done(error);
    }
}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'Email não encontrado!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return done(null, false, { message: 'Senha incorreta!' });
        }

        return done(null, user);

    } catch (error) {
        done(error);
    }
}));
