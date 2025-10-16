document.addEventListener("DOMContentLoaded", function() {
  document.body.addEventListener("submit", function(event) {
    if (event.target.id === "form-receta-pro") {  // <- aquí es clave
      event.preventDefault();
      
      Swal.fire({
        title: 'Guardando receta...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const formData = new FormData(event.target);

      fetch("guardar_recetaspro.php", {
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

        if (data.success) {
          event.target.reset();
          document.querySelectorAll('.img-preview').forEach(img => {
            img.style.display = 'none';
            img.src = '';
          });
          document.querySelectorAll('.icono-placeholder').forEach(icon => {
            icon.style.display = 'block';
          });
          setTimeout(() => location.reload(), 3000);
        }
      })
      .catch(error => {
        console.error(error);
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
