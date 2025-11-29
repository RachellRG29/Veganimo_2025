(function () {
  // esperar a que el DOM esté listo
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    const btn = document.querySelector('.btn-guia');
    const popup = document.getElementById('popupGuia');
    const closeBtn = popup ? popup.querySelector('.cerrar_popup') : null;

    if (!btn) {
      console.warn('btn-guia no encontrado');
      return;
    }
    if (!popup) {
      console.warn('popupGuia no encontrado');
      return;
    }
    if (!closeBtn) {
      console.warn('cerrar_popup no encontrado dentro del popup');
    }

    // abrir / cerrar mediante toggling de clase (más seguro que manipular style directamente)
    function openPopup() {
      popup.classList.add('open');
      // foco accesible: poner focus en botón de cerrar
      if (closeBtn) closeBtn.focus();
      // bloquear scroll del body opcional
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    function closePopup() {
      popup.classList.remove('open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      // devolver foco al botón
      btn.focus();
    }

    // listeners
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closePopup();
      });
    }

    // cerrar haciendo click fuera del contenido
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        closePopup();
      }
    });

    // cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('open')) {
        closePopup();
      }
    });
  });
})();
