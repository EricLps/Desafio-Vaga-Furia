# ⚡ FURIA Fan Insights

Este repositório contém o projeto **FURIA Fan Insights**, uma aplicação web que permite aos fãs da FURIA interagir, compartilhar posts, analisar sentimentos e acompanhar estatísticas relacionadas à equipe.

A aplicação é composta por:
- 🧠 **Backend**: Node.js com Express
- 💻 **Frontend**: HTML, CSS e JavaScript

---

## 🚀 Funcionalidades

### 1. Registro e Login
- **Registro**: Criação de conta com nome, e-mail e senha.
- **Login**: Acesso com e-mail e senha.
- **Autenticação**: Utiliza Passport.js (autenticação local).

### 2. Perfil do Usuário
- Exibe nome, avatar e biografia.
- Permite edição de perfil.
- Mostra posts criados pelo usuário.

### 3. Postagens
- Criação de posts com texto, imagem ou vídeo.
- Feed na homepage e na página de perfil.
- Suporte a arquivos `.jpg`, `.png`, `.webp`, `.mp4`.

### 4. Dashboard
- Total de tweets sobre a FURIA.
- Sentimento positivo médio.
- Última menção.
- Gráfico de postagens por dia.
- Barra de progresso da pontuação do fã.

### 5. Análise de Sentimento
- Detecta palavras positivas/negativas nos posts.
- Classifica os posts como:
  - Muito Positivo
  - Positivo
  - Neutro
  - Negativo
  - Muito Negativo

---

## 📁 Estrutura do Projeto

### 🔧 Backend

#### Arquivos principais
- `server.js`: Configuração do servidor Express.

#### Rotas
- `authRoutes.js`: Registro e login de usuários.
- `userRoutes.js`: Perfil e estatísticas.
- `postRoutes.js`: Posts.

#### Modelos
- `User.js`: Modelo de usuário.
- `Post.js`: Modelo de post.

#### Configurações
- `db.js`: Conexão com MongoDB.
- `upload.js`: Configuração do Multer (upload).
- `passport.js`: Autenticação com Passport.js.

#### Utilitários
- `sentimentAnalysis.js`: Lógica de análise de sentimento.

---

### 🌐 Frontend

#### HTML
- `index.html`: Login e registro.
- `homepage.html`: Feed de posts.
- `perfil.html`: Perfil do usuário.
- `dashboard.html`: Estatísticas.

#### CSS
- `style.css`: Estilos globais e específicos.

#### JavaScript
- `main.js`: Lógica de login/registro.
- `homepage.js`: Feed de posts.
- `perfil.js`: Perfil do usuário.
- `dashboard.js`: Dashboard de estatísticas.

---

## ⚙️ Configuração do Ambiente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (v16 ou superior)
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/EricLps/Desafio-Vaga-Furia.git
cd Desafio-Vaga-Furiaconfigurações de MongoDB, porta, etc.

cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações de MongoDB, porta, etc.

# Inicie o servidor
npm start
```

Abra o diretório frontend e os arquivos HTML diretamente no navegador:

frontend/
├── index.html
├── homepage.html
├── perfil.html
└── dashboard.html

🧠 Tecnologias utilizadas

    Node.js

    Express

    MongoDB (Mongoose)

    Passport.js

    Multer

    HTML5 / CSS3 / JavaScript

    Chart.js (para gráficos)

📌 Licença

Este projeto foi feito para a aplicação de uma vaga na Furia. Fique à vontade para personalizar ou evoluir.

🙌 Feito por

Eric Lopes





