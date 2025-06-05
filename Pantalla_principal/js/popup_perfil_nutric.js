function inicializarPopupPerfil() {
  const btnPerfil = document.getElementById("tarj_perfil_user");
  const menuPopup = document.getElementById("menu_popup");

  if (btnPerfil && menuPopup) {
    btnPerfil.addEventListener("click", (e) => {
      e.stopPropagation();
      menuPopup.style.display = menuPopup.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", (e) => {
      if (!btnPerfil.contains(e.target) && !menuPopup.contains(e.target)) {
        menuPopup.style.display = "none";
      }
    });
  } else {
    console.warn("popup_perfil_nutric: No se encontró el botón o el menú");
  }
}
