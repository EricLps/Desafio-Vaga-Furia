document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('feed');

    // Carregar os posts do backend
    fetch('http://localhost:3000/posts')
        .then(res => res.json())
        .then(posts => {
            posts.forEach(post => {
                addPostToFeed(post, feed);
            });
        })
        .catch(err => console.error('Erro ao carregar posts:', err));
});

function addPostToFeed(post, container) {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    // Cabeçalho do post
    postElement.innerHTML = `
        <div class="post-header">
            <img src="${post.user_id.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/711/711769.png'}" alt="Avatar" class="avatar">
            <div class="user-info">
                <strong>${post.user_id.name}</strong>
                <span>${new Date(post.created_at).toLocaleString()}</span>
            </div>
        </div>
    `;

    // Conteúdo do post
    const content = document.createElement('div');
    content.className = 'post-content';

    if (post.content) {
        const textElement = document.createElement('p');
        textElement.textContent = post.content;
        content.appendChild(textElement);
    }

    if (post.file_data) {
        const media = document.createElement(post.file_type.startsWith('image/') ? 'img' : 'video');
        media.src = `http://localhost:3000/posts/file/${post._id}`;
        media.alt = 'Mídia do post';
        if (post.file_type.startsWith('video/')) {
            media.controls = true;
        }
        content.appendChild(media);
    }

    postElement.appendChild(content);
    container.prepend(postElement);
}

document.addEventListener('DOMContentLoaded', () => {
    const photoInput = document.getElementById('photo-upload');
    const videoInput = document.getElementById('video-upload');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const thumbnailPreview = document.getElementById('thumbnail-preview');
    const removeThumbnailButton = document.getElementById('remove-thumbnail');

    // Função para exibir a miniatura
    function displayThumbnail(file) {
        const fileType = file.type;

        // Limpa o contêiner de miniaturas
        thumbnailPreview.innerHTML = '';

        if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = 'Miniatura da imagem';
            img.style.maxWidth = '100px';
            img.style.maxHeight = '100px';
            thumbnailPreview.appendChild(img);
        } else if (fileType.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.controls = true;
            video.style.maxWidth = '100px';
            video.style.maxHeight = '100px';
            thumbnailPreview.appendChild(video);
        }

        thumbnailContainer.style.display = 'block';
    }

    // Evento para exibir a miniatura ao selecionar uma imagem
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            displayThumbnail(file);
        }
    });

    // Evento para exibir a miniatura ao selecionar um vídeo
    videoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            displayThumbnail(file);
        }
    });

    // Evento para remover a seleção de arquivos
    removeThumbnailButton.addEventListener('click', () => {
        photoInput.value = '';
        videoInput.value = '';
        thumbnailPreview.innerHTML = '';
        thumbnailContainer.style.display = 'none';
    });

    const form = document.getElementById('post-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const content = document.getElementById('post-text').value.trim();
        const file = photoInput.files[0] || videoInput.files[0] || null;

        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert('Você precisa estar logado para postar.');
            return;
        }

        if (!content && !file) {
            alert('É necessário enviar texto ou um arquivo.');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', user._id);
        if (content) {
            formData.append('content', content);
        }
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch('http://localhost:3000/posts/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao criar o post.');
            }

            const { post } = await response.json();
            alert('Post criado com sucesso!');
            form.reset();
            thumbnailContainer.style.display = 'none';
        } catch (error) {
            console.error('Erro ao criar o post:', error);
            alert(error.message || 'Erro ao criar o post. Tente novamente.');
        }
    });
});

document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', function () {
        if (this.textContent === '❤️') {
            this.textContent = '🤍'; // Volta para o coração branco
        } else {
            this.textContent = '❤️'; // Altera para o coração vermelho
        }
    });
});

let lastPostTimestamp = null; // Armazena o timestamp do último post carregado

function fetchNewPosts() {
    fetch('http://localhost:3000/posts')
        .then(res => res.json())
        .then(posts => {
            // Filtra apenas os posts mais recentes
            const newPosts = posts.filter(post => {
                const postTimestamp = new Date(post.created_at).getTime();
                return !lastPostTimestamp || postTimestamp > lastPostTimestamp;
            });

            // Atualiza o timestamp do último post
            if (newPosts.length > 0) {
                lastPostTimestamp = new Date(newPosts[0].created_at).getTime();
            }

            // Adiciona os novos posts ao feed
            const feed = document.getElementById('feed');
            newPosts.forEach(post => {
                addPostToFeed(post, feed);
            });
        })
        .catch(err => console.error('Erro ao buscar novos posts:', err));
}

// Chama a função a cada 10 segundos
setInterval(fetchNewPosts, 10000);