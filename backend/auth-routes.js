const express = require('express');
const router = express.Router();
const authRepository = require('./auth-repository');

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const newUser = { nome: name, email: email, senha: password };

    authRepository.createUser(newUser, (err, user) => {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(409).json({ message: 'Este email já está em uso.' });
            }
            return res.status(500).json({ message: 'Erro interno ao registrar o usuário.' });
        }
        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    authRepository.findUserByEmail(email, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        authRepository.verifyPassword(password, user.SenhaHash, (err, match) => {
            if (err || !match) {
                return res.status(401).json({ message: 'Email ou senha inválidos.' });
            }
            const userResponse = {
                userId: user.UsuarioID,
                name: user.Nome,
                email: user.Email,
                token: "tokenvalido"
            };
            res.status(200).json({ message: 'Login bem-sucedido!', user: userResponse });
        });
    });
});

router.post('/api/questions', (req, res) => {
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