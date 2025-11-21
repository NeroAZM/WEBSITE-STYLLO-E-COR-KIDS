const Produto = require("../models/Produto");

// Buscar todos os produtos
exports.listarProdutos = async (req, res) => {
  try {
    // Busca e ordena pelo mais recente
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar produtos", erro: erro.message });
  }
};

// Criar um novo produto
exports.criarProduto = async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    const produtoSalvo = await novoProduto.save();
    res.status(201).json(produtoSalvo);
  } catch (erro) {
    res
      .status(400)
      .json({ mensagem: "Erro ao criar produto", erro: erro.message });
  }
};

// Deletar um produto
exports.deletarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produtoDeletado = await Produto.findByIdAndDelete(id);

    if (!produtoDeletado) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    res.json({ mensagem: "Produto excluído com sucesso!" });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao excluir", erro: erro.message });
  }
};

// Atualizar um produto
exports.atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    // new: true retorna o objeto atualizado, não o antigo
    const produtoAtualizado = await Produto.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!produtoAtualizado) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    res.json(produtoAtualizado);
  } catch (erro) {
    res.status(400).json({ mensagem: "Erro ao atualizar", erro: erro.message });
  }
};
