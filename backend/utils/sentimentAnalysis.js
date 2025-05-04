const positiveWords = [
    'bom', 'ótimo', 'excelente', 'feliz', 'alegria', 'amor', 'fantástico', 'maravilhoso', 'incrível', 'satisfatório', 
    'positivo', 'sucesso', 'esperança', 'gratidão', 'vencedor', 'adorável', 'brilhante', 'divertido', 'saudável', 'forte'
];
const negativeWords = [
    'ruim', 'horrível', 'triste', 'ódio', 'raiva', 'péssimo', 'decepcionante', 'insuportável', 'negativo', 'fracasso', 
    'desastre', 'fraco', 'doente', 'perdedor', 'medo', 'tóxico', 'destrutivo', 'lamentável', 'desesperado', 'injusto'
];

function analyzeSentiment(content, likes) {
    let score = 0;

    // Analisar palavras positivas
    positiveWords.forEach(word => {
        if (content.toLowerCase().includes(word)) {
            score += 2;
        }
    });

    // Analisar palavras negativas
    negativeWords.forEach(word => {
        if (content.toLowerCase().includes(word)) {
            score -= 2;
        }
    });

    // Adicionar impacto das curtidas
    score += likes > 10 ? 1 : 0;

    // Determinar o sentimento com base no score
    if (score >= 4) return 'Muito Positivo';
    if (score >= 2) return 'Positivo';
    if (score >= 0) return 'Neutro';
    if (score >= -2) return 'Negativo';
    return 'Muito Negativo';
}

module.exports = analyzeSentiment;