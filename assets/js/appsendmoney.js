$(function () {

  // ELEMENTOS DEL DOM
  const $listaContactos = $("#listaContactos");
  const $btnGuardarContacto = $("#btnGuardarContacto");
  const $btnEnviar = $("#btnEnviar");
  const $montoEnviar = $("#montoEnviar");
  const $mensajeEnvio = $("#mensajeEnvio");
  const $saldoSend = $("#saldoSend");

  const $formNuevoContacto = $("#formNuevoContacto");
  const $btnAgregarContacto = $("#btnAgregarContacto");
  const $btnCancelarContacto = $("#btnCancelarContacto");
  const $alertContainer = $("#alert-container");
  const $busquedaContacto = $("#busquedaContacto");
  const $datalist = $("#contactosDatalist");

  let contactoSeleccionado = null;

  // SALDO
  let saldoActual = parseFloat(localStorage.getItem("saldo")) || 1000;
  let totalEnviado = parseFloat(localStorage.getItem("totalEnviado")) || 0;

  $saldoSend.text(saldoActual.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));

  // CONTACTOS
  let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
  $btnEnviar.hide();

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

  // Mostrar alerta temporal
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

  // Renderizar contactos filtrados
  function renderContactosFiltrados() {
    const termino = $busquedaContacto.val().toLowerCase();
    $listaContactos.empty();

    contactos.forEach((c, i) => {
      if (c.nombre.toLowerCase().includes(termino) || c.alias.toLowerCase().includes(termino)) {
        const $li = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center");

        // Span con emoji 👤
        const $span = $("<span>").css("cursor", "pointer")
          .html(`
            👤 <strong>${c.nombre}</strong><br>
            Alias: ${c.alias}<br>
            Cuenta: ${c.cbu}<br>
            Banco: ${c.banco}
          `)
          .on("click", function () {
            contactoSeleccionado = i;
            $listaContactos.find("span").removeClass("fw-bold");
            $span.addClass("fw-bold");
            $btnEnviar.show();
            $busquedaContacto.val(c.nombre);
          });

        // Botón eliminar con emoji 🗑️
        const $btnEliminar = $("<button>")
          .addClass("btn btn-sm btn-danger")
          .html("🗑️")
          .on("click", function (e) {
            e.stopPropagation();
            if (confirm(`¿Desea eliminar a ${c.nombre}?`)) {
              contactos.splice(i, 1);
              localStorage.setItem("contactos", JSON.stringify(contactos));

              if (contactoSeleccionado === i) {
                contactoSeleccionado = null;
                $btnEnviar.hide();
              }

              renderContactosFiltrados();
              actualizarDatalist();
            }
          });

        $li.append($span, $btnEliminar);
        $listaContactos.append($li);
      }
    });

    if (contactoSeleccionado !== null && !$listaContactos.find("span").eq(contactoSeleccionado).length) {
      $btnEnviar.hide();
    }
  }

  function renderContactos() {
    $busquedaContacto.val("");
    renderContactosFiltrados();
  }

  // Actualizar datalist para autocompletado
  function actualizarDatalist() {
    $datalist.empty();
    contactos.forEach(c => {
      $datalist.append(`<option value="${c.nombre}">`);
      $datalist.append(`<option value="${c.alias}">`);
      $datalist.append(`<option value="${c.cbu}">`);
    });
  }

  renderContactos();
  actualizarDatalist();

  // EVENTOS

  // Mostrar formulario de contacto
  $btnAgregarContacto.on("click", function () {
    $formNuevoContacto.show();
  });

  // Cancelar formulario
  $btnCancelarContacto.on("click", function () {
    $formNuevoContacto.hide();
    $("#nombre, #numeroCuenta, #alias, #banco").val("");
  });

  // Guardar nuevo contacto
  $btnGuardarContacto.on("click", function () {
    const nombre = $("#nombre").val().trim();
    const cbu = $("#numeroCuenta").val().trim();
    const alias = $("#alias").val().trim();
    const banco = $("#banco").val().trim();

    if (!nombre || !cbu || !alias || !banco) {
      mostrarAlerta("❌ Complete todos los campos", "danger");
      return;
    }

    const cbuRegex = /^\d{12}$/;
    if (!cbuRegex.test(cbu)) {
      mostrarAlerta("❌ Número de cuenta inválido. Debe tener 12 dígitos", "danger");
      return;
    }

    contactos.push({ nombre, cbu, alias, banco });
    localStorage.setItem("contactos", JSON.stringify(contactos));
    renderContactos();
    actualizarDatalist();

    $("#nombre, #numeroCuenta, #alias, #banco").val("");
    $formNuevoContacto.hide();
    mostrarAlerta("✅ Contacto agregado con éxito", "success");
  });

  // Enviar dinero
  $btnEnviar.on("click", function () {
    const monto = parseFloat($montoEnviar.val());

    if (contactoSeleccionado === null) {
      $mensajeEnvio.text("Seleccione un contacto").removeClass("text-success").addClass("text-danger");
      return;
    }

    if (isNaN(monto) || monto <= 0) {
      $mensajeEnvio.text("Ingrese un monto válido").removeClass("text-success").addClass("text-danger");
      return;
    }

    if (monto > saldoActual) {
      $mensajeEnvio.text("Saldo insuficiente").removeClass("text-success").addClass("text-danger");
      return;
    }

    // Actualizar saldo
    saldoActual -= monto;
    totalEnviado += monto;

    localStorage.setItem("saldo", saldoActual);
    localStorage.setItem("totalEnviado", totalEnviado);

    $saldoSend.text(saldoActual.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));

    // Guardar movimiento en localStorage
    guardarMovimiento("Envío", monto, `Envío a ${contactos[contactoSeleccionado].nombre}`);

    $mensajeEnvio.text("Dinero enviado con éxito 👍").removeClass("text-danger").addClass("text-success");

    setTimeout(() => {
      $mensajeEnvio.text("");
    }, 3000);

    $montoEnviar.val("");
  });

  // Búsqueda de contactos en tiempo real
  $busquedaContacto.on("input", function () {
    renderContactosFiltrados();

    const valor = $(this).val().toLowerCase();
    contactoSeleccionado = contactos.findIndex(c =>
      c.nombre.toLowerCase() === valor || c.alias.toLowerCase() === valor
    );

    if (contactoSeleccionado !== -1) {
      $btnEnviar.show();
    } else {
      contactoSeleccionado = null;
      $btnEnviar.hide();
    }
  });

});
