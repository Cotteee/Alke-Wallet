//Inicio de sesion
$(document).ready(function () {

  $("#btnlogin").on("click", function () {

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    if (email === "" || password === "") {
      mostrarAlerta("Complete todos los campos", "danger");
      return;
    }

    if (!email.includes("@")) {
      mostrarAlerta("Email inválido", "warning");
      return;
    }

    // VALIDACIÓN CORRECTA
    if (email === "maria@gmail.com" && password === "12345") {
      mostrarAlerta("✅ Login exitoso, redirigiendo...⏳", "success");

      // Espera 1.5 segundos y redirige
      setTimeout(() => {
        window.location.href = "menu.html";
      }, 1500);

    } else { // validación incorrecta
      mostrarAlerta("❌ Email o contraseña incorrectos", "danger");
    }
  });

  // Función mejorada para mostrar alertas que desaparecen
  function mostrarAlerta(mensaje, tipo) {
    const $alerta = $(`
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `);

    // Limpiar alertas anteriores
    $("#alertaLogin").empty().append($alerta);

    // Desaparecer automáticamente después de 3 segundos
    setTimeout(() => {
      $alerta.fadeOut(500, function() {
        $(this).remove();
      });
    }, 3000);
  }

});

const email = $('#email').val()

const password = $('#password').val()


