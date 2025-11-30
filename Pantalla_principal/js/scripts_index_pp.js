// ======================== SIDEBAR PANTALLA PRINCIPAL ======================== 
  const btn = document.getElementById("toggle-sidebar");
  const sidebar = document.querySelector(".sidebar");
  const menuToggle = document.querySelector(".menu-toggle");

  btn.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-open");
    menuToggle.classList.toggle("active");
  });

// ======================== CARGAR CONTENIDO ========================
async function cargarContenido(pagina) {
  // Construye la ruta correctamente, admitiendo subcarpetas
  const ruta = `/Pantalla_principal/contenidos/${pagina}`;
  console.log("📥 Solicitando:", ruta);

  try {
    const response = await fetch(ruta);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.text();
    document.getElementById("contenido-principal").innerHTML = data;

    // Actualizaciones de perfil y scripts
    await actualizarPerfilUsuario();
    setTimeout(verificarActualizacionPerfil, 300);
    ejecutarScriptsPagina(pagina);

        if (pagina === "/plan/pp_dashboard_miplan.php") {
      setTimeout(() => {
        console.log("🚀 Inicializando modales del dashboard...");
        if (window.inicializarModalesPlan) {
          window.inicializarModalesPlan();
        } else {
          console.warn("⚠️ inicializarModalesPlan no disponible, intentando cargar script...");
          cargarScriptModales();
        }
      }, 500);
    }

    // Guardar la última página cargada
    localStorage.setItem("ultimaPaginaCargada", pagina);

    return true;
  } catch (error) {
    console.error("⚠️ Error al cargar contenido:", error);
    mostrarErrorCarga();
    return false;
  }
}

// ======================== MODO CLARO / OSCURO ========================
function inicializarModoTema() {
  const lightRadio = document.getElementById("theme-light");
  const darkRadio = document.getElementById("theme-dark");

  if (!lightRadio || !darkRadio) {
    //console.warn("⚠️ Radios de tema no encontrados, reintentando...");
    setTimeout(inicializarModoTema, 500);
    return;
  }

  const temaGuardado = localStorage.getItem("tema") || "light";
  aplicarTema(temaGuardado);

  if (temaGuardado === "dark") darkRadio.checked = true;
  else lightRadio.checked = true;

  lightRadio.addEventListener("change", () => {
    aplicarTema("light");
    localStorage.setItem("tema", "light");
  });

  darkRadio.addEventListener("change", () => {
    aplicarTema("dark");
    localStorage.setItem("tema", "dark");
  });
}

function aplicarTema(modo) {
  document.body.classList.remove("light-mode", "dark-mode");
  document.body.classList.add(modo === "dark" ? "dark-mode" : "light-mode");

  const bgTheme = document.getElementById("bgTheme");
  if (bgTheme) bgTheme.style.left = modo === "dark" ? "50%" : "4px";
}

// Inicializar tema en DOMContentLoaded (se mantiene separado del init principal)
document.addEventListener("DOMContentLoaded", inicializarModoTema);

// ======================== EJECUTAR SCRIPTS SEGÚN PÁGINA ========================
function ejecutarScriptsPagina(pagina) {
  setTimeout(inicializarModoTema, 100); // Siempre actualizar tema

  if (pagina === "pp_inicio.php") {
    // espacio para lógica específica de pp_inicio si la necesitas luego
  }

  if (pagina === "/plan/pp_suscripcion_act.php") {
    // espacio para lógica específica de suscripción
  }

  if (pagina === "pp_crear_receta.php" || pagina === "pp_crear_recetapro.php") {
    inicializarCrearRecetas(); // Validaciones y scripts
  }

  if (pagina === "pp_recetas.php") {
    setTimeout(() => {
      if (typeof cargarRecetas === 'function') {
        cargarRecetas();
      } else console.error("❌ La función cargarRecetas no está definida.");
    }, 100);
  }

  if (pagina === "/dieta_vegana/pp_dieta_vegana.php") {
    // espacio para lógica de dieta vegana
  }

    if (pagina === "/plan/pp_dashboard_miplan.php") {
    setTimeout(() => {
      console.log("🏠 Dashboard cargado, inicializando modales...");
      if (window.inicializarModalesPlan) {
        window.inicializarModalesPlan();
      } else {
        console.error("❌ La función inicializarModalesPlan no está disponible");
        // Intentar cargar el script manualmente si no está disponible
        cargarScriptModales();
      }
    }, 300);
  }


}

