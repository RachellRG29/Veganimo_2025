function cargarContenido(pagina) {
  console.log("📥 Solicitando:", `/Pantalla_principal/contenidos/${pagina}`);
  
  return fetch(`/Pantalla_principal/contenidos/${pagina}`)
    .then(res => {
      if (!res.ok) {
        console.error("❌ Error al cargar:", res.status);
        throw new Error('Error de red');
      }
      return res.text();
    })
    .then(data => {
      console.log("✅ Contenido recibido");
      document.getElementById("contenido-principal").innerHTML = data;

      const paginasVerdes = ["pp_inicio.html", "pp_mi_plan.html"];
      document.getElementById("contenido-principal").style.backgroundColor = 
        paginasVerdes.includes(pagina) ? "#007848" : "#F6FFFE";

      return true;
    })
    .catch(error => console.error('⚠️ Error al cargar contenido:', error));
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

  const selectItem = (item) => {
    navItems.forEach(i => i.classList.remove("active", "highlight"));
    subItems.forEach(i => i.classList.remove("active", "highlight"));
    item.classList.add("active", "highlight");
  };

  itemsConSubmenu.forEach(item => {
    const trigger = item.querySelector(".nav-trigger");
    const menuText = trigger.querySelector("span");
    const arrow = trigger.querySelector(".ph-caret-down");

    menuText.closest('div').addEventListener("click", (e) => {
      if (e.target !== arrow) {
        selectItem(item);
        if (item.hasAttribute("data-page")) {
          cargarContenido(item.getAttribute("data-page"));
        }
      }
    });

    arrow.addEventListener("click", (e) => {
      e.stopPropagation();
      item.classList.toggle("open-submenu");
    });
  });

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

  // 🚀 Código nuevo para leer parámetros y cargar sección automáticamente
  const params = new URLSearchParams(window.location.search);
  const seccion = params.get('seccion');

  if (seccion === 'recetas') {
    const recetasItem = [...document.querySelectorAll('.nav-item')].find(item => 
      item.innerText.trim() === 'Recetas'
    );
    if (recetasItem) {
      recetasItem.click();
    } else {
      cargarContenido("pp_inicio.html");
    }
  } else if (seccion === 'informate') {
    const informateItem = [...document.querySelectorAll('.nav-item')].find(item => 
      item.innerText.trim() === 'Infórmate'
    );
    if (informateItem) {
      const textoTrigger = informateItem.querySelector('.nav-trigger span');
      if (textoTrigger) {
        textoTrigger.click();
      } else {
        cargarContenido("pp_inicio.html");
      }
    } else {
      cargarContenido("pp_inicio.html");
    }
  } else {
    cargarContenido("pp_inicio.html");
  }
});
