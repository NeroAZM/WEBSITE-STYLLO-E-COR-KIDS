const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Definição das rotas
// GET /api/produtos
router.get('/', produtoController.listarProdutos);

// POST /api/produtos
router.post('/', produtoController.criarProduto);

// DELETE /api/produtos/:id
router.delete('/:id', produtoController.deletarProduto);

// PUT /api/produtos/:id
router.put('/:id', produtoController.atualizarProduto);

module.exports = router;