// ======================== INICIALIZACIÓN PRINCIPAL ========================
document.addEventListener("DOMContentLoaded", async () => {
  await actualizarPerfilUsuario();
  await verificarRolUsuario();

  const navItems = document.querySelectorAll(".nav-item");
  const subItems = document.querySelectorAll(".submenu li");
  const itemsConSubmenu = document.querySelectorAll(".has-submenu");

  const selectItem = (item) => {
    navItems.forEach(i => i.classList.remove("active", "highlight"));
    subItems.forEach(i => i.classList.remove("active", "highlight"));
    item.classList.add("active", "highlight");
  };

  // Items con submenú
  itemsConSubmenu.forEach(item => {
    const trigger = item.querySelector(".nav-trigger");
    // defensiva: puede que trigger sea null
    if (!trigger) return;

    const menuText = trigger.querySelector("span");
    const arrow = trigger.querySelector(".ph-caret-down");

    if (menuText) {
      const closestDiv = menuText.closest('div');
      if (closestDiv) {
        closestDiv.addEventListener("click", (e) => {
          if (e.target !== arrow) {
            selectItem(item);
            if (item.hasAttribute("data-page")) cargarContenido(item.getAttribute("data-page"));
          }
        });
      }
    }

    if (arrow) {
      arrow.addEventListener("click", (e) => {
        e.stopPropagation();
        item.classList.toggle("open-submenu");
        selectItem(item);
        if (item.hasAttribute("data-page")) cargarContenido(item.getAttribute("data-page"));
      });
    }
  });

  // Subitems
  subItems.forEach(subItem => {
    subItem.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentItem = subItem.closest(".has-submenu");
      if (!parentItem) return;
      selectItem(parentItem);
      subItem.classList.add("active", "highlight");
      parentItem.classList.add("open-submenu");

      const page = parentItem.getAttribute("data-page");
      const sectionName = subItem.getAttribute("data-name");

      if (page === "pp_informate.php" && sectionName) scrollToSection(sectionName);
      else if (subItem.hasAttribute("data-page")) cargarContenido(subItem.getAttribute("data-page"));
    });
  });

  // Items sin submenú
  navItems.forEach(item => {
    if (!item.classList.contains("has-submenu")) {
      item.addEventListener("click", () => {
        itemsConSubmenu.forEach(i => i.classList.remove("open-submenu"));
        selectItem(item);
        if (item.hasAttribute("data-page")) cargarContenido(item.getAttribute("data-page"));
        else if (item.hasAttribute("data-custom")) manejarAccionPersonalizada(item.getAttribute("data-custom"));
      });
    }
  });

  // Manejo de URL y última página
  const params = new URLSearchParams(window.location.search);
  const seccion = params.get('seccion');
  let ultimaPagina = localStorage.getItem('ultimaPaginaCargada');
  let paginaInicial = "pp_inicio.php";

  if (seccion === 'recetas') paginaInicial = "pp_recetas.php";
  else if (seccion === 'informate') paginaInicial = "pp_informate.php";
  else if (ultimaPagina) {
    try {
      const sessionData = await verificarSesion();
      const esAdmin = sessionData.role === 'admin';
      if (ultimaPagina === "pp_crear_receta.php" && !esAdmin) paginaInicial = "pp_inicio.php";
      else paginaInicial = ultimaPagina;
      localStorage.setItem('ultimaPaginaCargada', paginaInicial);
    } catch {
      paginaInicial = "pp_inicio.php";
      localStorage.setItem('ultimaPaginaCargada', paginaInicial);
    }
  }

  // 🚀 Verificar si el usuario es PRO antes de cargar la página inicial
  try {
    const res = await fetch("./verificar_perfil_pro.php", {
      method: "GET",
      headers: { "Cache-Control": "no-cache" }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.pro === true) {
  console.log("⭐ Usuario PRO detectado → se prioriza /plan/pp_suscripcion_act.php");
  paginaInicial = "/plan/pp_suscripcion_act.php"; // 🔹 Página principal PRO cuando tiene premiun asi carga primero la plan 
} else {
  console.log("👤 Usuario normal → cargando inicio");
}

    } else {
      console.warn("⚠️ verificar_perfil_pro.php respondió con status:", res.status);
    }
  } catch (err) {
    console.error("❌ Error al verificar perfil PRO:", err);
  }

  const navItem = [...document.querySelectorAll('.nav-item')]
    .find(item => item.getAttribute('data-page') === paginaInicial);
  if (navItem) {
    navItem.classList.add('active', 'highlight');
    if (navItem.closest('.has-submenu')) navItem.closest('.has-submenu').classList.add('open-submenu');
  }

  cargarContenido(paginaInicial);
  verificarPerfilPro(); // Inicializa botón PRO
});

