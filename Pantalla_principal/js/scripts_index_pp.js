//Código JavaScript para la pantalla principal de la aplicación :3
async function cargarContenido(pagina) {
  console.log("📥 Solicitando:", `/Pantalla_principal/contenidos/${pagina}`);
  
  try {
    const response = await fetch(`/Pantalla_principal/contenidos/${pagina}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.text();
    console.log("✅ Contenido recibido");
    
    document.getElementById("contenido-principal").innerHTML = data;
    aplicarEstilosFondo(pagina);
    await actualizarPerfilUsuario();
    ejecutarScriptsPagina(pagina);
    
    return true;
  } catch (error) {
    console.error('⚠️ Error al cargar contenido:', error);
    mostrarErrorCarga();
    return false;
  }
}

//Actualiza la información del perfil del usuario en toda la aplicación
async function actualizarPerfilUsuario() {
  try {
    let nombreUsuario = localStorage.getItem('userDisplayName');
    const elementosNombre = document.querySelectorAll('.lbl_nombre_user, .lbl_user_bienvenida, .nombre-usuario-header');
    
    if (!nombreUsuario) {
      const sessionData = await verificarSesion();
      if (sessionData.logged_in) {
        nombreUsuario = sessionData.display_name;
        localStorage.setItem('userDisplayName', nombreUsuario);
      } else {
        redirigirALogin();
        return;
      }
    }
    
    elementosNombre.forEach(el => {
      el.textContent = nombreUsuario;
    });
    
  } catch (error) {
    console.error('Error actualizando perfil:', error);
  }
}

// Verifica el estado de la sesión en el servidor
async function verificarSesion() {
  const response = await fetch('/Login/check_session.php');
  if (!response.ok) throw new Error('Error verificando sesión');
  return await response.json();
}


//Verifica el rol del usuario y muestra/oculta elementos de admin
async function verificarRolUsuario() {
  try {
    const response = await fetch('/Login/check_session.php');
    if (!response.ok) throw new Error('Error verificando sesión');
    const data = await response.json();
    
    // Mostrar/ocultar elementos de admin
    const adminElements = document.querySelectorAll('[data-admin-only]');
    const isAdmin = data.role === 'admin';
    
    adminElements.forEach(el => {
      el.style.display = isAdmin ? '' : 'none';
    });
    
    return data.role;
  } catch (error) {
    console.error('Error verificando rol:', error);
    return 'user'; // Por defecto
  }
}

 //Aplica estilos de fondo según la página cargada
function aplicarEstilosFondo(pagina) {
  const paginasVerdes = ["pp_inicio.php", "pp_mi_plan.html","pp_crear_recetas.html"];
  document.getElementById("contenido-principal").style.backgroundColor = 
    paginasVerdes.includes(pagina) ? "#007848" : "#F6FFFE";
}

 //Ejecuta scripts específicos para cada página

function ejecutarScriptsPagina(pagina) {
  if (pagina === "crear-recetas.html") {
    inicializarCrearRecetas();
  }

  if (pagina === "pp_recetas.php") {
    setTimeout(() => {
      if (typeof cargarRecetas === 'function') {
        cargarRecetas();
      } else {
        console.error("❌ La función cargarRecetas no está definida.");
      }
    }, 100);
  }

}


 //* Inicializa la funcionalidad de "Crear Recetas"

function inicializarCrearRecetas() {
  console.log("Inicializando creación de recetas...");
  //agregar toda la lógica específica para crear recetas
}

function mostrarErrorCarga() {
  const contenido = document.getElementById("contenido-principal");
  contenido.innerHTML = `
    <div class="error-carga">
      <h2>⚠️ Error al cargar el contenido</h2>
      <p>Por favor, intenta nuevamente más tarde</p>
      <button onclick="location.reload()">Reintentar</button>
    </div>
  `;
  contenido.style.backgroundColor = "#F6FFFE";
}

function redirigirALogin() {
  console.log("Redirigiendo a login...");
  window.location.href = '/Login/login.html';
}

function scrollToSection(sectionName) {
  const section = document.querySelector(`.${sectionName}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Inicialización de la aplicación
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

  // Configurar items con submenú
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

  // Configurar subitems
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

  // Configurar items sin submenú (incluyendo "Crear Recetas")
  navItems.forEach(item => {
    if (!item.classList.contains("has-submenu")) {
      item.addEventListener("click", () => {
        itemsConSubmenu.forEach(i => i.classList.remove("open-submenu"));
        selectItem(item);
        
        // Manejar tanto data-page como data-custom
        if (item.hasAttribute("data-page")) {
          cargarContenido(item.getAttribute("data-page"));
        } else if (item.hasAttribute("data-custom")) {
          manejarAccionPersonalizada(item.getAttribute("data-custom"));
        }
      });
    }
  });

  // Manejar parámetros de URL
const params = new URLSearchParams(window.location.search);
const seccion = params.get('seccion');
const ultimaPagina = localStorage.getItem('ultimaPaginaCargada');
let paginaInicial = "pp_inicio.php"; // Default

if (seccion === 'recetas') {
  paginaInicial = "pp_recetas.php";
} else if (seccion === 'informate') {
  paginaInicial = "pp_informate.html";
} else if (ultimaPagina) {
  paginaInicial = ultimaPagina;
}

// Buscar y marcar el ítem correspondiente como activo
const navItem = [...document.querySelectorAll('.nav-item')].find(item =>
  item.getAttribute('data-page') === paginaInicial
);
if (navItem) {
  navItem.classList.add('active', 'highlight');
  if (navItem.closest('.has-submenu')) {
    navItem.closest('.has-submenu').classList.add('open-submenu');
  }
}

cargarContenido(paginaInicial);


});

 //* Maneja acciones personalizadas como "Crear Recetas"
function manejarAccionPersonalizada(accion) {
  switch(accion) {
    case 'crear-recetas':
      console.log("Iniciando creación de recetas...");
      cargarContenido("pp_crear_recetas.html")
        .then(() => {
          // Actualización específica para crear recetas
          actualizarPerfilUsuario();
          inicializarCrearRecetas();
        });
      break;
    default:
      console.warn(`Acción personalizada no reconocida: ${accion}`);
  }
}

// Nueva función para verificar y forzar actualización
function verificarActualizacionPerfil() {
  const elementos = document.querySelectorAll('.lbl_nombre_user');
  if (elementos.length > 0 && elementos[0].textContent === 'User') {
    actualizarPerfilUsuario();
  }
}

// Modifica cargarContenido para incluir verificación
async function cargarContenido(pagina) {
  console.log("📥 Solicitando:", `/Pantalla_principal/contenidos/${pagina}`);
  
  try {
    const response = await fetch(`/Pantalla_principal/contenidos/${pagina}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.text();
    console.log("✅ Contenido recibido");
    
    document.getElementById("contenido-principal").innerHTML = data;
    aplicarEstilosFondo(pagina);
    
    // Actualización inmediata
    await actualizarPerfilUsuario();
    
    // Verificación adicional después de un breve retraso
    setTimeout(verificarActualizacionPerfil, 300);
    
    ejecutarScriptsPagina(pagina);
    
    localStorage.setItem('ultimaPaginaCargada', pagina);

    return true; 

  } catch (error) {
    console.error('⚠️ Error al cargar contenido:', error);
    mostrarErrorCarga();
    return false;
  }
}