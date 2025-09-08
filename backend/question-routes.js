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

module.exports = router;