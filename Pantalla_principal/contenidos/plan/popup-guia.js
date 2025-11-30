// 🆕 FUNCIÓN PARA INICIALIZAR EL POPUP DE GUÍA
function inicializarPopupGuia() {
  const btn_guia = document.querySelector('.btn-guia');
  const popup = document.getElementById('popupGuia');
  
  if (!btn_guia || !popup) {
    console.log('🔄 Popup de guía no encontrado en esta página');
    return;
  }

  console.log('🎯 Inicializando popup de guía...');
  
  const closeBtn = popup.querySelector('.cerrar_popup_x');
  const popupContenido = popup.querySelector('.popup_contenido');

  // Posicionar el popup encima del botón en el lado derecho
  function posicionarPopup() {
    const btnRect = btn_guia.getBoundingClientRect();
    const popupRect = popupContenido.getBoundingClientRect();
    
    // Posicionar verticalmente alineado con el botón
    let top = btnRect.top + window.scrollY;
    
    // Ajustar si el popup se sale de la pantalla en la parte inferior
    if (top + popupRect.height > window.innerHeight) {
      top = window.innerHeight - popupRect.height - 20;
    }
    
    // Ajustar si el popup se sale de la pantalla en la parte superior
    if (top < 100) {
      top = 100;
    }
    
    popupContenido.style.top = top + 'px';
    popupContenido.style.right = '45px';
  }

  // abrir / cerrar mediante toggling de clase
  function openPopup() {
    posicionarPopup();
    popup.classList.add('open');
    if (closeBtn) closeBtn.focus();
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popup.classList.remove('open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    btn_guia.focus();
  }

  // Remover event listeners previos para evitar duplicados
  btn_guia.replaceWith(btn_guia.cloneNode(true));
  if (closeBtn) closeBtn.replaceWith(closeBtn.cloneNode(true));
  
  // Obtener referencias frescas después del clone
  const newBtnGuia = document.querySelector('.btn-guia');
  const newCloseBtn = popup.querySelector('.cerrar_popup_x');
  const newPopup = document.getElementById('popupGuia');

  // listeners
  newBtnGuia.addEventListener('click', (e) => {
    e.preventDefault();
    openPopup();
  });

  if (newCloseBtn) {
    newCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closePopup();
    });
  }

  // cerrar haciendo click fuera del contenido
  newPopup.addEventListener('click', (e) => {
    if (e.target === newPopup) {
      closePopup();
    }
  });

  // cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && newPopup.classList.contains('open')) {
      closePopup();
    }
  });

  // Reposicionar en resize de ventana
  window.addEventListener('resize', () => {
    if (newPopup.classList.contains('open')) {
      posicionarPopup();
    }
  });
}