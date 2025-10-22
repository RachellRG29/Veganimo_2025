document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Portal Admin iniciado");

  const navItems = document.querySelectorAll(".nav-item-admin");
  const contenidoAdmin = document.getElementById("contenido-admin");

  // Resalta el item seleccionado
  const seleccionarItem = (item) => {
    navItems.forEach((i) => i.classList.remove("active", "highlight"));
    item.classList.add("active", "highlight");
  };

  // Función para cargar contenido dinámico
  async function cargarContenido(pagina) {
    const url = `/Portal_de_administrador/contenidos/${pagina}`;
    console.log("📥 Solicitando:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {throw new Error(`Error al cargar: ${url}`);}

      const html = await response.text();
      contenidoAdmin.innerHTML = html;

      // EJECUTAR SCRIPTS ESPECÍFICOS PARA CADA PÁGINA
      inicializarModulo(pagina);

      // Guardar última página cargada
      localStorage.setItem("ultimaPaginaCargada_admin", pagina);
      return true;
    } catch (err) {
      console.error("⚠️ Error al cargar contenido:", err);
      contenidoAdmin.innerHTML = "<p>Error al cargar el contenido.</p>";
      return false;
    }
  }

  // Función que inicializa módulos según la página
  function inicializarModulo(pagina) {
    console.log("🔄 Inicializando módulo para:", pagina);

    switch (pagina) {
    case "pp_usuario.html":
      if (typeof inicializarUsuarios === "function") {
        console.log("✅ Inicializando usuarios...");
        inicializarUsuarios();
      } else {
        console.warn("❌ inicializarUsuarios no está disponible");
      }
      break;

    case "pp_usuarios_pro.html":
      if (typeof cargarUsuariosPro === "function") {
        console.log("✅ Inicializando usuarios PRO...");
        cargarUsuariosPro();
      } else {
        console.warn("❌ cargarUsuariosPro no está disponible");
      }
      break;

    case "pp_recetas.html":
      if (typeof cargarRecetas === "function") {
        console.log("✅ Inicializando recetas...");
        cargarRecetas();
      } else {
        console.warn("❌ cargarRecetas no está disponible");
      }
      break;

    case "pp_solicitudes.html": // 👈 NUEVO CASO AÑADIDO
      if (typeof cargarSolicitudes === "function") {
        console.log("✅ Inicializando solicitudes de recetas...");
        cargarSolicitudes();
      } else {
        console.warn("❌ cargarSolicitudes no está disponible");
      }
      break;

    default:
      console.log("ℹ️ No hay módulo específico para esta página");
    }
  }

  // Manejo de clicks en el menú lateral
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const pagina = item.getAttribute("data-page");
      if (pagina) {
        seleccionarItem(item);
        cargarContenido(pagina);
      }
    });
  });

  // Cargar última página guardada al iniciar
  const ultimaPagina = localStorage.getItem("ultimaPaginaCargada_admin");
  if (ultimaPagina) {
    console.log("📖 Cargando última página guardada:", ultimaPagina);
    const item = [...navItems].find(
      (i) => i.getAttribute("data-page") === ultimaPagina,
    );
    if (item) {seleccionarItem(item);}
    cargarContenido(ultimaPagina);
  } else {
    console.log(
      "📖 No hay última página guardada, cargando la primera disponible",
    );
    const primerItem = navItems[0];
    if (primerItem) {
      seleccionarItem(primerItem);
      cargarContenido(primerItem.getAttribute("data-page"));
    }
  }
});
