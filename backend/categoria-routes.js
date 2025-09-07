const express = require('express');
const router = express.Router();
const categoryRepository = require('./categoria-repository');

router.get('/categories', (req, res) => {
    categoryRepository.getAllCategories((err, categories) => {
        if (err) {
            console.error('Erro ao buscar categorias:', err.message);
            return res.status(500).json({ message: 'Erro interno ao buscar categorias.' });
        }
        res.status(200).json(categories);
    });
});

router.post('/categories', (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
    }
    categoryRepository.createCategory({ name, description }, (err, newCategory) => {
        if (err) {
            console.error('Erro ao criar categoria:', err.message);
            return res.status(500).json({ message: 'Erro interno ao criar a categoria.' });
        }
        res.status(201).json(newCategory);
    });
});

router.put('/categories/:id', (req, res) => {
    const { name, description } = req.body;
    const { id } = req.params;
    if (!name) {
        return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
    }
    categoryRepository.updateCategory(id, { name, description }, (err, updatedCategory) => {
        if (err) {
            console.error('Erro ao atualizar categoria:', err.message);
            return res.status(500).json({ message: 'Erro interno ao atualizar a categoria.' });
        }
        res.status(200).json(updatedCategory);
    });
});

module.exports = router;
