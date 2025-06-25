console.log("✅ chat_comunidad.js cargado correctamente");

// ==============================
// CONFIGURACIÓN DE PALABRAS PROHIBIDAS
// ==============================
const palabrasProhibidas = [
  'mierda', 'puta', 'puto', 'put@', 'estúpido', 'estupido', 'tonto', 'idiota',
  'imbécil', 'imbecil', 'pendejo', 'maldito', 'perra', 'cabron', 'chingada',
  'coño', 'culero', 'cabrón', 'verga', 'huevón', 'gilipollas', 'cerote',
  'chucho', 'puchica', 'maje', 'baboso', 'bolo', 'vergo', 'vergon', 'pijudo',
  'vergazo', 'hijueputa', 'hijuep', 'hijoep', 'vergonada', 'nalga', 'nalgas',
  'verguero', 'malacate',

  // Variaciones
  'p*ta', 'p_u_t_a', 'p-u-t-a', 'p.u.t.a', 'p4ta', 'pvt4', 'm1erda', '3stupido',

  // Inglés
  'fuck', 'shit', 'asshole', 'bitch', 'cunt', 'dick', 'pussy', 'whore', 'slut',

  // Inapropiado
  'lll', 'porn', 'porno', 'sexo', 'sex', 'nude', 'desnudo',
];

const patronesProhibidos = [
  /(c|k|q)(a|4)(b|v)(r)(o|0)(n|ñ)/i,
  /(p|b)(u|v)(t|7)(a|4)/i,
  /(m|n)(i|1|!)(e|3)(r)(d|b)(a|4)/i,
  /(h|j)(i|1)(j|h)(u|v)(e|3)(p|b)(u|v)(t|7)(a|4)/i,
  /(v|b)(e|3)(r)(g|6)(a|4)/i
];

// ==============================
// VALIDACIÓN DE MENSAJES
// ==============================
function validarMensaje(mensaje) {
  const mensajeLimpio = mensaje.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const palabras = mensajeLimpio.split(/\s+/);
  if (palabras.some(p => palabrasProhibidas.includes(p)))
    return { valido: false, razon: "El mensaje contiene vocabulario inapropiado" };

  if (patronesProhibidos.some(p => p.test(mensajeLimpio)))
    return { valido: false, razon: "El mensaje contiene variaciones de palabras prohibidas" };

  if (/(.)\1{4,}/.test(mensajeLimpio))
    return { valido: false, razon: "El mensaje contiene repeticiones excesivas" };

  if (/https?:\/\/|www\.|\.com|\.net|\.org/i.test(mensaje))
    return { valido: false, razon: "No se permiten enlaces en los mensajes" };

  return { valido: true };
}

// ==============================
// INICIALIZACIÓN DEL CHAT
// ==============================
function inicializarChatComunidad() {
  console.log("✅ Inicializando chat de la comunidad...");

  const chatMensajes = document.getElementById('chat-mensajes');
  const btnIrAbajo = document.getElementById('btn-ir-abajo');
  const form = document.getElementById('form-enviar-mensaje');
  const mensajeInput = document.getElementById('mensaje');
  const imagenInput = document.getElementById('imagen');
  const errorDiv = document.getElementById('error-mensaje');
  const mensajesNotificados = new Set();
  const mensajesVistos = new Set();
  let ultimoMensajeId = null;
  let usuarioAcabaDeEnviar = false;

  if (!chatMensajes || !form || !mensajeInput) {
    console.error("❌ Elementos del chat no encontrados.");
    return;
  }


const previewModal = document.getElementById('preview-modal');
const previewImg = document.getElementById('preview-img');
const cerrarPreview = document.getElementById('cerrar-preview');
const btnAdjuntar = document.getElementById('btn-adjuntar');

// Mostrar imagen flotante justo arriba del botón
imagenInput.addEventListener('change', function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      const rect = btnAdjuntar.getBoundingClientRect();

      // Posiciona justo arriba del botón
      previewModal.style.top = `${window.scrollY + rect.top - 110}px`; // 100px + margen
      previewModal.style.left = `${window.scrollX + rect.left}px`;
      previewModal.classList.remove('oculto');
    };
    reader.readAsDataURL(file);
  } else {
    previewModal.classList.add('oculto');
    previewImg.src = '';
  }
});

