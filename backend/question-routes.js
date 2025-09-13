const express = require('express');
const router = express.Router();
const questionRepository = require('./question-repository');

router.post('/questions', (req, res) => {
    const questionData = req.body;

    if (!questionData.shortDescription || !questionData.fullStatement || !questionData.type || !questionData.difficulty) {
        return res.status(400).json({ message: 'Campos obrigatórios estão faltando.' });
    }

    questionRepository.createQuestion(questionData, (err, result) => {
        if (err) {
            console.error('Erro ao criar questão:', err.message);
            return res.status(500).json({ message: 'Erro interno ao salvar a questão.' });
        }
        res.status(201).json({ message: 'Questão criada com sucesso!', questionId: result.id });
    });
});

router.post('/questions/bulk', (req, res) => {
    const questions = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Envie uma lista de questões.' });
    }
    // Validação básica
    const invalids = questions.filter(q =>
        !q.shortDescription || !q.fullStatement || !q.type || !q.difficulty
    );
    if (invalids.length > 0) {
        return res.status(400).json({ message: 'Uma ou mais questões estão inválidas.' });
    }
    require('./question-repository').createQuestionsBulk(questions, (err, result) => {
        if (err) {
            console.error('Erro ao criar questões em lote:', err.message);
            return res.status(500).json({ message: 'Erro ao salvar questões.' });
        }
        res.status(201).json({ message: 'Questões criadas!', saved: result.saved });
    });
});

router.get('/questions/search', (req, res) => {
    // Extrai os parâmetros da URL (ex: ?text=teste&categoryId=1)
    const { text, categoryId, reputation } = req.query;
    const params = { text, categoryId, reputation };

    questionRepository.searchQuestions(params, (err, questions) => {
        if (err) {
            console.error('Erro ao buscar questões:', err.message);
            return res.status(500).json({ message: 'Erro interno ao buscar questões.' });
        }
        res.status(200).json(questions);
    });
});

// Rota para a busca dinâmica (montar avaliação)
router.post('/questions/dynamic-search', (req, res) => {
    // Extrai os parâmetros do corpo da requisição POST
    const params = req.body;
    questionRepository.dynamicSearch(params, (err, questions) => {
        if (err) {
            console.error('Erro na busca dinâmica:', err.message);
            return res.status(500).json({ message: 'Erro interno na busca dinâmica.' });
        }
        res.status(200).json(questions);
    });
});

module.exports = router;