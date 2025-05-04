document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('post-form');
    const feed = document.getElementById('feed');
    const userPosts = document.getElementById('userPosts'); // Seção de posts do perfil

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = e.target;
        const content = document.getElementById('post-text').value;
        const file = document.getElementById('file-upload').files[0];
        const user = JSON.parse(localStorage.getItem('user')); // Obtém o usuário logado

        if (!user) {
            alert('Você precisa estar logado para postar.');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', user._id);
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch('http://localhost:3000/posts/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erro ao criar o post.');
            }

            const { post } = await response.json();
            alert('Post criado com sucesso!');
            form.reset();
        } catch (error) {
            console.error('Erro ao criar o post:', error);
            alert('Erro ao criar o post. Tente novamente.');
        }
    });

    function addPostToFeed(post, container) {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        const header = document.createElement('div');
        header.className = 'post-header';
        header.innerHTML = `
            <img src="${post.user_id.avatarUrl || 'https://via.placeholder.com/50'}" alt="Avatar" class="avatar">
            <div class="user-info">
                <strong>${post.user_id.name}</strong>
                <span>${new Date(post.created_at).toLocaleString()}</span>
            </div>
        `;
        postElement.appendChild(header);

        const content = document.createElement('div');
        content.className = 'post-content';
        content.innerHTML = `<p>${post.content}</p>`;
        if (post.image_url) {
            const img = document.createElement('img');
            img.src = post.image_url;
            img.alt = 'Imagem do post';
            content.appendChild(img);
        }
        postElement.appendChild(content);

        container.prepend(postElement);
    }
});