document.addEventListener("DOMContentLoaded", function() {
  document.body.addEventListener("submit", function(event) {
    if (event.target.id === "form-receta") {
      event.preventDefault();
      
      // Mostrar loader mientras se procesa
      Swal.fire({
        title: 'Guardando receta...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const formData = new FormData(event.target);

      fetch("guardar_recetas.php", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
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

        if (data.success) {
          // Limpiar formulario y resetear vistas previas
          event.target.reset();
          document.querySelectorAll('.img-preview').forEach(img => {
            img.style.display = 'none';
            img.src = '';
          });
          document.querySelectorAll('.icono-placeholder').forEach(icon => {
            icon.style.display = 'block';
          });

          // Recargar la página luego de un breve retraso
          setTimeout(() => {
            location.reload();
          }, 3000); // Esperar a que se vea el toast
        }
      })
      .catch(error => {
        console.error('Error:', error);
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
