// FUNCIÓN PARA FORMATEAR DINERO y no salga .00
function formatearSaldo(valor) {
  return Number(valor).toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

// Capturar elementos del DOM
const mensajeFinal = document.getElementById("mensajeFinal");

const btnDepositar = document.getElementById("btnDepositar");
const btnEnviar = document.getElementById("btnEnviar");
const btnMovimientos = document.getElementById("btnMovimientos");

// Uso de botones del menú principal
if (btnDepositar) {
  btnDepositar.addEventListener("click", () => {
    mensajeFinal.textContent = "Redirigiendo a Depósitos⏳";
    setTimeout(() => {
      window.location.href = "deposit.html";
    }, 500);
  });
}

if (btnEnviar) {
  btnEnviar.addEventListener("click", () => {
    mensajeFinal.textContent = "Redirigiendo a Enviar Dinero⏳";
    setTimeout(() => {
      window.location.href = "sendmoney.html";
    }, 500);
  });
}

if (btnMovimientos) {
  btnMovimientos.addEventListener("click", () => {
    mensajeFinal.textContent = "Redirigiendo a Últimos Movimientos⏳";
    setTimeout(() => {
      window.location.href = "transactions.html";
    }, 500);
  });
}

// BOTONES DE LA NAVBAR
const navDepositar = document.getElementById("navDepositar");
const navEnviar = document.getElementById("navEnviar");
const navMovimientos = document.getElementById("navMovimientos");

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
// BOTÓN CERRAR SESIÓN
// ===============================
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", e => {
    e.preventDefault();
    // Solo redirigir al login, sin borrar datos
    window.location.href = "login.html";
  });
}

// ===============================
// SALDOS Actualizados (MENÚ, NAVBAR Y CARDS)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const saldo = parseFloat(localStorage.getItem("saldo")) || 6000000;
  const totalDepositado = parseFloat(localStorage.getItem("totalDepositado")) || 0;
  const totalEnviado = parseFloat(localStorage.getItem("totalEnviado")) || 0;

  const saldoMenu = document.getElementById("saldoMenu");
  const saldoNav = document.getElementById("saldoNav");
  const cardSaldo = document.getElementById("cardSaldo");
  const cardDepositado = document.getElementById("cardDepositado");
  const cardEnviado = document.getElementById("cardEnviado");

  if (saldoMenu) saldoMenu.textContent = formatearSaldo(saldo);
  if (saldoNav) saldoNav.textContent = formatearSaldo(saldo);
  if (cardSaldo) cardSaldo.textContent = formatearSaldo(saldo);

  if (cardDepositado) cardDepositado.textContent = formatearSaldo(totalDepositado);
  if (cardEnviado) cardEnviado.textContent = formatearSaldo(totalEnviado);
});
