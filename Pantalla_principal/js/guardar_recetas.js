document.getElementById("formReceta").addEventListener("submit", function(event) {
  event.preventDefault();

  const form = this;
  const formData = new FormData(form);

  fetch("guardar_receta.php", {
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
});

