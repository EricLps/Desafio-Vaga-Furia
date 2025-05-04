const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    file_data: { type: String },
    file_type: { type: String },
    likes: { type: Number, default: 0 },
    sentiment: { type: String, default: 'Neutro' }, // Sentimento do post
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);