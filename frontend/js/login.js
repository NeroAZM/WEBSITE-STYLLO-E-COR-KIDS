// js/login.js

// --- ADAPTAÇÃO NETLIFY ---
// Usamos o caminho relativo. O Netlify (via netlify.toml) vai redirecionar isso para o backend.
const API_URL = "/api/login"; 

// Função de toast
export function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed top-5 right-5 z-50 space-y-2";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `
    p-3 rounded-lg shadow-lg mb-2 
    transition-all duration-300 
    toast-enter 
    text-white
  `.trim();

  toast.textContent = message;

  if (type === "success") toast.classList.add("bg-green-600");
  else if (type === "error") toast.classList.add("bg-red-600");
  else toast.classList.add("bg-blue-600");

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.remove("toast-enter"));

  setTimeout(() => {
    toast.classList.add("toast-exit");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 3000);
}

// Navegação
function navigateTo(page) {
  if (page === "home") window.location.href = "index.html";
  else if (page === "admin") window.location.href = "admin.html";
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const backButton = document.getElementById("back-button");
  const forgotPasswordButton = document.getElementById("forgot-password-button");

  // Botão voltar
  if (backButton) {
    backButton.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo("home");
    });
  }

  // Esqueceu a senha
  if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener("click", () => {
      showToast("Entre em contato com o suporte técnico", "info");
    });
  }

  // Lógica de Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        showToast("Por favor, preencha todos os campos", "error");
        return;
      }

      const btnSubmit = loginForm.querySelector("button[type='submit']");
      const textoOriginal = btnSubmit.innerHTML;
      btnSubmit.innerHTML = "Entrando...";
      btnSubmit.disabled = true;

      try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            showToast("Login realizado com sucesso!", "success");
            
            // sessionStorage mantém o login só até fechar o navegador
            sessionStorage.setItem("tokenUsuario", data.token);
            
            usernameInput.value = "";
            passwordInput.value = "";

            setTimeout(() => {
                navigateTo("admin");
            }, 1000);

        } else {
            showToast(data.message || "Usuário ou senha incorretos", "error");
        }

      } catch (error) {
          console.error("Erro de conexão:", error);
          showToast("Erro ao conectar com o servidor.", "error");
      } finally {
          btnSubmit.innerHTML = textoOriginal;
          btnSubmit.disabled = false;
      }
    });
  } else {
    console.error("ERRO: Formulário 'loginForm' não encontrado no HTML.");
  }
});
