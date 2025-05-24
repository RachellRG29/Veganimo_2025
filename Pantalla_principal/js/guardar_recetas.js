document.addEventListener("DOMContentLoaded", function() {
  // Delegación de eventos para el formulario dinámico
  document.body.addEventListener("submit", function(event) {
    if (event.target.id === "form-receta") {
      event.preventDefault();
      const formData = new FormData(event.target);

      fetch("guardar_recetas.php", {  // Asegúrate de que la ruta sea correcta
        method: "POST",
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: data.icon || 'info',
          title: data.message,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        
        // Opcional: Resetear el formulario después de guardar
        if (data.success) {
          event.target.reset();
          document.getElementById("preview-imagen-receta").style.display = "none";
          document.querySelector(".icono-placeholder").style.display = "block";
        }
      })
      .catch(() => {
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: '❌ Error al conectar con el servidor.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      });
    }
  });
});
