/**
 * Gerencia Produtos, Categorias e Estatísticas via API.
 */

// CONFIGURAÇÕES E ESTADO
const URL_API = "http://localhost:3000/api/produtos";
const URL_CATEGORIAS = "http://localhost:3000/api/categorias";

let listaProdutos = [];
let produtoIdParaEditar = null;

// ELEMENTOS DO DOM
const corpoTabela = document.getElementById("admin-product-list");
const mensagemSemResultados = document.getElementById("admin-no-results");

const statsTotal = document.getElementById("stats-total");
const statsCategorias = document.getElementById("stats-categories");
const statsMedia = document.getElementById("stats-average");

const modalProduto = document.getElementById("modal-produto");
const formProduto = document.getElementById("form-produto");
const tituloModalProduto = document.querySelector("#modal-produto h3");
const btnNovoProduto = document.getElementById("btn-novo-produto");
const btnFecharModal = document.getElementById("btn-fechar-modal");
const btnCancelar = document.getElementById("btn-cancelar");
const selectCategoriaProduto = document.getElementById(
  "select-categoria-produto"
);

const modalCategorias = document.getElementById("modal-categorias");
const listaCategoriasModal = document.getElementById("lista-categorias-modal");
const formNovaCategoria = document.getElementById("form-nova-categoria");
const btnGerenciarCategorias = document.getElementById(
  "btn-gerenciar-categorias"
);
const btnFecharCat = document.getElementById("btn-fechar-cat");

/**
 * Busca produtos da API
 */
async function buscarProdutos() {
  try {
    const resposta = await fetch(URL_API);
    if (!resposta.ok) throw new Error(`Erro na API: ${resposta.status}`);

    listaProdutos = await resposta.json();

    atualizarDashboard();
    renderizarTabelaProdutos();
  } catch (erro) {
    console.error("Falha ao carregar produtos:", erro);
    exibirErroNaTabela(erro.message);
  }
}

/**
 * Renderiza a tabela
 */
function renderizarTabelaProdutos() {
  corpoTabela.innerHTML = "";

  if (listaProdutos.length === 0) {
    mensagemSemResultados.classList.remove("hidden");
    return;
  } else {
    mensagemSemResultados.classList.add("hidden");
  }

  listaProdutos.forEach((produto) => {
    const linha = criarLinhaProduto(produto);
    corpoTabela.appendChild(linha);
  });

  lucide.createIcons();
}

/**
 * Cria a linha da tabela
 */
function criarLinhaProduto(produto) {
  const linha = document.createElement("tr");
  linha.className = "border-bottom hover:bg-gray-50 transition-colors";

  const urlImagem = produto.images
    ? produto.images
    : "https://placehold.co/100?text=Sem+Foto";
  const precoFormatado = parseFloat(produto.price).toFixed(2);
  const idCurto = produto._id ? produto._id.slice(-6) : "...";

  linha.innerHTML = `
    <td class="py-3 px-4">
      <div class="d-flex align-items-center">
        <div class="flex-shrink-0 h-10 w-10">
          <img class="h-10 w-10 rounded-full object-cover border border-gray-200" src="${urlImagem}" alt="${produto.name}">
        </div>
        <div class="ms-3">
          <div class="text-sm font-medium text-gray-900 fw-bold">${produto.name}</div>
          <div class="text-xs text-gray-500" title="${produto._id}">ID: ...${idCurto}</div>
        </div>
      </div>
    </td>
    <td class="py-3 px-4">
      <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style="background-color: #FFE082; color: #555;">
        ${produto.category}
      </span>
    </td>
    <td class="py-3 px-4"><div class="text-sm text-gray-500">${produto.ageRange}</div></td>
    <td class="py-3 px-4"><div class="text-sm font-semibold" style="color: #F8BBD0; filter: brightness(0.8);">R$ ${precoFormatado}</div></td>
    <td class="py-3 px-4 text-center">
      <div class="flex justify-center gap-2">
        <button class="btn btn-sm btn-light text-blue-500 border-0 hover:bg-blue-50" title="Editar" onclick="abrirModalEditar('${produto._id}')">
          <i data-lucide="edit-2" class="w-4 h-4"></i>
        </button>
        <button class="btn btn-sm btn-light text-red-500 border-0 hover:bg-red-50" title="Excluir" onclick="deletarProduto('${produto._id}')">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    </td>
  `;
  return linha;
}

/**
 * Abre o modal preenchido para edição
 */
window.abrirModalEditar = (id) => {
  const produto = listaProdutos.find((p) => p._id === id);
  if (!produto) return;

  formProduto.nome.value = produto.name;
  formProduto.preco.value = produto.price;
  formProduto.categoria.value = produto.category;
  formProduto.faixaEtaria.value = produto.ageRange;
  formProduto.imagem.value = produto.images || "";
  formProduto.descricao.value = produto.description;
  formProduto.tamanhos.value = produto.sizes || "";
  formProduto.cores.value = produto.colors || "";

  produtoIdParaEditar = id;
  tituloModalProduto.textContent = "Editar Produto";
  modalProduto.showModal();
};

/**
 * Exclui produto
 */
window.deletarProduto = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este produto permanentemente?"))
    return;

  try {
    const resposta = await fetch(`${URL_API}/${id}`, { method: "DELETE" });
    if (!resposta.ok) throw new Error("Erro ao excluir");

    alert("Produto excluído com sucesso!");
    buscarProdutos();
  } catch (erro) {
    console.error(erro);
    alert("Erro: " + erro.message);
  }
};

