const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/User');
const multer = require('multer');
const upload = multer(); // Middleware para processar arquivos na memória
const mongoose = require('mongoose');
const analyzeSentiment = require('../utils/sentimentAnalysis');

// Criar um novo post
router.post('/', async (req, res) => {
    const { user_id, content, file_data, file_type, likes } = req.body;

    try {
        const sentiment = analyzeSentiment(content, likes || 0);

        const post = new Post({
            user_id,
            content,
            file_data,
            file_type,
            likes,
            sentiment,
        });

        await post.save();
        res.status(201).json(post);
    } catch (err) {
        console.error('Erro ao criar post:', err);
        res.status(500).json({ error: 'Erro ao criar post.' });
    }
});

// Rota para criar um post com texto e/ou arquivo
router.post('/upload', upload.single('file'), async (req, res) => {
    const { user_id, content } = req.body;

    try {
        // Valida o ID do usuário
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: 'ID do usuário inválido.' });
        }

        // Verifica se o usuário existe
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Verifica se há pelo menos texto ou arquivo
        if (!content && !req.file) {
            return res.status(400).json({ error: 'É necessário enviar texto ou um arquivo.' });
        }

        // Converte o arquivo para Base64, se existir
        const fileData = req.file ? req.file.buffer.toString('base64') : null;
        const fileType = req.file ? req.file.mimetype : null;

        // Cria o post no banco de dados
        const newPost = new Post({
            user_id,
            content: content || null,
            file_data: fileData,
            file_type: fileType,
        });

        await newPost.save();

        res.status(201).json({ message: 'Post criado com sucesso!', post: newPost });
    } catch (err) {
        console.error('Erro ao criar o post:', err);
        res.status(500).json({ error: 'Erro ao criar o post.' });
    }
});

// Rota para criar um post SOMENTE com arquivos
router.post('/upload-file', upload.single('file'), async (req, res) => {
    const { user_id } = req.body;

    try {
        // Valida o user_id
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            console.log('ID do usuário inválido:', user_id);
            return res.status(400).json({ error: 'ID do usuário inválido.' });
        }

        // Verifica se o usuário existe
        const user = await User.findById(user_id);
        if (!user) {
            console.log('Usuário não encontrado:', user_id);
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Verifica se o arquivo foi enviado
        if (!req.file) {
            console.log('Nenhum arquivo foi enviado.');
            return res.status(400).json({ error: 'É necessário enviar um arquivo.' });
        }

        // Cria o post com o arquivo
        const newPost = new Post({
            user_id,
            content: null, // Sem texto
            file_data: req.file.buffer,
            file_type: req.file.mimetype,
        });

        await newPost.save();

        console.log('Post com arquivo criado com sucesso:', newPost);
        res.status(201).json({ message: 'Post com arquivo criado com sucesso!', post: newPost });
    } catch (err) {
        console.error('Erro ao criar o post com arquivo:', err);
        res.status(500).json({ error: 'Erro ao criar o post com arquivo.' });
    }
});

// Rota para criar um post com texto e/ou anexos
router.post('/upload-text-file', async (req, res) => {
    const uploadMiddleware = req.headers['content-type']?.includes('multipart/form-data')
        ? upload.single('file') // Middleware para requisições com arquivos
        : upload.none(); // Middleware para requisições sem arquivos

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.error('Erro no upload:', err);
            return res.status(500).json({ error: 'Erro ao processar o upload.' });
        }

        const { user_id, content } = req.body;

        try {
            // Valida o user_id
            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                console.log('ID do usuário inválido:', user_id);
                return res.status(400).json({ error: 'ID do usuário inválido.' });
            }

            // Verifica se o usuário existe
            const user = await User.findById(user_id);
            if (!user) {
                console.log('Usuário não encontrado:', user_id);
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            // Verifica se há pelo menos texto ou arquivo
            if (!content && !req.file) {
                console.log('Nenhum conteúdo ou arquivo foi enviado.');
                return res.status(400).json({ error: 'É necessário enviar texto ou um arquivo.' });
            }

            // Cria o post com texto e/ou arquivo
            const newPost = new Post({
                user_id,
                content: content || null, // Define como `null` se não houver texto
                file_data: req.file ? req.file.buffer : null, // Define como `null` se não houver arquivo
                file_type: req.file ? req.file.mimetype : null, // Define como `null` se não houver arquivo
            });

            await newPost.save();

            console.log('Post com texto e/ou arquivo criado com sucesso:', newPost);
            res.status(201).json({ message: 'Post com texto e/ou arquivo criado com sucesso!', post: newPost });
        } catch (err) {
            console.error('Erro ao criar o post com texto e/ou arquivo:', err);
            res.status(500).json({ error: 'Erro ao criar o post com texto e/ou arquivo.' });
        }
    });
});

// Endpoint para obter todos os posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user_id', 'name avatarUrl') // Popula os dados do usuário
            .sort({ created_at: -1 }); // Ordena por data de criação (mais recente primeiro)

        res.status(200).json(posts);
    } catch (err) {
        console.error('Erro ao obter os posts:', err);
        res.status(500).json({ error: 'Erro ao obter os posts.' });
    }
});

// Endpoint para obter o arquivo de um post
router.get('/file/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);

        if (!post || !post.file_data) {
            return res.status(404).json({ error: 'Arquivo não encontrado.' });
        }

        // Configurar o tipo de conteúdo e enviar os dados do arquivo
        res.set('Content-Type', post.file_type);
        res.send(Buffer.from(post.file_data, 'base64')); // Certifique-se de que os dados estão no formato correto
    } catch (err) {
        console.error('Erro ao obter o arquivo:', err);
        res.status(500).json({ error: 'Erro ao obter o arquivo.' });
    }
});

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

        const posts = await Post.find({ user_id: userId }).sort({ created_at: -1 });

        // Calcular postagens por dia
        const postsByDay = {};
        posts.forEach(post => {
            const day = new Date(post.created_at).toISOString().split('T')[0];
            postsByDay[day] = (postsByDay[day] || 0) + 1;
        });

        // Calcular pontuação total
        const totalScore = posts.length * 10; // Exemplo: 10 pontos por post

        res.status(200).json({
            user,
            totalPosts: posts.length,
            postsByDay,
            totalScore,
        });
    } catch (err) {
        console.error('Erro ao obter o perfil do usuário:', err);
        res.status(500).json({ error: 'Erro ao obter o perfil do usuário.' });
    }
});

// Função para renderizar um post
function renderPost(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
        <div class="post-header">
            <strong>${post.user_id.name}</strong>
            <span>${new Date(post.created_at).toLocaleString()}</span>
        </div>
        <div class="post-content">
            <p>${post.content}</p>
            ${post.file_data ? `<img src="http://localhost:3000/posts/file/${post._id}" alt="Imagem do post">` : ''}
        </div>
    `;
    return postElement;
}

module.exports = router;