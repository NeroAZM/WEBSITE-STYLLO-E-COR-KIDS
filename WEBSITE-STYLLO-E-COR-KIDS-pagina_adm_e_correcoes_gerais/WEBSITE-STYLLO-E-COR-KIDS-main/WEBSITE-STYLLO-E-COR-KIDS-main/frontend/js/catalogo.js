/**
 * Busca produtos do MongoDB e gerencia a exibição e filtros.
 */

const API_URL = 'http://localhost:3000/api/produtos';
let allProducts = [];

// Referências do DOM
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-filter");
const ageSelect = document.getElementById("age-filter");
const productGrid = document.getElementById("product-grid");
const noResultsDiv = document.getElementById("no-results");
const modal = document.getElementById("product-modal");
const modalContent = document.getElementById("modal-content");
const toastContainer = document.getElementById("toast-container");
const activeFiltersContainer = document.getElementById("active-filters-container");

// Estado dos filtros
let searchTerm = "";
let categoryFilter = "all";
let ageFilter = "all";
let currentImageIndex = 0;

// BUSCAR DADOS DA API ---
async function fetchProducts() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        allProducts = data.map(produto => ({
            ...produto,
            id: produto._id,
            images: Array.isArray(produto.images) ? produto.images : [produto.images]
        }));

        populateFilters();
        renderAll();

    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        productGrid.innerHTML = `<p class="col-span-full text-center text-red-500">Erro ao carregar catálogo. Verifique se o servidor está rodando.</p>`;
    }
}

// RENDERIZAÇÃO ---

function renderProducts() {
    const filteredProducts = allProducts.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" || product.category === categoryFilter;
        const matchesAge = ageFilter === "all" || product.ageRange === ageFilter;

        return matchesSearch && matchesCategory && matchesAge;
    });

    productGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        noResultsDiv.classList.remove("hidden");
        productGrid.classList.add("hidden");
    } else {
        noResultsDiv.classList.add("hidden");
        productGrid.classList.remove("hidden");

        filteredProducts.forEach((product) => {
            const card = document.createElement("div");
            card.className = "overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow cursor-pointer group h-full flex flex-col";

            // Fallback de imagem
            const imgSrc = product.images.length > 0 ? product.images[0] : 'https://placehold.co/300?text=Sem+Foto';

            card.innerHTML = `
                <div class="relative product-image-container h-64 overflow-hidden">
                  <img
                    src="${imgSrc}"
                    alt="${product.name}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span class="absolute top-3 right-3 rounded-full px-2 py-1 text-xs font-medium shadow-sm" style="background-color: #FFE082; color: #333;">
                    ${product.category}
                  </span>
                </div>
                
                <div class="p-4 space-y-3 flex flex-col flex-grow">
                  <div class="flex-grow">
                    <h3 class="text-lg font-semibold mb-1 leading-tight">${product.name}</h3>
                    <p class="text-sm text-gray-600 line-clamp-2">${product.description}</p>
                  </div>
                  
                  <div class="flex items-center gap-2 mt-2">
                    <span class="border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-600">
                      ${product.ageRange}
                    </span>
                  </div>
                  
                  <div class="flex items-center justify-between pt-3 mt-auto border-t">
                    <span class="text-xl font-bold" style="color: #e4405f;">
                      R$ ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <button class="add-to-cart-btn inline-flex items-center justify-center rounded-lg text-sm font-medium h-9 px-3 gap-1 text-white transition-opacity hover:opacity-90"
                      style="background-color: #f8bbd0; color: #444;">
                      <i data-lucide="shopping-cart" class="h-4 w-4"></i>
                      Adicionar
                    </button>
                  </div>
                </div>
            `;

            // Event Listeners
            card.querySelector(".product-image-container").addEventListener("click", () => openModal(product));
            card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                handleAddToCart(product);
            });

            productGrid.appendChild(card);
        });
    }
    lucide.createIcons();
}

// FILTROS ---

function populateFilters() {
    // Categorias Únicas
    const categories = ["all", ...new Set(allProducts.map((p) => p.category))];
    categorySelect.innerHTML = "";
    categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat === "all" ? "Todas as Categorias" : cat;
        categorySelect.appendChild(option);
    });

    // Faixas Etárias Únicas
    const ageRanges = ["all", ...new Set(allProducts.map((p) => p.ageRange))];
    ageSelect.innerHTML = "";
    ageRanges.forEach((age) => {
        const option = document.createElement("option");
        option.value = age;
        option.textContent = age === "all" ? "Todas as Idades" : age;
        ageSelect.appendChild(option);
    });
}

