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


//--------------------  VERIFICAR EL ROL DEL USUARIO Y MUESTRA/OCULTAR ELEMENTOS DE ADMIN---------------------//
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

 //--------------------------- ESTILOS DE LA PANTALLA PRINCIPAL -----------------------------//
function aplicarEstilosFondo(pagina) {
  const paginasVerdes = ["pp_inicio.php", "pp_mi_plan.html", "pp_comunidad.php","pp_crear_receta.php"];
  document.getElementById("contenido-principal").style.backgroundColor = 
    paginasVerdes.includes(pagina) ? "#007848" : "#F6FFFE";
}

 /* --------------------------------------- INICIALIZAR LOS SCRIPTS DE LA PANTALLA PRINCIPAL ------------------------------------------- */

function ejecutarScriptsPagina(pagina) {

  if (pagina === "pp_inicio.php") {
    preguntarActivarNotificaciones();
    
    inicializarNotificaciones(); 
  }

  if (pagina === "pp_crear_receta.php") {
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

  if (pagina === "pp_comunidad.php") {
    // Aquí solo llamamos la función que está en comunidad.js
    inicializarChatComunidad();
  }

}

/* --------------------------------------------------- INICIALIZA LA NOTIFICACIÓN ------------------------------------------------------*/
//Pregunta al usuario si desea activar las notificaciones
function preguntarActivarNotificaciones() {
  const btnNotificacion = document.getElementById('btn-notificacion');
  const estado = localStorage.getItem('notificaciones_activadas');

  if (estado === 'si') {
    btnNotificacion.style.display = 'flex';
    activarLoader(true);
    return;
  }

  if (estado === 'no') {
    btnNotificacion.style.display = 'flex'; // No ocultar el botón nunca
    activarLoader(false);
    return;
  }

  // Pregunta inicial
  const desea = confirm('¿Deseas activar las notificaciones?');

  if (desea) {
    localStorage.setItem('notificaciones_activadas', 'si');
    btnNotificacion.style.display = 'flex';
    activarLoader(true);
  } else {
    localStorage.setItem('notificaciones_activadas', 'no');
    btnNotificacion.style.display = 'flex'; // Mostrar siempre
    activarLoader(false);
  }
}

// Función que activa o desactiva el parpadeo del loader y el puntito verde
function activarLoader(activar) {
  const btnNotificacion = document.getElementById('btn-notificacion');
  const point = btnNotificacion.querySelector('.point');
  const contador = point.querySelector('.contador-noti');

  if (activar) {
    // Mostrar el punto y el contador si hay valor
    const valor = parseInt(contador.textContent.trim());
    if (valor > 0) {
      point.style.display = 'flex';
    } else {
      point.style.display = 'none';
    }
  } else {
    // Ocultar el punto por completo
    point.style.display = 'none';
  }
}



// Inicializa notificaciones y eventos
function inicializarNotificaciones() {
  const btnNotificacion = document.getElementById('btn-notificacion');
  const modal = document.getElementById('modal_notificacion');
  const mensajeVacio = modal.querySelector('.mensaje-sin-notificaciones');
  const toggleBtn = document.getElementById('toggle-notificaciones');

  // Actualiza visibilidad de mensaje vacío según notificaciones
  function actualizarContenidoModal() {
    const notis = modal.querySelectorAll('.notificacion-item');
    const hayNotis = notis.length > 0;
    mensajeVacio.classList.toggle('oculto', hayNotis);
  }

  function actualizarContadorNotificaciones(numero) {
    const contador = document.querySelector('.contador-noti');
    if (contador) {
      contador.textContent = numero > 0 ? numero : '';
      document.querySelector('.point').style.display = numero > 0 ? 'flex' : 'none';
    }
  }

  // Abre o cierra el modal
  function toggleModal() {
    modal.classList.toggle('active');
    actualizarContenidoModal();
    actualizarTextoToggle();
  }

  // Cierra el modal
  function cerrarModal() {
    modal.classList.remove('active');
  }

  // Actualiza texto del botón toggle según estado
  function actualizarTextoToggle() {
    const estado = localStorage.getItem('notificaciones_activadas');
    toggleBtn.textContent = (estado === 'si') ? 'Desactivar notificaciones' : 'Activar notificaciones';
  }

  // Evento toggle para activar o desactivar notificaciones
  toggleBtn.addEventListener('click', () => {
    const estado = localStorage.getItem('notificaciones_activadas');
    if (estado === 'si') {
      localStorage.setItem('notificaciones_activadas', 'no');
      activarLoader(false);
      cerrarModal();
    } else {
      localStorage.setItem('notificaciones_activadas', 'si');
      activarLoader(true);
    }
    actualizarTextoToggle();
  });

  // Evento para abrir/cerrar modal al hacer click en el botón de notificación
  btnNotificacion.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleModal();
  });

  // Cerrar modal al hacer click fuera del modal o del botón
  document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && !btnNotificacion.contains(e.target)) {
      cerrarModal();
    }
  });

  // Inicialización visual según estado guardado
  const estadoInicial = localStorage.getItem('notificaciones_activadas');
  if (estadoInicial === 'si') {
    activarLoader(true);
  } else {
    activarLoader(false);
  }
  actualizarContenidoModal();
  actualizarTextoToggle();
}

// Cuando cargue la página, pregunta al usuario y luego inicializa
window.addEventListener('DOMContentLoaded', () => {
  preguntarActivarNotificaciones();
  inicializarNotificaciones();
  actualizarContadorNotificaciones(1);
});



 //--------------------- Inicializa la funcionalidad de "Crear Recetas" --------------------- //

function inicializarCrearRecetas() {
  console.log("✅ Inicializando creación de recetas...");
  iniciarValidacionCrearReceta();
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
let ultimaPagina = localStorage.getItem('ultimaPaginaCargada');
let paginaInicial = "pp_inicio.php"; // Default por defecto

if (seccion === 'recetas') {
  paginaInicial = "pp_recetas.php";
} else if (seccion === 'informate') {
  paginaInicial = "pp_informate.html";
} else if (ultimaPagina) {
  // Evitar mostrar "Crear Recetas" si no tiene permisos
  const esCrearReceta = ultimaPagina === "pp_crear_receta.php";
  try {
    const sessionData = await verificarSesion();
    const esAdmin = sessionData.role === 'admin';
    
    if (esCrearReceta && !esAdmin) {
      paginaInicial = "pp_inicio.php";
      localStorage.setItem('ultimaPaginaCargada', paginaInicial);
    } else {
      paginaInicial = ultimaPagina;
    }
  } catch (error) {
    console.warn("No logueado o error de sesión. Restableciendo a inicio.");
    paginaInicial = "pp_inicio.php";
    localStorage.setItem('ultimaPaginaCargada', paginaInicial);
  }
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
      cargarContenido("pp_crear_recetas.php")
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

/* --------------------------------------------CARGAR CONTENIDO DE PANTALLA PRINCIPAL --------------------------------------------*/
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