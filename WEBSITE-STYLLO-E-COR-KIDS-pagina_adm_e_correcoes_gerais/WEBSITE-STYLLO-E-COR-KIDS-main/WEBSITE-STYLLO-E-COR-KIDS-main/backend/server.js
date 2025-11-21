require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rotasProduto = require('./routes/produtoRoutes');
const rotasAuth = require('./routes/autenticadorRoutes');
const rotasCategoria = require('./routes/categoriaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexão com MongoDB
if (!process.env.MONGO_URI) {
  console.error("ERRO: MONGO_URI não definida .env");
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((erro) => console.error('Erro de conexão:', erro));
}

app.use('/api/produtos', rotasProduto);

app.use('/', rotasAuth);

app.use('/api/categorias', rotasCategoria);

// Rota Raiz
app.get('/', (req, res) => {
    res.send('API Stylo e Cor Kids rodando!');
});

// Inicialização
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});