function renderActiveFilters() {
    activeFiltersContainer.innerHTML = "";
    let hasFilters = false;
    let filtersHTML = '<span class="text-sm text-gray-600 mr-2">Filtros ativos:</span>';

    const createBadge = (text, type) => `
        <span class="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700 border border-pink-100">
            ${text}
            <button data-filter-type="${type}" class="filter-remove-btn ml-1 hover:text-pink-900">
                <i data-lucide="x" class="h-3 w-3"></i>
            </button>
        </span>
    `;

    if (searchTerm) {
        hasFilters = true;
        filtersHTML += createBadge(`Busca: ${searchTerm}`, "search");
    }
    if (categoryFilter !== "all") {
        hasFilters = true;
        filtersHTML += createBadge(categoryFilter, "category");
    }
    if (ageFilter !== "all") {
        hasFilters = true;
        filtersHTML += createBadge(ageFilter, "age");
    }

    if (hasFilters) {
        activeFiltersContainer.innerHTML = filtersHTML;
        lucide.createIcons();
        
        document.querySelectorAll(".filter-remove-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const type = button.dataset.filterType;
                if (type === "search") { searchTerm = ""; searchInput.value = ""; }
                if (type === "category") { categoryFilter = "all"; categorySelect.value = "all"; }
                if (type === "age") { ageFilter = "all"; ageSelect.value = "all"; }
                renderAll();
            });
        });
    }
}

// MODAL ---

function openModal(product) {
    currentImageIndex = 0;
    renderModalContent(product);
    modal.showModal();
}

function closeModal() {
    modal.close();
    modalContent.innerHTML = "";
}

function renderModalContent(product) {
    // Como adaptamos o dado para sempre ser array no inicio, isso continua funcionando
    const mainImage = product.images.length > 0 ? product.images[0] : 'https://placehold.co/400';
    
    modalContent.innerHTML = `
        <button id="modal-close-btn" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 shadow-sm">
            <i data-lucide="x" class="h-6 w-6"></i>
        </button>
        
        <div class="p-6 md:p-8">
            <div class="grid gap-8 md:grid-cols-2">
                <div class="space-y-4">
                    <div class="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square">
                        <img id="modal-main-image" src="${mainImage}" alt="${product.name}" class="w-full h-full object-cover" />
                    </div>
                </div>
                
                <div class="space-y-6">
                    <div>
                        <span class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-3">
                            ${product.category}
                        </span>
                        <h2 class="text-3xl font-bold text-gray-800 mb-2 leading-tight">${product.name}</h2>
                        <p class="text-gray-600 leading-relaxed">${product.description}</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Faixa Etária</h4>
                            <span class="inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm font-medium">
                                ${product.ageRange}
                            </span>
                        </div>
                        <div>
                            <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tamanhos</h4>
                            <span class="text-gray-700 text-sm">${product.sizes || "Único"}</span>
                        </div>
                    </div>
                    
                    <div class="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm text-gray-500">Preço</span>
                            <span class="text-3xl font-bold" style="color: #e4405f;">R$ ${parseFloat(product.price).toFixed(2)}</span>
                        </div>
                        
                        <button id="modal-add-to-cart-btn" class="btn-pink px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                            <i data-lucide="shopping-bag" class="h-5 w-5"></i>
                            Adicionar à Sacola
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    lucide.createIcons();

    document.getElementById("modal-close-btn").addEventListener("click", closeModal);
    document.getElementById("modal-add-to-cart-btn").addEventListener("click", () => {
        handleAddToCart(product);
        closeModal();
    });
}

// CARRINHO E UTILITÁRIOS ---

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl mb-3 transition-all duration-300 toast-enter flex items-center gap-2";
    toast.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i> ${message}`;
    toastContainer.appendChild(toast);
    lucide.createIcons();

    requestAnimationFrame(() => toast.classList.remove("toast-enter"));
    setTimeout(() => {
        toast.classList.add("toast-exit");
        toast.addEventListener("transitionend", () => toast.remove());
    }, 3000);
}

function handleAddToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Usa 'id' (que é o _id mapeado) para comparação
    const existingItem = cart.find((item) => item.product.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product: product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(`${product.name} adicionado!`);
}

function renderAll() {
    renderProducts();
    renderActiveFilters();
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    // Configura Listeners
    searchInput.addEventListener("input", (e) => { searchTerm = e.target.value; renderAll(); });
    categorySelect.addEventListener("change", (e) => { categoryFilter = e.target.value; renderAll(); });
    ageSelect.addEventListener("change", (e) => { ageFilter = e.target.value; renderAll(); });
    
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => { if (link.classList.contains("active")) e.preventDefault(); });
    });

    // Carrega dados
    fetchProducts();
});