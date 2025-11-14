//função de toast
export function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toast-container");
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
  } else if (type === "error") {
    toast.classList.add("bg-red-600");
  } else {
    toast.classList.add("bg-blue-600");
  }

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("toast-enter");
  });

  setTimeout(() => {
    toast.classList.add("toast-exit");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, 3000);
}

//função de simulação de login
function mockOnLogin(username, password) {
  return username === "admin" && password === "admin123";
}

function mockOnNavigate(page) {
  alert(`Simulando navegação para a página: ${page}`);
}

//inicialização
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons(); //1 - ativa os ícones do Lucide

  //2 - referências
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const backButton = document.getElementById("back-button");
  const forgotPasswordButton = document.getElementById(
    "forgot-password-button"
  );

  //botão voltar
  if (backButton) {
    backButton.addEventListener("click", () => {
      mockOnNavigate("home");
    });
  }

  //esqueceu a senha
  if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener("click", () => {
      showToast("Entre em contato com o suporte", "info");
    });
  }

  //submit do form
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
        mockOnNavigate("admin");
      }, 2000);
    } else {
      showToast("Usuário ou senha incorretos", "error");
    }
  });

  //links do header (simulação)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const pageName = e.currentTarget.textContent.trim();
      if (pageName !== "Login") {
        e.preventDefault();
        mockOnNavigate(pageName);
      }
    });
  });
});
