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

module.exports = router;