// Cierra manualmente
cerrarPreview.addEventListener('click', () => {
  previewModal.classList.add('oculto');
  previewImg.src = '';
  imagenInput.value = '';
});


  function verificarBotonIrAbajo() {
    const estaAbajo = chatMensajes.scrollTop + chatMensajes.clientHeight >= chatMensajes.scrollHeight - 50;
    btnIrAbajo.style.display = estaAbajo ? 'none' : 'flex';
  }

  async function obtenerNombreUsuario() {
    try {
      const res = await fetch('/Login/check_session.php');
      const data = await res.json();
      if (!data.logged_in) {
        window.location.href = '/Login/login.html';
        return;
      }
      return data.display_name || 'Usuario';
    } catch (error) {
      console.error('Error al obtener nombre de usuario:', error);
      window.location.href = '/Login/login.html';
    }
  }

  async function mostrarMensajes(mensajes) {
  const usuario = await obtenerNombreUsuario();
  const alFinal = chatMensajes.scrollTop + chatMensajes.clientHeight >= chatMensajes.scrollHeight - 50;
  const scrollPrevio = chatMensajes.scrollTop;
  chatMensajes.innerHTML = '';

  const baseUrl = 'http://localhost:8000';
  mensajes.forEach(msg => {
    const fecha = new Date(msg.fecha.$date).toLocaleString();
    const esMio = msg.autor === usuario;
    const clase = esMio ? 'mensaje-yo' : 'mensaje-otro';

    const imagenHTML = msg.imagen_url ? 
      `<img src="${baseUrl}${msg.imagen_url}" class="imagen-chat" style="max-width: 200px; border-radius: 6px; margin-top: 5px;">` : '';

    const div = document.createElement('div');
    div.classList.add('mensaje-chat', clase);
    div.dataset.id = msg._id;

    div.innerHTML = `
      <div class="mensaje-burbuja">
        <p class="mensaje-autor"><strong>${msg.autor}</strong></p>
        ${msg.mensaje ? `<p class="mensaje-texto">${msg.mensaje}</p>` : ''}
        ${imagenHTML}
        <p class="mensaje-info"><span class="mensaje-hora">${fecha}</span></p>
      </div>
    `;

    chatMensajes.appendChild(div);
  });

  if (usuarioAcabaDeEnviar) {
  const imagenes = Array.from(chatMensajes.querySelectorAll('img'));
  if (imagenes.length > 0) {
    let pendientes = imagenes.filter(img => !img.complete);
    if (pendientes.length === 0) {
      requestAnimationFrame(() => {
        chatMensajes.scrollTop = chatMensajes.scrollHeight;
        usuarioAcabaDeEnviar = false;
      });
    } else {
      let cargadas = 0;
      pendientes.forEach(img => {
        img.onload = img.onerror = () => {
          cargadas++;
          if (cargadas === pendientes.length) {
            requestAnimationFrame(() => {
              chatMensajes.scrollTop = chatMensajes.scrollHeight;
              usuarioAcabaDeEnviar = false;
            });
          }
        };
      });
    }
  } else {
    requestAnimationFrame(() => {
      chatMensajes.scrollTop = chatMensajes.scrollHeight;
      usuarioAcabaDeEnviar = false;
    });
  }
} else if (alFinal) {
  chatMensajes.scrollTop = chatMensajes.scrollHeight;
} else {
  chatMensajes.scrollTop = scrollPrevio;
}

}


  function mostrarNotificacionChat(mensaje) {
    const modal = document.getElementById('modal_notificacion');
    const container = modal.querySelector('.contenedor-notificaciones');
    const btnNoti = document.getElementById('btn-notificacion');

    const notificacionesActivadas = localStorage.getItem('notificaciones_activadas') === 'si';
    const chatNotificaciones = localStorage.getItem('chat_notificaciones_activadas') !== 'no';

    if (!(notificacionesActivadas && chatNotificaciones)) return;

    const div = document.createElement('div');
    div.className = 'notificacion-item nueva';
    div.dataset.tipo = 'chat';
    div.dataset.mensajeId = mensaje._id;
    div.innerHTML = `
      <div class="contenido-notificacion">
        <h3 class="notificacion-titulo">Nuevo mensaje en el chat</h3>
        <p class="notificacion-descripcion">
          <strong>${mensaje.autor}:</strong> ${mensaje.mensaje?.substring(0, 50) ?? '[Imagen]'}
        </p>
        <small class="notificacion-hora">Visto: ${new Date().toLocaleTimeString()}</small>
      </div>
    `;

    if (mensajesVistos.has(mensaje._id)) div.classList.add('vista');

    div.addEventListener('click', () => {
      if (!div.classList.contains('vista')) {
        div.classList.add('vista');
        mensajesVistos.add(mensaje._id);
        actualizarContador();
      }
    });

    container.prepend(div);
    modal.querySelector('.mensaje-sin-notificaciones')?.classList.add('oculto');
    actualizarContador();

    if (!modal.classList.contains('active')) {
      btnNoti.style.transform = 'scale(1.1)';
      setTimeout(() => (btnNoti.style.transform = 'scale(1)'), 300);
    }
  }

  function actualizarContador() {
    const contador = document.querySelector('.contador-noti');
    const point = document.querySelector('.point');
    const noVistos = document.querySelectorAll('.notificacion-item:not(.vista)').length;
    contador.textContent = noVistos;
    point.style.display = noVistos > 0 ? 'flex' : 'none';
  }

  async function cargarMensajes() {
    try {
      const res = await fetch('/Pantalla_principal/contenidos/obtener_mensajes.php');
      const datos = await res.json();
      await mostrarMensajes(datos);
    } catch (err) {
      console.error("❌ Error cargando mensajes:", err);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mensaje = mensajeInput.value.trim();
    const imagen = imagenInput?.files?.[0];

    const tieneTexto = mensaje.length > 0;
    const tieneImagen = !!imagen;

    if (!tieneTexto && !tieneImagen) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = '⚠️ Debes enviar un mensaje o seleccionar una imagen.';
      return;
    }

previewModal.classList.add('oculto');
previewImg.src = '';



    if (tieneTexto) {
      const validacion = validarMensaje(mensaje);
      if (!validacion.valido) {
        mensajeInput.style.borderColor = 'red';
        errorDiv.style.display = 'block';
        errorDiv.textContent = `⚠️ ${validacion.razon}`;
        mensajeInput.focus();
        return;
      }
    }

    mensajeInput.style.borderColor = '';
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    const formData = new FormData();
    formData.append('mensaje', mensaje);
    if (tieneImagen) formData.append('imagen', imagen);

    try {
      const resp = await fetch('/Pantalla_principal/contenidos/insertar_mensaje.php', {
        method: 'POST',
        body: formData
      });
      const resultado = await resp.json();

      if (resultado.success) {
        mensajeInput.value = '';
        if (imagenInput) imagenInput.value = '';
        await cargarMensajes();
      } else {
        alertify.error('Error al enviar el mensaje. Inténtalo de nuevo.');
      }
    } catch (error) {
      alertify.error('Error de conexión. Inténtalo de nuevo.');
    }
  });

  chatMensajes.addEventListener('scroll', verificarBotonIrAbajo);
  btnIrAbajo.addEventListener('click', () => {
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
    btnIrAbajo.style.display = 'none';
  });

  mensajeInput.addEventListener('input', () => {
    const mensaje = mensajeInput.value.trim();
    const validacion = validarMensaje(mensaje);
    if (!validacion.valido) {
      mensajeInput.style.borderColor = 'red';
      errorDiv.style.display = 'block';
      errorDiv.textContent = `⚠️ ${validacion.razon}`;
    } else {
      mensajeInput.style.borderColor = '';
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
  });

  cargarMensajes();
  setInterval(cargarMensajes, 3000);
}

document.addEventListener('DOMContentLoaded', inicializarChatComunidad);
