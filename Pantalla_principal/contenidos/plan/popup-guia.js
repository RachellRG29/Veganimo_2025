function inicializarPopupGuia() {
  const btn = document.querySelector('.btn-guia');
  const popup = document.getElementById('popupGuia');
  const closeBtn = popup.querySelector('.cerrar_popup_x');

  if (!btn || !popup) return;

  // abrir
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  // cerrar con X
  closeBtn.addEventListener('click', () => {
    popup.classList.remove('open');
    document.body.style.overflow = '';
  });

  // cerrar clic fuera
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      popup.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}
