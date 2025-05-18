document.addEventListener('DOMContentLoaded', function() {
  // ... (código existente del toggle de contraseña)

  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Configuración de Toast
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    try {
      const response = await fetch('login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      });

      const result = await response.json();
      
      // Mostrar notificación
      Toast.fire({
        icon: result.icon || (result.success ? 'success' : 'error'),
        title: result.message
      });

      // Redirigir si es exitoso después de 3 segundos
      if (result.success) {
        setTimeout(() => {
          window.location.href = result.redirect || "/Pantalla_principal/index_pantalla_principal.html"; 
        }, 3000);
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: 'Error de conexión con el servidor'
      });
      console.error('Error:', error);
    }
  });
});