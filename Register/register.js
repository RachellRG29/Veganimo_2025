document.getElementById("formRegistro").addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(this);

  fetch("registro.php", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      if (data.redirect) {
        // Redirigir a la página de verificación
        window.location.href = data.redirect;
      } else {
        // Mostrar mensaje de éxito
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          timer: 3000
        });
        
        // Redirigir a login después de 3 segundos
        setTimeout(() => {
          window.location.href = "/Login/login.html";
        }, 3000);
      }
    } else {
      // Mostrar error
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: data.message,
        showConfirmButton: false,
        timer: 3000
      });
    }
  })
  .catch(error => {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: '❌ Error en la conexión con el servidor',
      showConfirmButton: false,
      timer: 3000
    });
  });
});