// ======================== PERFIL USUARIO ========================
async function actualizarPerfilUsuario() {
  try {
    const elementosNombre = document.querySelectorAll('.lbl_nombre_user, .lbl_user_bienvenida, .nombre-usuario-header');
    const sessionData = await verificarSesion();
    if (!sessionData.logged_in) return window.location.href = '/Login/login.html';
    const nombreMostrar = sessionData.display_name || "Usuario";
    localStorage.setItem('userDisplayName', nombreMostrar);
    elementosNombre.forEach(el => el.textContent = nombreMostrar);
  } catch {
    window.location.href = '/Login/login.html';
  }
}

async function verificarSesion() {
  try {
    const response = await fetch('/Login/check_session.php');
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return { logged_in: false };
  }
}

// ======================== ROL USUARIO ========================
async function verificarRolUsuario() {
  try {
    const response = await fetch('/Login/check_session.php');
    if (!response.ok) throw new Error();
    const data = await response.json();
    const adminElements = document.querySelectorAll('[data-admin-only]');
    const isAdmin = data.role === 'admin';
    adminElements.forEach(el => el.style.display = isAdmin ? '' : 'none');
    return data.role;
  } catch {
    return 'user';
  }
}

// ======================== CREAR RECETAS ========================
function inicializarCrearRecetas() {
  console.log("✅ Inicializando creación de recetas...");
  iniciarValidacionCrearReceta();
}

// ======================== FUNCIONES VARIAS ========================
function mostrarErrorCarga() {
  const contenido = document.getElementById("contenido-principal");
  contenido.innerHTML = `
    <div class="error-carga">
      <h2>⚠️ Error al cargar el contenido</h2>
      <p>Por favor, intenta nuevamente más tarde</p>
      <button onclick="location.reload()">Reintentar</button>
    </div>`;
  contenido.style.backgroundColor = "#F6FFFE";
}

function redirigirALogin() {
  window.location.href = '/Login/login.html';
}

