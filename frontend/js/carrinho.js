/**
 * Script responsável por exibir, atualizar e gerenciar 
 * os itens do carrinho de compras da loja.
 */

document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTOS DO DOM
  const cartEmptyState = document.getElementById("cart-empty-state");
  const cartFullState = document.getElementById("cart-full-state");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartItemCount = document.getElementById("cart-item-count");
  const summaryItemsContainer = document.getElementById("summary-items-container");
  const summaryTotal = document.getElementById("summary-total");

  // Carrega carrinho salvo no navegador
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  /**
   * Exibe o estado correto da página:
   * - Se o carrinho estiver vazio, mostra mensagem de vazio
   * - Caso tenha itens, mostra a lista renderizada
   */
  function updateDisplay() {
    if (cart.length === 0) {
      cartEmptyState.classList.remove("hidden");
      cartFullState.classList.add("hidden");
    } else {
      cartEmptyState.classList.add("hidden");
      cartFullState.classList.remove("hidden");
      renderCart();
    }
  }

  /**
   * Renderiza todos os itens do carrinho:
   * - Lista completa
   * - Resumo lateral
   * - Total acumulado
   */
  function renderCart() {
    cartItemsContainer.innerHTML = "";
    summaryItemsContainer.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    cart.forEach((item) => {
      const product = item.product;
      const quantity = item.quantity;
      const subtotal = product.price * quantity;

      total += subtotal;
      totalItems += quantity;

      // Suporte a produtos com uma ou várias imagens
      const imageSrc = Array.isArray(product.images)
        ? product.images[0]
        : product.images;

      // Card do item no carrinho
      cartItemsContainer.innerHTML += `
        <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <img
            src="${imageSrc || "https://placehold.co/100"}"
            alt="${product.name}"
            class="w-24 h-24 object-cover rounded-lg border border-gray-100"
          />

          <div class="flex-grow">
            <h5 class="text-lg font-semibold text-gray-800">${product.name}</h5>
            <p class="text-sm text-gray-500 mb-1">${product.category}</p>
            <p class="text-pink text-lg font-bold">R$ ${parseFloat(product.price).toFixed(2)}</p>
          </div>

          <div class="flex flex-col items-end gap-3">

            <!-- Controle de quantidade -->
            <div class="flex items-center gap-3 border rounded-lg px-2 py-1 bg-gray-50">
              <button class="qty-btn hover:text-pink-600" data-id="${product.id}" data-op="-1">
                <i data-lucide="minus" class="h-4 w-4"></i>
              </button>

              <span class="w-6 text-center font-medium">${quantity}</span>

              <button class="qty-btn hover:text-pink-600" data-id="${product.id}" data-op="1">
                <i data-lucide="plus" class="h-4 w-4"></i>
              </button>
            </div>

            <!-- Remover item -->
            <button class="remove-btn text-gray-400 hover:text-red-500 transition-colors p-1" data-id="${product.id}">
              <i data-lucide="trash-2" class="h-5 w-5"></i>
            </button>

          </div>
        </div>
      `;

      // Item no resumo (lado direito)
      summaryItemsContainer.innerHTML += `
        <div class="flex justify-between text-sm text-gray-600">
          <span>${product.name} <span class="text-xs text-gray-400">x${quantity}</span></span>
          <span class="font-medium">R$ ${subtotal.toFixed(2)}</span>
        </div>
      `;
    });

    // Atualiza total e quantidade
    summaryTotal.textContent = `R$ ${total.toFixed(2)}`;
    cartItemCount.textContent = `Você tem ${totalItems} ${totalItems === 1 ? "item" : "itens"} no carrinho`;

    // Recarrega os ícones do Lucide
    lucide.createIcons();

    // Adiciona eventos nos botões recém-renderizados
    addEventListeners();
  }

  /**
   * Adiciona eventos aos botões:
   * - Remover item
   * - Incrementar / decrementar quantidade
   */
  function addEventListeners() {

    // Remover item do carrinho
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        cart = cart.filter((item) => item.product.id !== id);
        saveAndUpdate();
      });
    });

    // Alterar quantidade do item
    document.querySelectorAll(".qty-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        const op = parseInt(button.dataset.op);
        const item = cart.find((i) => i.product.id === id);

        if (item) {
          item.quantity += op;

          // Se a quantidade ficar zero remove o item
          if (item.quantity <= 0) {
            cart = cart.filter((i) => i.product.id !== id);
          }
        }

        saveAndUpdate();
      });
    });
  }

  // Salva o carrinho no localStorage e atualiza o display.
  function saveAndUpdate() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateDisplay();
  }

  // Inicialização
  updateDisplay();
});
