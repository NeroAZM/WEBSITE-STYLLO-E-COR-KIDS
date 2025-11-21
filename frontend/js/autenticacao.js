/**
 * Verifica se o usuario tem a "credencial" salva.
 * Se não tiver, expulsa para o login.
 */
(function () {
  const isAdministrador = localStorage.getItem("isAdmin");

  if (isAdministrador !== "true") {
    alert("Acesso restrito! Por favor, faça login.");
    window.location.href = "login.html";
  }
})();

function fazerLogout() {
  localStorage.removeItem("isAdmin");
  window.location.href = "login.html";
}
