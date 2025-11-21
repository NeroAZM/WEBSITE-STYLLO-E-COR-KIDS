const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Preencha todos os campos." });
    }

    const usuarioEncontrado = await Usuario.findOne({ username: username });

    if (!usuarioEncontrado) {
      return res
        .status(401)
        .json({ success: false, message: "Usuário ou senha incorretos" });
    }

    // Compara a senha com o HASH salvo no banco
    const isMatch = await bcrypt.compare(password, usuarioEncontrado.password);

    if (isMatch) {
      return res.json({
        success: true,
        message: "Login realizado com sucesso!",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Usuário ou senha incorretos" });
    }
  } catch (erro) {
    console.error("Erro no login:", erro);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor" });
  }
};

// Criar novo usuario
exports.registrar = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Preencha usuário e senha" });
    }

    // Verifica se já existe
    const existe = await Usuario.findOne({ username });
    if (existe) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    // CRIPTOGRAFIA ACONTECE AQUI
    // O '10' é o custo do processamento (salt rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Cria usuário com a senha hasheada
    const novoUsuario = new Usuario({
      username,
      password: passwordHash,
    });

    await novoUsuario.save();

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (erro) {
    res.status(500).json({ message: "Erro ao registrar", erro: erro.message });
  }
};
