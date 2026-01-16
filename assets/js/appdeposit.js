$(function () {

  // ELEMENTOS
  
  const $btnDepositar = $("#btnDepositar");
  const $monto = $("#Monto");
  const $saldo = $("#saldoActual");
  const $alertContainer = $("#alert-container");
  const $leyenda = $("#leyendaDeposito");
  const $listaMovimientos = $("#listaMovimientos");
  const $filtroMovimientos = $("#filtroMovimientos");

  
  // SALDO
    
  let saldoActual = parseFloat(localStorage.getItem("saldo")) || 1000;
  let totalDepositado = parseFloat(localStorage.getItem("totalDepositado")) || 0;
//monto se muestra sin .00 si es entero
  $saldo.text(saldoActual.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));

  
  // FUNCIONES
  

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

  
  // EVENTOS


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

    // Redirigir después de 2s
    setTimeout(() => {
      window.location.href = "menu.html";
    }, 2000);

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

