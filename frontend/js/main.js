document.getElementById('login-btn').addEventListener('click', () => {
    // Exibe o formulário de login e esconde o de registro
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';

    // Oculta os botões de alternância
    document.getElementById('register-btn').style.display = 'none';
    document.getElementById('login-btn').style.display = 'none';
});

document.getElementById('register-btn').addEventListener('click', () => {
    // Exibe o formulário de registro e esconde o de login
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';

    // Oculta os botões de alternância
    document.getElementById('register-btn').style.display = 'none';
    document.getElementById('login-btn').style.display = 'none';
});

// Função para voltar para a tela inicial de escolha
document.getElementById('back-btn-register').addEventListener('click', () => {
    // Esconde os formulários e exibe os botões
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';

    document.getElementById('register-btn').style.display = 'inline-block';
    document.getElementById('login-btn').style.display = 'inline-block';
});

document.getElementById('back-btn-login').addEventListener('click', () => {
    // Esconde os formulários e exibe os botões
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';

    document.getElementById('register-btn').style.display = 'inline-block';
    document.getElementById('login-btn').style.display = 'inline-block';
});

// Enviar dados de registro para o backend
document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Usuário criado com sucesso!') {
                alert('Cadastro realizado com sucesso! Faça login para continuar.');

                // Exibe o formulário de login e esconde o de registro
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';

                document.getElementById('register-btn').style.display = 'none';
                document.getElementById('login-btn').style.display = 'none';
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.log('Erro:', error));
});

// Enviar dados de login para o backend
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclui cookies na requisição
    })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                // Salva informações do usuário no localStorage
                localStorage.setItem('user', JSON.stringify(data.user));


                window.location.href = './homepage.html';
            } else {
                alert(data.error || 'Erro ao fazer login.');
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Tente novamente.');
        });
});
