$(function() {
  const $listaMovimientos = $("#listaMovimientos");
  const $filtroTipo = $("#filtroTipo");
  const $paginacion = $("<div class='d-flex justify-content-center mt-3' id='paginacion'></div>").insertAfter($listaMovimientos);

  let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

  // Configuración de paginación
  const movimientosPorPagina = 5;
  let paginaActual = 1;

  function getTipoTransaccion(tipo) {
    switch(tipo) {
      case "compra": return "Compra";
      case "deposito": return "Depósito";
      case "Envío": return "Transferencia enviada";
      case "recepcion": return "Transferencia recibida";
      default: return tipo;
    }
  }

  function getClaseMovimiento(tipo) {
    switch(tipo) {
      case "deposito": return "border-primary";
      case "compra": return "border-danger";
      case "Envío": return "border-warning";
      case "recepcion": return "border-success";
      default: return "border-secondary";
    }
  }

  // Formatear monto sin decimales si es entero
  function formatearMonto(monto) {
    return monto % 1 === 0
      ? monto.toLocaleString('es-CL', { maximumFractionDigits: 0 })
      : monto.toLocaleString('es-CL', { minimumFractionDigits: 2 });
  }

  // Mostrar movimientos de la página actual
  function mostrarUltimosMovimientos(filtro = "todos") {
    $listaMovimientos.empty();
    $paginacion.empty();

    let movimientosFiltrados = movimientos;
    if (filtro !== "todos") {
      movimientosFiltrados = movimientos.filter(mov => mov.tipo === filtro);
    }

    if (movimientosFiltrados.length === 0) {
      $listaMovimientos.append('<div class="text-center text-muted py-3">No hay movimientos registrados</div>');
      return;
    }

    // Calcular paginación
    const totalPaginas = Math.ceil(movimientosFiltrados.length / movimientosPorPagina);
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;

    const inicio = (paginaActual - 1) * movimientosPorPagina;
    const fin = inicio + movimientosPorPagina;
    const movimientosPagina = movimientosFiltrados.slice(inicio, fin);

    movimientosPagina.forEach(mov => {
      const clase = getClaseMovimiento(mov.tipo);
      const montoFormateado = formatearMonto(mov.monto);
      const $card = $(`
        <div class="card mb-3 ${clase} shadow-sm movimiento-card">
          <div class="card-body d-flex justify-content-between align-items-start">
            <div>
              <strong>${getTipoTransaccion(mov.tipo)}</strong><br>
              <small>${mov.detalle}</small><br>
              <span class="text-muted" style="font-size: 0.8rem;">${mov.fecha}</span>
            </div>
            <div class="fw-bold">$${montoFormateado}</div>
          </div>
        </div>
      `);
      $listaMovimientos.append($card);
    });

    // Crear botones de paginación
    if (totalPaginas > 1) {
      const $btnPrev = $(`<button class="btn btn-outline-secondary me-2">Anterior</button>`);
      const $btnNext = $(`<button class="btn btn-outline-secondary ms-2">Siguiente</button>`);

      $btnPrev.prop('disabled', paginaActual === 1);
      $btnNext.prop('disabled', paginaActual === totalPaginas);

      $btnPrev.on("click", () => {
        paginaActual--;
        mostrarUltimosMovimientos($filtroTipo.val());
      });

      $btnNext.on("click", () => {
        paginaActual++;
        mostrarUltimosMovimientos($filtroTipo.val());
      });

      $paginacion.append($btnPrev, `<span class="mx-2 align-self-center">Página ${paginaActual} de ${totalPaginas}</span>`, $btnNext);
    }
  }

  // Filtrar movimientos
  $filtroTipo.on("change", function() {
    paginaActual = 1;
    mostrarUltimosMovimientos($(this).val());
  });

  // Guardar movimiento
  window.guardarMovimiento = function(tipo, monto, detalle) {
    movimientos.unshift({
      tipo: tipo,
      monto: monto,
      detalle: detalle,
      fecha: new Date().toLocaleString()
    });
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
    mostrarUltimosMovimientos($filtroTipo.val());
  }

  // Mostrar al cargar
  mostrarUltimosMovimientos();
});
