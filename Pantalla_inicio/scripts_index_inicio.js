
/*--------FUNCION PARA QUE EL SCROLL TENGA COLOR AL BAJAR--------*/
window.addEventListener('scroll', function() {
  const header = document.getElementById('header');
  if (window.scrollY > 0) {
    header.classList.add('scroll');
  } else {
    header.classList.remove('scroll');
  }
});

/*--------FUNCION PARA ALTERNAR EL BOTON TOGLE MENU--------*/
// ---- ELEMENTOS DEL DOM ----
document.addEventListener('DOMContentLoaded', function () {
  const toggler = document.querySelector('.navbar-toggler');
  const navLinks = document.querySelector('.navbar-links');
  const navbarAnchors = document.querySelectorAll('.navbar-links a');

  //para activar y desactivar el menu de la navbar
  toggler.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  //para activar el link de la navbar(linea naranja)
  navbarAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      navbarAnchors.forEach(a => a.classList.remove('active-link'));
      anchor.classList.add('active-link');
    });
  });

  //Para cortar las descripciones largas con maximo de 50 - Recetas
  const descripciones = document.querySelectorAll(".descripcion-tarjeta");

  descripciones.forEach(p => {
    const textoOriginal = p.textContent.trim();
    const palabras = textoOriginal.split(/\s+/); // divide por espacios

    if (palabras.length > 30) {
      const textoRecortado = palabras.slice(0, 30).join(" ") + "...";
      p.textContent = textoRecortado;
    }
  });

  //Para cortar las descripciones largas con maximo de 40- Informate
  const descripcion_inf = document.querySelectorAll(".descripcion-tarjeta-inf");
  descripcion_inf.forEach(p_inf => {
    const textoOriginal_inf = p_inf.textContent.trim();
    const palabras_inf = textoOriginal_inf.split(/\s+/); // divide por espacios

    if (palabras_inf.length > 40) {
      const textoRecortado_inf = palabras_inf.slice(0, 40).join(" ") + "...";
      p_inf.textContent = textoRecortado_inf;
    }
  });

});

