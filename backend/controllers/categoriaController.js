const Categoria = require("../models/Categoria");

// Listar todas
exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ name: 1 });
    res.json(categorias);
  } catch (erro) {
    res.status(500).json({ message: "Erro ao buscar categorias" });
  }
};

// Criar nova
exports.criarCategoria = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Nome é obrigatório" });

    const novaCategoria = new Categoria({ name });
    await novaCategoria.save();
    res.status(201).json(novaCategoria);
  } catch (erro) {
    res.status(400).json({ message: "Erro ao criar (talvez já exista?)" });
  }
};

// Deletar
exports.deletarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Categoria.findByIdAndDelete(id);
    res.json({ message: "Categoria removida" });
  } catch (erro) {
    res.status(500).json({ message: "Erro ao deletar" });
  }
};
