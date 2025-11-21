const express = require("express");
const router = express.Router();
const authController = require("../controllers/autenticadorController");

// Rota: POST /login
router.post("/login", authController.login);

module.exports = router;
