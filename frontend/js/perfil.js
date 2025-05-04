document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtém o usuário logado
    if (!user) {
        alert('Usuário não autenticado. Faça login.');
        window.location.href = './index.html';
        return;
    }

    // Seleciona elementos do DOM para exibir informações do perfil
    const profileNameElement = document.getElementById("profileName");
    const profileImageElement = document.getElementById("profileImage");
    const profileBioElement = document.getElementById("profileBio");
    const tweetCountElement = document.getElementById("tweetCount");
    const userPostsContainer = document.getElementById("userPosts");

    // Faz uma requisição ao backend para carregar os dados do perfil
    fetch(`http://localhost:3000/users/profile/${user._id}`)
        .then(res => res.json())
        .then(data => {
            const { user, totalPosts, posts } = data;

            // Atualiza as informações do perfil no DOM
            profileNameElement.textContent = user.name;
            profileImageElement.src = user.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/711/711769.png';
            profileBioElement.textContent = user.bio || 'Sem biografia';
            tweetCountElement.textContent = totalPosts;

            // Adiciona os posts do usuário ao contêiner
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-card';
                postElement.innerHTML = `
                    <h3>${post.content || 'Sem conteúdo'}</h3>
                    ${post.file_data ? `<img src="http://localhost:3000/posts/file/${post._id}" alt="Imagem do post">` : ''}
                    <span>${new Date(post.created_at).toLocaleString()}</span>
                `;
                userPostsContainer.appendChild(postElement);
            });
        })
        .catch(err => console.error("Erro ao carregar perfil:", err));
});