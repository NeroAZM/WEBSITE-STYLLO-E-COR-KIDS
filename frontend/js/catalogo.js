//dados de exemplo (mockado)
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Conjunto Moletom Dino",
    description:
      "Quentinho e divertido, com estampa de dinossauro que brilha no escuro.",
    price: 129.9,
    category: "Conjuntos",
    ageRange: "4-6 anos",
    images: [
      "https://i.imgur.com/g82xL1A.png",
      "https://i.imgur.com/Wv2k6fT.png",
    ],
    sizes: ["P", "M", "G"],
    colors: ["Cinza", "Azul"],
  },
  {
    id: 2,
    name: "Vestido Floral Princesa",
    description: "Lindo vestido rodado com estampa floral e cinto de pérolas.",
    price: 159.9,
    category: "Vestidos",
    ageRange: "2-4 anos",
    images: [
      "https://i.imgur.com/BVO3rFJ.png",
      "https://i.imgur.com/fWaX1xG.png",
    ],
    sizes: ["P", "M"],
    colors: ["Rosa", "Branco"],
  },
  {
    id: 3,
    name: "Camiseta Básica Foguete",
    description: "Camiseta de algodão confortável com estampa de foguete.",
    price: 49.9,
    category: "Camisetas",
    ageRange: "4-6 anos",
    images: [
      "https://i.imgur.com/Wv2k6fT.png",
      "https://i.imgur.com/g82xL1A.png",
    ],
    sizes: ["M", "G"],
    colors: ["Preto", "Branco", "Vermelho"],
  },
  {
    id: 4,
    name: "Macacão Ursinho",
    description:
      "Macacão de pelúcia super macio com orelhinhas de urso no capuz.",
    price: 99.9,
    category: "Macacões",
    ageRange: "0-1 ano",
    images: [
      "https://i.imgur.com/fWaX1xG.png",
      "https://i.imgur.com/BVO3rFJ.png",
    ],
    sizes: ["RN", "P"],
    colors: ["Marrom", "Bege"],
  },
  {
    id: 5,
    name: "Tênis Led Colorido",
    description: "Tênis casual com luzes de LED na sola que piscam ao andar.",
    price: 189.9,
    category: "Calçados",
    ageRange: "2-4 anos",
    images: ["https://i.imgur.com/g82xL1A.png"],
    sizes: ["22", "23", "24"],
    colors: ["Branco"],
  },
  {
    id: 6,
    name: "Pijama de Verão",
    description: "Pijama de malha leve e fresca, perfeito para noites quentes.",
    price: 79.9,
    category: "Pijamas",
    ageRange: "4-6 anos",
    images: ["https://i.imgur.com/BVO3rFJ.png"],
    sizes: ["P", "M", "G"],
    colors: ["Amarelo", "Azul"],
  },
];

//estado da aplicação
let searchTerm = "";
let categoryFilter = "all";
let ageFilter = "all";
let currentImageIndex = 0; // Para o modal

//referências do DOM
//pega todos os elementos que vão ser manipulados
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-filter");
const ageSelect = document.getElementById("age-filter");
const productGrid = document.getElementById("product-grid");
const noResultsDiv = document.getElementById("no-results");
const modal = document.getElementById("product-modal");
const modalContent = document.getElementById("modal-content");
const toastContainer = document.getElementById("toast-container");
const activeFiltersContainer = document.getElementById(
  "active-filters-container"
);

//funções principais

//função de toast -> cria um elemento de toast e o remove após 2 segundos
function showToast(message) {
  const toast = document.createElement("div");
  toast.className =
    "bg-green-600 text-white p-3 rounded-lg shadow-lg mb-2 transition-all duration-300 toast-enter";
  toast.textContent = message;

  toastContainer.appendChild(toast);

  //animação de entrada
  requestAnimationFrame(() => {
    toast.classList.remove("toast-enter");
  });

  //remove o toast após 2 segundos
  setTimeout(() => {
    toast.classList.add("toast-exit");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, 2000);
}

//adiciona um produto ao carrinho no localStorage
function handleAddToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.product.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product: product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(`${product.name} adicionado ao carrinho!`);
}

