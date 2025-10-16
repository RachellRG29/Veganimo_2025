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

document.addEventListener("DOMContentLoaded", inicializarModoTema);

// ======================== EJECUTAR SCRIPTS SEGÚN PÁGINA ========================
function ejecutarScriptsPagina(pagina) {
  setTimeout(inicializarModoTema, 100); // Siempre actualizar tema

  if (pagina === "pp_inicio.php") {
  }

  if (pagina === "/plan/pp_suscripcion.php") {

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
    const menuText = trigger.querySelector("span");
    const arrow = trigger.querySelector(".ph-caret-down");

    menuText.closest('div').addEventListener("click", (e) => {
      if (e.target !== arrow) {
        selectItem(item);
        if (item.hasAttribute("data-page")) cargarContenido(item.getAttribute("data-page"));
      }
    });

    arrow.addEventListener("click", (e) => {
      e.stopPropagation();
      item.classList.toggle("open-submenu");
      selectItem(item);
      if (item.hasAttribute("data-page")) cargarContenido(item.getAttribute("data-page"));
    });
  });

  // Subitems
  subItems.forEach(subItem => {
    subItem.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentItem = subItem.closest(".has-submenu");
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
    default: console.warn(`Acción personalizada no reconocida: ${accion}`);
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
    const res = await fetch("./verificar_perfil_pro.php", { method: "GET", headers: { "Cache-Control": "no-cache" } });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const data = await res.json();

    const botonPro = document.querySelector('[data-custom="crear-recetas-pro"]');
    if (!botonPro) return console.warn("⚠️ No se encontró el botón PRO");

    if (data.pro === true) {
      botonPro.style.display = "flex";
      botonPro.style.alignItems = "center";
      botonPro.style.gap = "8px";

      botonPro.addEventListener("click", async () => {
        await cargarContenido("pp_crear_recetapro.php");
      });

      console.log("✅ Usuario PRO detectado → mostrando botón");
    } else {
      console.log("ℹ️ Usuario NO PRO → botón sigue oculto");
    }
  } catch (error) {
    console.error("❌ Error verificando perfil PRO:", error);
  }
}
