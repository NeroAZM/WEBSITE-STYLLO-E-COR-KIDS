// js/login.js

// Função de toast (com criação automática do container se não existir)
export function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  
  // Se não existir no HTML, cria dinamicamente para evitar erros
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

  // Cores baseadas no tipo
  if (type === "success") {
    toast.classList.add("bg-green-600");
  } else if (type === "error") {
    toast.classList.add("bg-red-600");
  } else {
    toast.classList.add("bg-blue-600");
  }

  toastContainer.appendChild(toast);

  // Animação de entrada
  requestAnimationFrame(() => {
    toast.classList.remove("toast-enter");
  });

  // Remove após 3 segundos
  setTimeout(() => {
    toast.classList.add("toast-exit");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, 3000);
}

// Simulação de login
function mockOnLogin(username, password) {
  return username === "admin" && password === "admin123";
}

// Navegação
function navigateTo(page) {
  if (page === "home") {
    window.location.href = "index.html";
  } else if (page === "admin") {
    window.location.href = "admin.html";
  } else {
    console.warn(`Navegação para a página "${page}" não está implementada.`);
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa ícones se a biblioteca estiver carregada
  if (window.lucide) {
    lucide.createIcons();
  }

  // --- CORREÇÃO AQUI ---
  // Agora busca pelo ID "loginForm" (igual ao seu HTML) e não "login-form"
  const loginForm = document.getElementById("loginForm"); 
  
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const backButton = document.getElementById("back-button");
  const forgotPasswordButton = document.getElementById("forgot-password-button");

  // Botão voltar
  if (backButton) {
    backButton.addEventListener("click", (e) => {
        e.preventDefault(); // Previne comportamento padrão se for botão dentro de form
        navigateTo("home");
    });
  }

  // Esqueceu a senha
  if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener("click", () => {
      showToast("Entre em contato com o suporte", "info");
    });
  }

  // Submit do formulário
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        showToast("Por favor, preencha todos os campos", "error");
        return;
      }

      const success = mockOnLogin(username, password);

      if (success) {
        showToast("Login realizado com sucesso!", "success");
        localStorage.setItem("isAdmin", "true");
        
        usernameInput.value = "";
        passwordInput.value = "";

        setTimeout(() => {
          navigateTo("admin");
        }, 1500);
      } else {
        showToast("Usuário ou senha incorretos", "error");
      }
    });
  } else {
    console.error("ERRO: Formulário 'loginForm' não encontrado no HTML.");
  }
});