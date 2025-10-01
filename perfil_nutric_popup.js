document.addEventListener("DOMContentLoaded", () => {
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

  const inicializarPopup = () => {
    const tarjetaPerfil = document.getElementById("tarj_perfil_user");
    const popup = document.getElementById("menu_popup");
    if (!tarjetaPerfil || !popup) return;

    // Ajustar ancho popup
    popup.style.minWidth = tarjetaPerfil.offsetWidth + "px";

    const togglePopup = (e) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      popup.style.display = popup.style.display === "block" ? "none" : "block";
      document.body.classList.toggle('popup-activo', popup.style.display === "block");
    };
    tarjetaPerfil.addEventListener("click", togglePopup, true);

    document.addEventListener("click", (e) => {
      if (!tarjetaPerfil.contains(e.target) && !popup.contains(e.target)) {
        popup.style.display = "none";
        document.body.classList.remove('popup-activo');
      }
    }, true);

    // Cerrar sesión
    const cerrarSesion = document.querySelector(".pop-cerrar-sesion");
    if (cerrarSesion) {
      cerrarSesion.addEventListener("click", async (e) => {
        e.preventDefault();
        const result = await Swal.fire({
          title: '¿Cerrar sesión?',
          text: '¿Estás seguro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cerrar sesión',
          cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
          await fetch('/Login/logout.php');
          localStorage.clear();
          window.location.href = '/Login/login.html';
        }
      }, true);
    }
  };

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