/**
 * Busca e popula categorias
 */
async function buscarCategorias() {
  try {
    const res = await fetch(URL_CATEGORIAS);
    const categorias = await res.json();

    selectCategoriaProduto.innerHTML = '<option value="">Selecione...</option>';
    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      selectCategoriaProduto.appendChild(option);
    });

    listaCategoriasModal.innerHTML = "";
    categorias.forEach((cat) => {
      const item = document.createElement("div");
      item.className =
        "flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 border border-gray-100";
      item.innerHTML = `
                <span class="font-medium text-gray-700">${cat.name}</span>
                <button onclick="deletarCategoria('${cat._id}')" class="text-red-400 hover:text-red-600 p-1">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            `;
      listaCategoriasModal.appendChild(item);
    });
    lucide.createIcons();
  } catch (erro) {
    console.error("Erro categorias", erro);
  }
}

window.deletarCategoria = async (id) => {
  if (!confirm("Remover esta categoria?")) return;
  try {
    await fetch(`${URL_CATEGORIAS}/${id}`, { method: "DELETE" });
    buscarCategorias();
  } catch (erro) {
    alert("Erro ao deletar");
  }
};

if (formNovaCategoria) {
  formNovaCategoria.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = formNovaCategoria.querySelector("input");
    const nome = input.value.trim();
    if (!nome) return;

    try {
      const res = await fetch(URL_CATEGORIAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome }),
      });
      if (res.ok) {
        input.value = "";
        buscarCategorias();
      } else {
        alert("Erro ao criar");
      }
    } catch (erro) {
      console.error(erro);
    }
  });
}

// Dashboard
function atualizarDashboard() {
  if (listaProdutos.length === 0) {
    statsTotal.textContent = "0";
    statsCategorias.textContent = "0";
    statsMedia.textContent = "R$ 0,00";
    return;
  }
  statsTotal.textContent = listaProdutos.length;
  const categoriasUnicas = new Set(listaProdutos.map((p) => p.category));
  statsCategorias.textContent = categoriasUnicas.size;
  const somaTotal = listaProdutos.reduce(
    (acc, produto) => acc + parseFloat(produto.price),
    0
  );
  const media = somaTotal / listaProdutos.length;
  statsMedia.textContent = media.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function exibirErroNaTabela(mensagem) {
  corpoTabela.innerHTML = `<tr><td colspan="5" class="text-center py-5 text-red-500">Erro: ${mensagem}</td></tr>`;
}

// Eventos de Modais
if (btnNovoProduto)
  btnNovoProduto.addEventListener("click", () => {
    produtoIdParaEditar = null;
    tituloModalProduto.textContent = "Cadastrar Novo Produto";
    formProduto.reset();
    modalProduto.showModal();
  });

if (btnGerenciarCategorias)
  btnGerenciarCategorias.addEventListener("click", () => {
    buscarCategorias();
    modalCategorias.showModal();
  });

function fecharTodosModais() {
  modalProduto.close();
  modalCategorias.close();
  formProduto.reset();
  produtoIdParaEditar = null;
  tituloModalProduto.textContent = "Cadastrar Novo Produto";
}

if (btnFecharModal) btnFecharModal.addEventListener("click", fecharTodosModais);
if (btnCancelar) btnCancelar.addEventListener("click", fecharTodosModais);
if (btnFecharCat) btnFecharCat.addEventListener("click", fecharTodosModais);

// Submit do Form (Criar ou Editar)
if (formProduto) {
  formProduto.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(formProduto);

    // 1. Formata Texto (Preservando Espaços)
    const tamanhosFormatados = formatarTextoCapitalizado(
      formData.get("tamanhos")
    );
    const coresFormatadas = formatarTextoCapitalizado(formData.get("cores"));

    const dadosProduto = {
      name: formData.get("nome"),
      price: parseFloat(formData.get("preco")),
      category: formData.get("categoria"),
      ageRange: formData.get("faixaEtaria"),
      description: formData.get("descricao"),
      images: formData.get("imagem"),
      sizes: tamanhosFormatados,
      colors: coresFormatadas,
    };

    try {
      let resposta;

      if (produtoIdParaEditar) {
        resposta = await fetch(`${URL_API}/${produtoIdParaEditar}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosProduto),
        });
      } else {
        resposta = await fetch(URL_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosProduto),
        });
      }

      if (!resposta.ok) throw new Error("Erro na operação");

      alert(
        produtoIdParaEditar ? "Produto atualizado!" : "Produto cadastrado!"
      );
      fecharTodosModais();
      buscarProdutos();
    } catch (erro) {
      console.error(erro);
      alert("Erro: " + erro.message);
    }
  });
}

/**
 * Função: Pascal Case cada palavra.
 * Ex: "azul marinho" vira "Azul Marinho"
 */
function formatarTextoCapitalizado(texto) {
  if (!texto) return "";

  return texto
    .split(",")
    .map((item) => {
      // Divide por espaço, capitaliza cada parte e junta com ESPAÇO
      return item
        .trim()
        .split(/\s+/)
        .map((palavra) => {
          return (
            palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
          );
        })
        .join(" ");
    })
    .join(", ");
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  buscarProdutos();
  buscarCategorias();
});
