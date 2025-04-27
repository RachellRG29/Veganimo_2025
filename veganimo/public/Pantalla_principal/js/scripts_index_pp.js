function cargarContenido(pagina) {
  return fetch(`/Pantalla_principal/contenidos/${pagina}`)
    .then(res => {
      if (!res.ok) throw new Error('Error de red');
      return res.text();
    })
    .then(data => {
      document.getElementById("contenido-principal").innerHTML = data;
      
      // Fondo verde para páginas específicas
      const paginasVerdes = ["pp_inicio.html", "pp_mi_plan.html"];
      document.getElementById("contenido-principal").style.backgroundColor = 
        paginasVerdes.includes(pagina) ? "#007848" : "#F6FFFE";
      
      return true;
    })
    .catch(error => console.error('Error:', error));
}

function scrollToSection(sectionName) {
  const section = document.querySelector(`.${sectionName}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const subItems = document.querySelectorAll(".submenu li");
  const itemsConSubmenu = document.querySelectorAll(".has-submenu");

  // Función para seleccionar un item
  const selectItem = (item) => {
    navItems.forEach(i => i.classList.remove("active", "highlight"));
    subItems.forEach(i => i.classList.remove("active", "highlight"));
    item.classList.add("active", "highlight");
  };

  // Manejar clicks en items con submenú
  itemsConSubmenu.forEach(item => {
    const trigger = item.querySelector(".nav-trigger");
    const menuText = trigger.querySelector("span");
    const arrow = trigger.querySelector(".ph-caret-down");

    // Click en el texto/icono del menú (cargar contenido)
    menuText.closest('div').addEventListener("click", (e) => {
      if (e.target !== arrow) { // Evitar que se active al clickear la flecha
        selectItem(item);
        if (item.hasAttribute("data-page")) {
          cargarContenido(item.getAttribute("data-page"));
        }
      }
    });

    // Click en la flecha (toggle submenú)
    arrow.addEventListener("click", (e) => {
      e.stopPropagation();
      item.classList.toggle("open-submenu");
    });
  });

  // Click en subitems
  subItems.forEach(subItem => {
    subItem.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentItem = subItem.closest(".has-submenu");
      
      selectItem(parentItem);
      subItem.classList.add("active", "highlight");
      parentItem.classList.add("open-submenu");

      const page = parentItem.getAttribute("data-page");
      const sectionName = subItem.getAttribute("data-name");

      if (page === "pp_informate.html" && sectionName) {
        scrollToSection(sectionName);
      } else if (subItem.hasAttribute("data-page")) {
        cargarContenido(subItem.getAttribute("data-page"));
      }
    });
  });

  // Click en items sin submenú
  navItems.forEach(item => {
    if (!item.classList.contains("has-submenu")) {
      item.addEventListener("click", () => {
        itemsConSubmenu.forEach(i => i.classList.remove("open-submenu"));
        selectItem(item);
        if (item.hasAttribute("data-page")) {
          cargarContenido(item.getAttribute("data-page"));
        }
      });
    }
  });

  // Cargar página inicial
  cargarContenido("pp_inicio.html");
});