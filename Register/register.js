document.getElementById("formRegistro").addEventListener("submit", function(event) {
  event.preventDefault();

  const form = this;
  let hayErrores = false;

  // Validar campos vacíos o inválidos
  const inputs = form.querySelectorAll('input, select');

  inputs.forEach(input => {
    const tipo = input.type;
    const valor = input.value.trim();

    // Validación específica por tipo de input
    if (valor === '' || (tipo === 'email' && !/\S+@\S+\.\S+/.test(valor))) {
      input.classList.add('is-invalid');
      hayErrores = true;
    } else {
      input.classList.remove('is-invalid');
    }
  });

  // Mostrar alerta si hay errores
  if (hayErrores) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'warning',
      title: 'Completa todos los campos correctamente',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    return;
  }

  // Si no hay errores, enviamos los datos
  const formData = new FormData(form);

  fetch("registro.php", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });

      Toast.fire({
        icon: data.icon || (data.success ? 'success' : 'error'),
        title: data.message
      });

      if (data.success && data.redirect) {
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 3000);
      }
    })
    .catch(() => {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'Error al conectar con el servidor',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    });
});
