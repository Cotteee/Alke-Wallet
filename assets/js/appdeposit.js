$(function () {

  // ==========================
  // ELEMENTOS
  // ==========================
  const $btnDepositar = $("#btnDepositar");
  const $monto = $("#Monto");
  const $saldo = $("#saldoActual");
  const $alertContainer = $("#alert-container");
  const $leyenda = $("#leyendaDeposito");
  const $listaMovimientos = $("#listaMovimientos");
  const $filtroMovimientos = $("#filtroMovimientos");

  // ==========================
  // SALDO
  // ==========================
  // Inicializar saldo solo si no existe en localStorage
  if (!localStorage.getItem("saldo")) localStorage.setItem("saldo", "600000");
  if (!localStorage.getItem("totalDepositado")) localStorage.setItem("totalDepositado", "0");

  let saldoActual = parseFloat(localStorage.getItem("saldo"));
  let totalDepositado = parseFloat(localStorage.getItem("totalDepositado"));

  // Mostrar saldo inicial
  $saldo.text(saldoActual.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));

  // ==========================
  // FUNCIONES
  // ==========================

  // Guardar movimiento en localStorage
  function guardarMovimiento(tipo, monto, detalle) {
    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    movimientos.unshift({
      tipo,
      monto,
      detalle,
      fecha: new Date().toLocaleString()
    });
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
  }

  // Mostrar alerta Bootstrap
  function mostrarAlerta(mensaje, tipo) {
    $alertContainer
      .stop(true, true)
      .html(`
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
          ${mensaje}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `)
      .show();

    setTimeout(() => {
      $alertContainer.find(".alert").fadeOut(1000, function () {
        $(this).remove();
      });
    }, 3000);
  }

  // Mostrar últimos movimientos
  function mostrarUltimosMovimientos(filtro = "todos") {
    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    $listaMovimientos.empty();

    movimientos.forEach(mov => {
      if (filtro === "todos" || mov.tipo === filtro) {
        const $li = $(`
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>${mov.tipo.toUpperCase()}</strong><br>
              ${mov.detalle}<br>
              <small class="text-muted">${mov.fecha}</small>
            </div>
            <span class="badge bg-success rounded-pill">$${mov.monto.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
          </li>
        `);
        $listaMovimientos.append($li);
      }
    });
  }

  // ==========================
  // EVENTOS
  // ==========================

  // Depositar dinero
  $btnDepositar.on("click", function(e) {
    e.preventDefault();

    const montoDepositado = parseFloat($monto.val());

    if(isNaN(montoDepositado) || montoDepositado <= 0) {
      mostrarAlerta("❌ Ingrese un monto válido", "danger");
      return;
    }

    // Actualizar saldo y total depositado
    saldoActual += montoDepositado;
    totalDepositado += montoDepositado;

    // Guardar en localStorage
    localStorage.setItem("saldo", saldoActual);
    localStorage.setItem("totalDepositado", totalDepositado);

    // Actualizar el saldo en la página
    $saldo.text(saldoActual.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));

    // Guardar movimiento
    guardarMovimiento("deposito", montoDepositado, "Depósito en cuenta");

    // Alerta de éxito
    mostrarAlerta("✅ Depósito realizado con éxito", "success");

    // Leyenda con monto depositado
    $leyenda
      .stop(true, true)
      .html(`
        <div class="alert alert-primary" role="alert">
          💰 Has depositado <strong>$${montoDepositado.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong>
        </div>
      `)
      .show();

    setTimeout(() => {
      $leyenda.find(".alert").fadeOut(1000, function () {
        $(this).remove();
      });
    }, 3000);

    $monto.val("");

    // Actualizar lista de movimientos
    mostrarUltimosMovimientos($filtroMovimientos.val());
  });

  // Filtrar movimientos
  $filtroMovimientos.on("change", function() {
    mostrarUltimosMovimientos($(this).val());
  });

  // Inicializar lista completa
  mostrarUltimosMovimientos("todos");

});


