require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
=======
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
>>>>>>> a33c047b84831b27ee1a61a65398595924278e77

const app = express();
app.use(cors());
app.use(express.json());

// --- CONEXÃO COM O BANCO ---
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
<<<<<<< HEAD
    console.log(">>> MongoDB Conectado!");
  } catch (error) {
    console.error(">>> Erro MongoDB:", error);
=======
    console.log('>>> MongoDB Conectado!');
  } catch (error) {
    console.error('>>> Erro MongoDB:', error);
>>>>>>> a33c047b84831b27ee1a61a65398595924278e77
  }
};

// --- MIDDLEWARE DE DEBUG ---
app.use(async (req, res, next) => {
  console.log(`[DEBUG] Requisição recebida: ${req.method} ${req.url}`);
  await connectToDatabase();
  next();
});

// --- ROTAS ---
const router = express.Router();

<<<<<<< HEAD
const rotasProduto = require("./routes/produtoRoutes");
const rotasAuth = require("./routes/autenticadorRoutes");
const rotasCategoria = require("./routes/categoriaRoutes");

router.use("/produtos", rotasProduto);
router.use("/", rotasAuth);
router.use("/categorias", rotasCategoria);

router.get("/teste", (req, res) => {
  res.json({ mensagem: "Backend funcionando!", url: req.originalUrl });
});

app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    caminhoRecebido: req.originalUrl,
  });
});

module.exports.handler = serverless(app);
=======
const rotasProduto = require('./routes/produtoRoutes');
const rotasAuth = require('./routes/autenticadorRoutes');
const rotasCategoria = require('./routes/categoriaRoutes');

router.use('/produtos', rotasProduto);
router.use('/', rotasAuth);
router.use('/categorias', rotasCategoria);

router.get('/teste', (req, res) => {
    res.json({ mensagem: "Backend funcionando!", url: req.originalUrl });
});

app.use('/api', router);

app.use((req, res) => {
    res.status(404).json({
        erro: "Rota não encontrada",
        caminhoRecebido: req.originalUrl
    });
});

module.exports.handler = serverless(app);
>>>>>>> a33c047b84831b27ee1a61a65398595924278e77
