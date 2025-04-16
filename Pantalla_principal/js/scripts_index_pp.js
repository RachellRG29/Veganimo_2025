function cargarContenido(pagina) {
  fetch(`/Pantalla_principal/contenidos/${pagina}`)
    .then(res => res.text())
    .then(data => {
      const contenido = document.getElementById("contenido-principal");
      contenido.innerHTML = data;

      /*contenido.addEventListener("scroll", () => {
        const footer =  contenido.querySelector(".footer-oculto");
        if (!footer) return;

        const alFinal = contenido.scrollTop + contenido.clientHeight >= contenido.scrollHeight - 10;
    
        if (alFinal) {
          footer.classList.add("footer-visible");
        } else {
          footer.classList.remove("footer-visible");
        }
      });*/

      // Fondo por página
      contenido.style.backgroundColor = (pagina === "pp_inicio.html", "pp_mi_plan.html","pp_recetas.html") 
      ? "#007848" : "#F6FFFE";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item[data-page]");
  const subItems = document.querySelectorAll(".submenu li");
  const itemsConSubmenu = document.querySelectorAll(".has-submenu");

  // Abrir/Cerrar submenús al hacer clic en el trigger
  itemsConSubmenu.forEach(item => {
    const trigger = item.querySelector(".nav-trigger");

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = item.classList.contains("open-submenu");

      // Reset
      navItems.forEach(i => i.classList.remove("active", "highlight"));
      subItems.forEach(i => i.classList.remove("active", "highlight"));
      itemsConSubmenu.forEach(i => i.classList.remove("open-submenu"));

      item.classList.add("active", "highlight");

      // Si no estaba abierto, lo abrimos
      if (!isOpen) {
        item.classList.add("open-submenu");
      }

      // Cargar contenido si tiene página
      const page = item.getAttribute("data-page");
      if (page) {
        cargarContenido(page);
      }
    });
  });

  // Click en subitems
  subItems.forEach(subItem => {
    subItem.addEventListener("click", (e) => {
      e.stopPropagation();

      navItems.forEach(i => i.classList.remove("active", "highlight"));
      subItems.forEach(i => i.classList.remove("active", "highlight"));

      const parentItem = subItem.closest(".nav-item");
      parentItem.classList.add("active", "highlight", "open-submenu");
      subItem.classList.add("active", "highlight");

      const page = subItem.getAttribute("data-page");
      if (page) {
        cargarContenido(page);
      }
    });
  });

  // Click en ítems normales
  navItems.forEach(item => {
    if (!item.classList.contains("has-submenu")) {
      item.addEventListener("click", (e) => {
        e.stopPropagation();

        navItems.forEach(i => i.classList.remove("active", "highlight"));
        subItems.forEach(i => i.classList.remove("active", "highlight"));
        itemsConSubmenu.forEach(i => i.classList.remove("open-submenu"));

        item.classList.add("active", "highlight");

        const page = item.getAttribute("data-page");
        if (page) {
          cargarContenido(page);
        }
      });
    }
  });

  // Cargar página por defecto
  cargarContenido("pp_inicio.html");
});




/*
function cargarContenido(pagina) {
  fetch(`/Pantalla_principal/contenidos/${pagina}`)
    .then(res => res.text())
    .then(data => {
      const contenido = document.getElementById("contenido-principal");
      contenido.innerHTML = data;

      // Cambiar color de fondo según la página
      if (pagina === "pp_recetas.html") {
        contenido.style.backgroundColor = "#007848";
      } else {
        contenido.style.backgroundColor = "#F6FFFE";
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item[data-page]");
  const subItems = document.querySelectorAll(".submenu li");

  // Evento para ítems principales
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      // Limpiar activos y líneas
      navItems.forEach(i => i.classList.remove("active", "highlight"));
      subItems.forEach(i => i.classList.remove("active", "highlight"));
      document.querySelectorAll(".has-submenu").forEach(i => i.classList.remove("open-submenu"));

      // Activar actual
      item.classList.add("active", "highlight");

      // Cargar contenido si tiene página
      const page = item.getAttribute("data-page");
      if (page) {
        cargarContenido(page);
      }
    });
  });

  // Evento para subitems
  subItems.forEach(subItem => {
    subItem.addEventListener("click", (e) => {
      e.stopPropagation();

      // Limpiar anteriores
      navItems.forEach(i => i.classList.remove("highlight"));
      subItems.forEach(i => i.classList.remove("active", "highlight"));
      document.querySelectorAll(".has-submenu").forEach(i => i.classList.remove("open-submenu"));

      // Activar padre con fondo blanco
      const parentItem = subItem.closest(".nav-item");
      if (parentItem && parentItem.classList.contains("has-submenu")) {
        parentItem.classList.add("active");
        parentItem.classList.remove("highlight");
        parentItem.classList.add("open-submenu");
      }

      // Activar submenú con línea naranja
      subItem.classList.add("active", "highlight");

      // Cargar contenido
      const page = subItem.getAttribute("data-page");
      if (page) {
        cargarContenido(page);
      }
    });
  });

  // Cargar página por defecto
  cargarContenido("pp_inicio.html");
});


*/