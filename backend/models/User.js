const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { 
        type: String, 
        default: 'https://cdn-icons-png.flaticon.com/512/711/711769.png', // URL da imagem padrão
    },
    bio: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

// Criptografar a senha antes de salvar
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Método para comparar a senha
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);