function scrollToSection(sectionName) {
  const section = document.querySelector(`.${sectionName}`);
  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function manejarAccionPersonalizada(accion) {
  switch (accion) {
    case 'crear-recetas':
      cargarContenido("pp_crear_recetas.php")
        .then(() => {
          actualizarPerfilUsuario();
          inicializarCrearRecetas();
        });
      break;
    default:
      console.warn(`Acción personalizada no reconocida: ${accion}`);
  }
}

function verificarActualizacionPerfil() {
  const elementos = document.querySelectorAll('.lbl_nombre_user');
  if (elementos.length > 0 && elementos[0].textContent === 'User') actualizarPerfilUsuario();
}

// ======================== PERFIL PRO ========================
async function verificarPerfilPro() {
  try {
    console.log("🟡 Verificando perfil PRO...");
    const res = await fetch("./verificar_perfil_pro.php", {
      method: "GET",
      headers: { "Cache-Control": "no-cache" }
    });

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const data = await res.json();

    const botonPro = document.querySelector('[data-custom="crear-recetas-pro"]');
    const contenedorInicio = document.querySelector('#contenido-principal');
    const itemInicioSidebar = document.querySelector('.nav-item[data-page="pp_inicio.php"]');
    const itemNoProDieta = document.querySelector('.nav-item[data-page="/dieta_vegana/pp_no_pro_dieta.php"]');

    // 🔹 Ítems solo visibles para usuarios Premium o Standard
    const itemsSoloPro = [
      document.querySelector('.nav-item[data-page="/dieta_vegana/pp_cancelar_plan_dieta.php"]'),
      document.querySelector('.nav-item[data-page="/dieta_vegana/pp_dieta_vegana.php"]'),
      document.querySelector('.nav-item[data-page="/plan/pp_dashboard_miplan.php"]'),
      document.querySelector('.nav-item[data-page="/plan/pp_suscripcion_act.php"]')
    ];

    if (!botonPro) console.warn("⚠️ No se encontró el botón PRO");

    // ========================= SI ES PRO =========================
    if (data.pro === true) {
      console.log("✅ Usuario PRO detectado");

      // Mostrar botón PRO
      if (botonPro) {
        botonPro.style.display = "flex";
        botonPro.style.alignItems = "center";
        botonPro.style.gap = "8px";
        botonPro.addEventListener("click", async () => {
          await cargarContenido("pp_crear_recetapro.php");
        });
      }

      // 🔥 Ocultar el ítem "Inicio" de la barra lateral
      if (itemInicioSidebar) {
        itemInicioSidebar.style.display = "none";
        console.log("🚫 Ocultando 'Inicio' del sidebar para usuarios PRO");
      }

      // 🔥 Ocultar "no pro Dietas veganas"
      if (itemNoProDieta) {
        itemNoProDieta.style.display = "none";
        console.log("🚫 Ocultando 'no pro Dietas veganas' para usuarios PRO");
      }

      // 🔥 Mostrar los ítems exclusivos de usuarios PRO
      itemsSoloPro.forEach(item => {
        if (item) {
          item.style.display = "flex";
          item.style.alignItems = "center";
        }
      });

      // 🔁 Redirigir si está en inicio o sin página cargada
      const ultimaPagina = localStorage.getItem("ultimaPaginaCargada");
      if (!ultimaPagina || ultimaPagina === "pp_inicio.php") {
        console.log("➡️ Redirigiendo a página principal PRO: /plan/pp_suscripcion_act.php");
        localStorage.setItem("ultimaPaginaCargada", "/plan/pp_suscripcion_act.php");
        await cargarContenido("/plan/pp_suscripcion_act.php");
      }

      // Si el contenedor actual tiene contenido del inicio, también redirigir
      if (contenedorInicio && contenedorInicio.innerHTML.includes("pp_inicio")) {
        console.log("🚫 Reemplazando contenido de inicio por suscripción PRO");
        await cargarContenido("/plan/pp_suscripcion_act.php");
      }

    } else {
      // ========================= SI NO ES PRO =========================
      console.log("ℹ️ Usuario NO PRO → botón PRO oculto");
      if (botonPro) botonPro.style.display = "none";

      // Mostrar el ítem "Inicio"
      if (itemInicioSidebar) {
        itemInicioSidebar.style.display = "";
      }

      // 🔥 Mostrar el ítem "no pro Dietas veganas"
      if (itemNoProDieta) {
        itemNoProDieta.style.display = "flex";
        itemNoProDieta.style.alignItems = "center";
        console.log("✅ Mostrando 'no pro Dietas veganas' para usuarios sin plan");
      }

      // 🚫 Ocultar los ítems PRO
      itemsSoloPro.forEach(item => {
        if (item) item.style.display = "none";
      });

      // Si el usuario normal estaba en una página PRO, regresar al inicio
      const ultimaPagina = localStorage.getItem("ultimaPaginaCargada");
      if (ultimaPagina && ultimaPagina.startsWith("/plan/")) {
        console.log("↩️ Usuario normal → regresando a inicio");
        localStorage.setItem("ultimaPaginaCargada", "pp_inicio.php");
        await cargarContenido("pp_inicio.php");
      }
    }

  } catch (error) {
    console.error("❌ Error verificando perfil PRO:", error);
  }
}
