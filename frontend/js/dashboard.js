document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Usuário não autenticado. Faça login.');
        window.location.href = './index.html';
        return;
    }

    // Selecionar elementos do DOM
    const tweetCountElement = document.querySelector(".card:nth-child(1) p");
    const lastMentionElement = document.querySelector(".card:nth-child(3) p");
    const fanScoreElement = document.querySelector(".user-info h2");
    const progressBarElement = document.querySelector("#progressBar");
    const sentimentElement = document.querySelector(".dashboard-sentiment h3");
    const positiveSentimentElement = document.querySelector(".card:nth-child(2) p");

    // Carregar dados do perfil
    fetch(`http://localhost:3000/users/profile/${user._id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro ao carregar dados: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            const { user, totalPosts, postsByDay, totalScore, overallSentiment } = data;

            // Atualizar informações do usuário
            fanScoreElement.textContent = `Olá, ${user.name}`;
            tweetCountElement.textContent = totalPosts;
            lastMentionElement.textContent = totalPosts > 0 ? 'há poucos dias' : 'Nenhuma menção encontrada';

            // Atualizar a barra de progresso
            const progressPercentage = Math.min((totalScore / 1000) * 100, 100);
            progressBarElement.style.width = `${progressPercentage}%`;

            // Atualizar o sentimento geral
            sentimentElement.textContent = `Sentimento Geral: ${overallSentiment}`;

            // Atualizar o sentimento positivo no card
            positiveSentimentElement.textContent = `${overallSentiment}`;

            // Atualizar o gráfico de postagens por dia
            updatePostsChart(postsByDay || {});
        })
        .catch(err => {
            console.error("Erro ao carregar dados da dashboard:", err);
            alert('Erro ao carregar dados da dashboard. Tente novamente mais tarde.');
        });

    // Função para atualizar o gráfico de postagens por dia
    function updatePostsChart(postsByDay) {
        const ctx = document.getElementById('sentimentoChart').getContext('2d');

        // Garantir que os dados existam
        const labels = Object.keys(postsByDay).length > 0 ? Object.keys(postsByDay) : ['Sem dados'];
        const data = Object.keys(postsByDay).length > 0 ? Object.values(postsByDay) : [0];

        // Limpar gráfico existente (se houver)
        if (window.postsChart) {
            window.postsChart.destroy();
        }

        // Criar o gráfico
        window.postsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Postagens por Dia',
                    data,
                    backgroundColor: 'rgba(0, 180, 255, 0.5)',
                    borderColor: '#00B4FF',
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#FFFFFF' },
                        grid: { color: '#333' }
                    },
                    x: {
                        ticks: { color: '#FFFFFF' },
                        grid: { color: '#333' }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#CCCCCC'
                        }
                    }
                }
            }
        });
    }
});
