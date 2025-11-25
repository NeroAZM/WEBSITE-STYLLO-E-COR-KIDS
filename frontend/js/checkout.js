document.addEventListener("DOMContentLoaded", () => {
  const summaryItemsContainer = document.getElementById(
    "summary-items-container"
  );
  const summaryTotal = document.getElementById("summary-total");
  const checkoutForm = document.getElementById("checkout-form");
  const nomeInput = document.getElementById("nome");
  const telefoneInput = document.getElementById("telefone");
  const toastContainer = document.getElementById("toast-container");

  const whatsappNumber = "5547996953919";

  telefoneInput.addEventListener("input", (e) => {
<<<<<<< HEAD
    let value = e.target.value.replace(/\D/g, "");
=======
    let value = e.target.value.replace(/\D/g, ""); 
>>>>>>> a33c047b84831b27ee1a61a65398595924278e77

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})/, "($1) $2-");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})/, "($1) ");
    }
<<<<<<< HEAD

=======
    
>>>>>>> a33c047b84831b27ee1a61a65398595924278e77
    e.target.value = value;
  });

  function loadSummary() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      return;
    }

    summaryItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      const product = item.product;
      const quantity = item.quantity;
      const subtotal = product.price * quantity;
      total += subtotal;

      summaryItemsContainer.innerHTML += `
        <div class="flex justify-between text-sm text-gray-600">
          <span>${product.name} x${quantity}</span>
          <span class="font-medium">R$ ${subtotal.toFixed(2)}</span>
        </div>
      `;
    });

    summaryTotal.textContent = `R$ ${total.toFixed(2)}`;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();

    if (!nome || !telefone) {
      showToast("Por favor, preencha todos os campos.", "error");
      return;
    }

    if (telefone.length < 14) {
<<<<<<< HEAD
      showToast("Por favor, insira um telefone válido com DDD.", "error");
      return;
=======
       showToast("Por favor, insira um telefone válido com DDD.", "error");
       return;
>>>>>>> a33c047b84831b27ee1a61a65398595924278e77
    }

    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart || cart.length === 0) {
      showToast("Seu carrinho está vazio!", "error");
      return;
    }

    const agora = new Date();
<<<<<<< HEAD
    const dataFormatada = agora.toLocaleDateString("pt-BR");
    const horaFormatada = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
=======
    const dataFormatada = agora.toLocaleDateString('pt-BR');
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
>>>>>>> a33c047b84831b27ee1a61a65398595924278e77

    let total = 0;
    let pedidoTexto = "Olá! Gostaria de fazer o seguinte pedido:\n\n";

    cart.forEach((item) => {
      const subtotal = item.product.price * item.quantity;
      pedidoTexto += `*${item.quantity}x* ${
        item.product.name
      } - R$ ${subtotal.toFixed(2)}\n`;
      total += subtotal;
    });

    pedidoTexto += `\n*Total: R$ ${total.toFixed(2)}*\n`;
<<<<<<< HEAD
    pedidoTexto += `--------------------------\n`;
=======
    pedidoTexto += `--------------------------\n`; 
>>>>>>> a33c047b84831b27ee1a61a65398595924278e77
    pedidoTexto += `*Data do Pedido:* ${dataFormatada} às ${horaFormatada}\n`;
    pedidoTexto += `*Cliente:* ${nome}\n`;
    pedidoTexto += `*Contato:* ${telefone}`;

    const encodedMessage = encodeURIComponent(pedidoTexto);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    localStorage.removeItem("cart");

    window.location.href = whatsappURL;
  }

  function showToast(message, type = "error") {
    const toast = document.createElement("div");
    toast.className = `
      p-3 rounded-lg shadow-lg mb-2 
      transition-all duration-300 
      toast-enter 
      text-white
    `.trim();
    toast.textContent = message;

    if (type === "success") {
      toast.classList.add("bg-green-600");
    } else {
      toast.classList.add("bg-red-600");
    }

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove("toast-enter");
    });
    setTimeout(() => {
      toast.classList.add("toast-exit");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3000);
  }

  loadSummary();
  checkoutForm.addEventListener("submit", handleSubmit);

  lucide.createIcons();
<<<<<<< HEAD
});
=======
});
>>>>>>> a33c047b84831b27ee1a61a65398595924278e77
