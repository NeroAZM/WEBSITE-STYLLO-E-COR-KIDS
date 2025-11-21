document.addEventListener("DOMContentLoaded", () => {
  const cartEmptyState = document.getElementById("cart-empty-state");
  const cartFullState = document.getElementById("cart-full-state");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartItemCount = document.getElementById("cart-item-count");
  const summaryItemsContainer = document.getElementById("summary-items-container");
  const summaryTotal = document.getElementById("summary-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

      const imageSrc = Array.isArray(product.images) ? product.images[0] : product.images;

      cartItemsContainer.innerHTML += `
        <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <img
            src="${imageSrc || 'https://placehold.co/100'}"
            alt="${product.name}"
            class="w-24 h-24 object-cover rounded-lg border border-gray-100"
          />
          <div class="flex-grow">
            <h5 class="text-lg font-semibold text-gray-800">${product.name}</h5>
            <p class="text-sm text-gray-500 mb-1">${product.category}</p>
            <p class="text-pink text-lg font-bold">R$ ${parseFloat(product.price).toFixed(2)}</p>
          </div>
          
          <div class="flex flex-col items-end gap-3">
              <div class="flex items-center gap-3 border rounded-lg px-2 py-1 bg-gray-50">
                <button class="qty-btn hover:text-pink-600" data-id="${product.id}" data-op="-1">
                  <i data-lucide="minus" class="h-4 w-4"></i>
                </button>
                <span class="w-6 text-center font-medium">${quantity}</span>
                <button class="qty-btn hover:text-pink-600" data-id="${product.id}" data-op="1">
                  <i data-lucide="plus" class="h-4 w-4"></i>
                </button>
              </div>
              
              <button class="remove-btn text-gray-400 hover:text-red-500 transition-colors p-1" data-id="${product.id}">
                <i data-lucide="trash-2" class="h-5 w-5"></i>
              </button>
          </div>
        </div>
      `;

      summaryItemsContainer.innerHTML += `
        <div class="flex justify-between text-sm text-gray-600">
          <span>${product.name} <span class="text-xs text-gray-400">x${quantity}</span></span>
          <span class="font-medium">R$ ${subtotal.toFixed(2)}</span>
        </div>
      `;
    });

    summaryTotal.textContent = `R$ ${total.toFixed(2)}`;
    cartItemCount.textContent = `Você tem ${totalItems} ${totalItems === 1 ? "item" : "itens"} no carrinho`;

    lucide.createIcons();
    addEventListeners();
  }

  function addEventListeners() {
    // Remover
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id; // NÃO usar parseInt, pois ID é string no Mongo
        cart = cart.filter((item) => item.product.id !== id);
        saveAndUpdate();
      });
    });

    // Quantidade
    document.querySelectorAll(".qty-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id; // NÃO usar parseInt
        const op = parseInt(button.dataset.op);
        const item = cart.find((i) => i.product.id === id);

        if (item) {
          item.quantity += op;
          if (item.quantity <= 0) {
            cart = cart.filter((i) => i.product.id !== id);
          }
        }
        saveAndUpdate();
      });
    });
  }

  function saveAndUpdate() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateDisplay();
  }

  // Inicializa
  updateDisplay();
});