//atualiza os filtros ativos visíveis
function renderActiveFilters() {
  activeFiltersContainer.innerHTML = ""; //limpa os filtros

  let hasFilters = false;
  let filtersHTML =
    '<span class="text-sm text-gray-600">Filtros ativos:</span>';

  if (searchTerm) {
    hasFilters = true;
    filtersHTML += `
      <span class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
        Busca: ${searchTerm}
        <button data-filter-type="search" class="filter-remove-btn">
          <i data-lucide="x" class="h-3 w-3"></i>
        </button>
      </span>`;
  }

  if (categoryFilter !== "all") {
    hasFilters = true;
    filtersHTML += `
      <span class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
        ${categoryFilter}
        <button data-filter-type="category" class="filter-remove-btn">
          <i data-lucide="x" class="h-3 w-3"></i>
        </button>
      </span>`;
  }

  if (ageFilter !== "all") {
    hasFilters = true;
    filtersHTML += `
      <span class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
        ${ageFilter}
        <button data-filter-type="age" class="filter-remove-btn">
          <i data-lucide="x" class="h-3 w-3"></i>
        </button>
      </span>`;
  }

  if (hasFilters) {
    activeFiltersContainer.innerHTML = filtersHTML;
    //adiciona os ícones do Lucide
    lucide.createIcons();
    //adiciona listeners para os botões de remover filtro
    document.querySelectorAll(".filter-remove-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const filterType = button.getAttribute("data-filter-type");
        if (filterType === "search") {
          searchTerm = "";
          searchInput.value = "";
        } else if (filterType === "category") {
          categoryFilter = "all";
          categorySelect.value = "all";
        } else if (filterType === "age") {
          ageFilter = "all";
          ageSelect.value = "all";
        }
        renderAll(); //re-renderiza tudo
      });
    });
  }
}

//renderiza os produtos na grade -> função principal de renderização
function renderProducts() {
  //1 -  filtra os produtos
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesAge = ageFilter === "all" || product.ageRange === ageFilter;

    return matchesSearch && matchesCategory && matchesAge;
  });

  //2 - limpa a grade atual
  productGrid.innerHTML = "";

  //3 - mostra ou esconde a mensagem de "Nenhum produto"
  if (filteredProducts.length === 0) {
    noResultsDiv.classList.remove("hidden");
    productGrid.classList.add("hidden");
  } else {
    noResultsDiv.classList.add("hidden");
    productGrid.classList.remove("hidden");

    // 4 - cria e adiciona cada card de produto
    filteredProducts.forEach((product) => {
      const card = document.createElement("div");
      //copiamos as classes do tailwind do jsx
      card.className =
        "overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow cursor-pointer group";

      card.innerHTML = `
        <div class="relative product-image-container">
          <img
            src="${product.images[0]}"
            alt="${product.name}"
            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span class="absolute top-3 right-3 rounded-full px-2 py-1 text-xs" style="background-color: #FFE082; color: #333;">
            ${product.category}
          </span>
        </div>
        
        <div class="p-4 space-y-3">
          <div>
            <h3 class="text-lg mb-1">${product.name}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">
              ${product.description}
            </p>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="border border-gray-300 rounded-full px-2 py-0.5 text-xs">
              ${product.ageRange}
            </span>
          </div>
          
          <div class="flex items-center justify-between pt-2">
            <span class="text-2xl" style="color: #F8BBD0;">
              R$ ${product.price.toFixed(2)}
            </span>
            <button
              class="add-to-cart-btn inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 gap-1 text-white"
              style="background-color: #F8BBD0;"
            >
              <i data-lucide="shopping-cart" class="h-4 w-4"></i>
              Adicionar
            </button>
          </div>
        </div>
      `;

      //adiciona os event listeners
      card
        .querySelector(".product-image-container")
        .addEventListener("click", () => {
          openModal(product);
        });

      card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
        e.stopPropagation(); //impede que o clique no botão abra o modal
        handleAddToCart(product);
        //aqui chama a função real de adicionar ao carrinho
      });

      productGrid.appendChild(card);
    });
  }

  //atualiza os ícones do Lucide
  lucide.createIcons();
}

//preenche os filtros <select> com opções
function populateFilters() {
  //pega valores únicos
  const categories = [
    "all",
    ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category))),
  ];
  const ageRanges = [
    "all",
    ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.ageRange))),
  ];

  //limpa e preenche categorias
  categorySelect.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat === "all" ? "Todas as Categorias" : cat;
    categorySelect.appendChild(option);
  });

  //limpa e preenche faixas etárias
  ageSelect.innerHTML = "";
  ageRanges.forEach((age) => {
    const option = document.createElement("option");
    option.value = age;
    option.textContent = age === "all" ? "Todas as Idades" : age;
    ageSelect.appendChild(option);
  });
}

/**
 * Abre o modal com os detalhes do produto
 */
function openModal(product) {
  currentImageIndex = 0; // Reseta o índice da imagem
  renderModalContent(product);
  modal.showModal(); // API nativa do <dialog>
}

/**
 * Fecha o modal
 */
function closeModal() {
  modal.close(); // API nativa do <dialog>
  modalContent.innerHTML = ""; // Limpa o conteúdo
}

