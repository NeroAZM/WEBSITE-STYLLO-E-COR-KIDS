document.addEventListener("DOMContentLoaded", () => {
  const cartEmptyState = document.getElementById("cart-empty-state");
  const cartFullState = document.getElementById("cart-full-state");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartItemCount = document.getElementById("cart-item-count");
  const summaryItemsContainer = document.getElementById("summary-items-container");
  const summaryTotal = document.getElementById("summary-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartEmptyState.classList.remove("hidden");
    cartFullState.classList.add("hidden");
  } else {
    cartEmptyState.classList.add("hidden");
    cartFullState.classList.remove("hidden");
    renderCart();
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

      cartItemsContainer.innerHTML += `
        <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <img
            src="${product.images[0]}"
            alt="${product.name}"
            class="w-24 h-24 object-cover rounded-lg"
          />
          <div class="flex-grow">
            <h5 class="text-lg font-semibold">${product.name}</h5>
            <p class="text-pink text-lg font-medium">R$ ${product.price.toFixed(
              2
            )}</p>
          </div>
          <div class="flex items-center gap-2 border rounded-md p-1">
            <button class="qty-btn" data-id="${product.id}" data-op="-1">
              <i data-lucide="minus" class="h-4 w-4"></i>
            </button>
            <span class="w-8 text-center">${quantity}</span>
            <button class="qty-btn" data-id="${product.id}" data-op="1">
              <i data-lucide="plus" class="h-4 w-4"></i>
            </button>
          </div>
          <button class="remove-btn text-red-500 hover:text-red-700" data-id="${
            product.id
          }">
            <i data-lucide="trash-2" class="h-5 w-5"></i>
          </button>
        </div>
      `;

      summaryItemsContainer.innerHTML += `
        <div class="flex justify-between text-sm text-gray-600">
          <span>${product.name} x${quantity}</span>
          <span class="font-medium">R$ ${subtotal.toFixed(2)}</span>
        </div>
      `;
    });

    summaryTotal.textContent = `R$ ${total.toFixed(2)}`;
    cartItemCount.textContent = `Você tem ${totalItems} ${
      totalItems === 1 ? "item" : "itens"
    } no carrinho`;

    lucide.createIcons();

    addEventListeners();
  }

  function addEventListeners() {
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = parseInt(button.dataset.id);
        cart = cart.filter((item) => item.product.id !== id);
        updateCart();
      });
    });

    document.querySelectorAll(".qty-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = parseInt(button.dataset.id);
        const op = parseInt(button.dataset.op);
        const item = cart.find((i) => i.product.id === id);

        if (item) {
          item.quantity += op;
          if (item.quantity === 0) {
            cart = cart.filter((i) => i.product.id !== id);
          }
        }
        updateCart();
      });
    });
  }

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length === 0) {
      cartEmptyState.classList.remove("hidden");
      cartFullState.classList.add("hidden");
    } else {
      renderCart();
    }
  }
});