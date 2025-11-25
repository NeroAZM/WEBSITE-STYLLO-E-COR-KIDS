// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');

const rotasProduto = require('./routes/produtoRoutes');
const rotasAuth = require('./routes/autenticadorRoutes');
const rotasCategoria = require('./routes/categoriaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

const conectadoAoBanco = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Erro na conexão MongoDB:', error);
  }
};

// Garantir conexão antes das rotas
app.use(async (req, res, next) => {
  await conectadoAoBanco();
  next();
});

// Configuração das rotas
const router = express.Router();

router.use('/produtos', rotasProduto);
router.use('/', rotasAuth);
router.use('/categorias', rotasCategoria);

router.get('/', (req, res) => {
    res.send('API Stylo e Cor Kids rodando no Netlify!');
});

app.use('/.netlify/functions/api', router);

// Exportar o handler para o Netlify
module.exports.handler = serverless(app);