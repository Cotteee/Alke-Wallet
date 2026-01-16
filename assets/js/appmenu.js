// ===============================
// FUNCIONES UTILES
// ===============================

// Formatear dinero sin .00 si es entero
function formatearSaldo(valor) {
  return Number(valor).toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

// ===============================
// INICIALIZAR SALDOS
// ===============================
let saldoActual = parseFloat(localStorage.getItem("saldo"));
let totalDepositado = parseFloat(localStorage.getItem("totalDepositado"));
let totalEnviado = parseFloat(localStorage.getItem("totalEnviado"));

// Solo inicializamos si no existen
if (isNaN(saldoActual)) saldoActual = 600000;
if (isNaN(totalDepositado)) totalDepositado = 0;
if (isNaN(totalEnviado)) totalEnviado = 0;

// Guardar en localStorage si es la primera vez
localStorage.setItem("saldo", saldoActual);
localStorage.setItem("totalDepositado", totalDepositado);
localStorage.setItem("totalEnviado", totalEnviado);

// ===============================
// CAPTURAR ELEMENTOS DEL DOM
// ===============================
const mensajeFinal = document.getElementById("mensajeFinal");

const btnDepositar = document.getElementById("btnDepositar");
const btnEnviar = document.getElementById("btnEnviar");
const btnMovimientos = document.getElementById("btnMovimientos");

const navDepositar = document.getElementById("navDepositar");
const navEnviar = document.getElementById("navEnviar");
const navMovimientos = document.getElementById("navMovimientos");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

// Elementos de saldo en menú, navbar y cards
const saldoMenu = document.getElementById("saldoMenu");
const saldoNav = document.getElementById("saldoNav");
const cardSaldo = document.getElementById("cardSaldo");
const cardDepositado = document.getElementById("cardDepositado");
const cardEnviado = document.getElementById("cardEnviado");

// ===============================
// FUNCIONES PRINCIPALES
// ===============================
function actualizarSaldos() {
  // Leer los valores más recientes de localStorage
  saldoActual = parseFloat(localStorage.getItem("saldo")) || 0;
  totalDepositado = parseFloat(localStorage.getItem("totalDepositado")) || 0;
  totalEnviado = parseFloat(localStorage.getItem("totalEnviado")) || 0;

  if (saldoMenu) saldoMenu.textContent = formatearSaldo(saldoActual);
  if (saldoNav) saldoNav.textContent = formatearSaldo(saldoActual);
  if (cardSaldo) cardSaldo.textContent = formatearSaldo(saldoActual);
  if (cardDepositado) cardDepositado.textContent = formatearSaldo(totalDepositado);
  if (cardEnviado) cardEnviado.textContent = formatearSaldo(totalEnviado);
}

function mostrarMensajeRedireccion(mensaje, url, delay = 500) {
  if (mensajeFinal) mensajeFinal.textContent = mensaje;
  setTimeout(() => window.location.href = url, delay);
}

// ===============================
// EVENTOS BOTONES MENÚ PRINCIPAL
// ===============================
if (btnDepositar) {
  btnDepositar.addEventListener("click", () => {
    mostrarMensajeRedireccion("Redirigiendo a Depósitos ⏳", "deposit.html");
  });
}

if (btnEnviar) {
  btnEnviar.addEventListener("click", () => {
    mostrarMensajeRedireccion("Redirigiendo a Enviar Dinero ⏳", "sendmoney.html");
  });
}

if (btnMovimientos) {
  btnMovimientos.addEventListener("click", () => {
    mostrarMensajeRedireccion("Redirigiendo a Últimos Movimientos ⏳", "transactions.html");
  });
}

// ===============================
// EVENTOS BOTONES NAVBAR
// ===============================
if (navDepositar) {
  navDepositar.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "deposit.html";
  });
}

if (navEnviar) {
  navEnviar.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "sendmoney.html";
  });
}

if (navMovimientos) {
  navMovimientos.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "transactions.html";
  });
}

// ===============================
// CERRAR SESIÓN
// ===============================
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", (e) => {
    e.preventDefault();
    // Solo redirigir al login, no borramos saldo ni movimientos
    window.location.href = "login.html";
  });
}

// ===============================
// ACTUALIZAR SALDOS AL CARGAR PÁGINA
// ===============================
document.addEventListener("DOMContentLoaded", actualizarSaldos);