//renderiza o conteúdo HTML dentro do modal
function renderModalContent(product) {
  //gera HTML para as miniaturas
  let thumbnailsHTML = "";
  if (product.images.length > 1) {
    thumbnailsHTML = `
      <div class="flex gap-2">
        ${product.images
          .map(
            (img, idx) => `
          <button
            class="thumbnail-btn relative rounded-lg overflow-hidden border-2 transition-all ${
              idx === 0 ? "border-pink-400 scale-105" : "border-gray-200"
            }"
            data-index="${idx}"
          >
            <img
              src="${img}"
              alt="${product.name} - ${idx + 1}"
              class="w-20 h-20 object-cover"
            />
          </button>
        `
          )
          .join("")}
      </div>`;
  }

  //gera HTML para os tamanhos e cores
  const sizesHTML = product.sizes
    .map(
      (size) =>
        `<span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">${size}</span>`
    )
    .join("");
  const colorsHTML = product.colors
    .map(
      (color) =>
        `<span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">${color}</span>`
    )
    .join("");

  //define o HTML do conteúdo do modal
  modalContent.innerHTML = `
    <button id="modal-close-btn" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10">
      <i data-lucide="x" class="h-6 w-6"></i>
    </button>
    
    <div class="p-6 pt-10">
      <h2 class="text-2xl font-semibold mb-2">${product.name}</h2>
      <p class="text-gray-600 mb-4">${product.description}</p>
      
      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-3">
          <div class="relative rounded-lg overflow-hidden border">
            <img
              id="modal-main-image"
              src="${product.images[currentImageIndex]}"
              alt="${product.name}"
              class="w-full h-80 object-cover"
            />
          </div>
          ${thumbnailsHTML}
        </div>
        
        <div class="space-y-4">
          <div>
            <span class="text-3xl" style="color: #F8BBD0;">
              R$ ${product.price.toFixed(2)}
            </span>
          </div>
          
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700">Categoria</h4>
            <span class="rounded-full px-2 py-1 text-xs" style="background-color: #FFE082; color: #333;">
              ${product.category}
            </span>
          </div>
          
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700">Faixa Etária</h4>
            <span class="border border-gray-300 rounded-full px-2 py-0.5 text-xs">
              ${product.ageRange}
            </span>
          </div>
          
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700">Tamanhos Disponíveis</h4>
            <div class="flex gap-2 flex-wrap">${sizesHTML}</div>
          </div>
          
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700">Cores Disponíveis</h4>
            <div class="flex gap-2 flex-wrap">${colorsHTML}</div>
          </div>
          
          <button
            id="modal-add-to-cart-btn"
            class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 gap-2 text-white"
            style="background-color: #F8BBD0;"
          >
            <i data-lucide="shopping-cart" class="h-5 w-5"></i>
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  `;

  //atualiza os ícones do Lucide
  lucide.createIcons();

  //adiciona event listeners (depois de criar o HTML)
  document
    .getElementById("modal-close-btn")
    .addEventListener("click", closeModal);

  document
    .getElementById("modal-add-to-cart-btn")
    .addEventListener("click", () => {
      handleAddToCart(product);
      closeModal();
    });

  document.querySelectorAll(".thumbnail-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const newIndex = parseInt(button.getAttribute("data-index"));
      currentImageIndex = newIndex;

      //atualiza a imagem principal
      document.getElementById("modal-main-image").src =
        product.images[newIndex];

      //atualiza o estilo dos botões
      document.querySelectorAll(".thumbnail-btn").forEach((btn, idx) => {
        if (idx === newIndex) {
          btn.classList.add("border-pink-400", "scale-105");
          btn.classList.remove("border-gray-200");
        } else {
          btn.classList.remove("border-pink-400", "scale-105");
          btn.classList.add("border-gray-200");
        }
      });
    });
  });
}

//função helper pra renderizar tudo
function renderAll() {
  renderProducts();
  renderActiveFilters();
}

//inicialização -> oq acontece quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  populateFilters(); //1 - preenche os filtros <select>

  renderProducts(); //2 - renderiza os produtos iniciais

  lucide.createIcons(); //3 - renderiza os ícones

  //4 - adiciona os listeners de filtro
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderAll();
  });

  categorySelect.addEventListener("change", (e) => {
    categoryFilter = e.target.value;
    renderAll();
  });

  ageSelect.addEventListener("change", (e) => {
    ageFilter = e.target.value;
    renderAll();
  });

  //5 - adiciona listener para fechar o modal clicando fora (no backdrop)
  modal.addEventListener("click", (e) => {
    //o clique só é no backdrop se o target for o próprio dialog
    if (e.target === modal) {
      closeModal();
    }
  });
});
