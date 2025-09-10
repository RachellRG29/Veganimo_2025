document.addEventListener("DOMContentLoaded", () => {
  // 1. Actualización del nombre de usuario (sin cambios)
  const nombreElements = document.querySelectorAll('.lbl_nombre_user, .lbl_user_bienvenida, .nombre-usuario-header');
  
  const actualizarNombreUsuario = async () => {
    if (nombreElements.length === 0) return;
    try {
      let nombre = localStorage.getItem('userDisplayName');
      if (!nombre) {
        const session = await fetch('/Login/check_session.php');
        if (!session.ok) throw new Error('Error al verificar sesión');
        const data = await session.json();
        if (data.logged_in) {
          nombre = data.display_name;
          localStorage.setItem('userDisplayName', nombre);
        } else {
          window.location.href = '/Login/login.html';
          return;
        }
      }
      nombreElements.forEach(el => el.textContent = nombre);
    } catch (error) {
      console.error('❌ Error al actualizar el nombre del usuario:', error);
    }
  };
  actualizarNombreUsuario();

  // 2. Gestión del popup (versión mejorada)
  const inicializarPopup = () => {
    const tarjetaPerfil = document.querySelector(".tarjeta-perfil");
    const popup = document.getElementById("menu_popup");

    // Ajustar ancho del popup al mismo que la tarjeta
    popup.style.minWidth = tarjetaPerfil.offsetWidth + "px";


    if (!tarjetaPerfil || !popup) return;

    // Función para mostrar/ocultar el popup
    const togglePopup = (e) => {
      // Detener cualquier otro evento inmediatamente
      e.stopImmediatePropagation();
      e.preventDefault();
      
      // Cambiar visibilidad del popup
      popup.style.display = popup.style.display === "block" ? "none" : "block";
      
      // Si el popup está visible, deshabilitar temporalmente el modal
      if (popup.style.display === "block") {
        document.body.classList.add('popup-activo');
      } else {
        document.body.classList.remove('popup-activo');
      }
    };

    // Evento con CAPTURE phase para máxima prioridad
    tarjetaPerfil.addEventListener("click", togglePopup, true);

    // Cerrar popup al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!tarjetaPerfil.contains(e.target) && !popup.contains(e.target)) {
        popup.style.display = "none";
        document.body.classList.remove('popup-activo');
      }
    }, true);

    // 3. Cerrar sesión (sin cambios)
    const cerrarSesion = document.querySelector(".pop-cerrar-sesion");
    if (cerrarSesion) {
      cerrarSesion.addEventListener("click", (e) => {
        e.preventDefault();
        Swal.fire({
          title: '¿Cerrar sesión?',
          text: '¿Estás seguro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cerrar sesión',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await fetch('/Login/logout.php');
            localStorage.clear();
            window.location.href = '/Login/login.html';
          }
        });
      }, true); // CAPTURE phase
    }
  };

  // Observador de contenido dinámico
  const observarContenido = () => {
    const targetNode = document.getElementById('contenido-principal');
    if (!targetNode) {
      inicializarPopup();
      return;
    }
    new MutationObserver(inicializarPopup).observe(targetNode, { childList: true, subtree: true });
  };

  observarContenido();
});

// Estilo CSS para cuando el popup está activo
const estiloPopup = document.createElement('style');
estiloPopup.textContent = `
  .popup-activo .tarjeta-receta {
    pointer-events: none !important;
  }
`;
document.head.appendChild(estiloPopup);