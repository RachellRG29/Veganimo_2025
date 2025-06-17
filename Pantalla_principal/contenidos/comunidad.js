function inicializarChatComunidad() {
  console.log("✅ Inicializando chat de la comunidad...");

  const chatMensajes = document.getElementById('chat-mensajes');
  const form = document.getElementById('form-enviar-mensaje');
  const mensajeInput = document.getElementById('mensaje');
  let ultimoMensajeId = null;
  const mensajesNotificados = new Set(); // Registrar mensajes ya notificados
  const mensajesVistos = new Set(); // Registrar mensajes vistos

  if (!chatMensajes || !form || !mensajeInput) {
    console.error("❌ Elementos del chat no encontrados.");
    return;
  }

  // Obtener el nombre del usuario actual
  async function obtenerNombreUsuario() {
    try {
      const res = await fetch('/Login/check_session.php');
      const data = await res.json();
      return data.display_name || 'Invitado';
    } catch {
      return 'Invitado';
    }
  }

  // Actualizar el contador de notificaciones
  function actualizarContador() {
    const contador = document.querySelector('.contador-noti');
    const point = document.querySelector('.point');
    const notificacionesNoVistas = document.querySelectorAll('.notificacion-item:not(.vista)').length;
    
    contador.textContent = notificacionesNoVistas;
    
    if (notificacionesNoVistas > 0) {
      point.style.display = 'flex';
    } else {
      point.style.display = 'none';
    }
  }

  async function mostrarMensajes(mensajes) {
    const nombreUsuario = await obtenerNombreUsuario();
    const estabaAlFinal = chatMensajes.scrollTop + chatMensajes.clientHeight >= chatMensajes.scrollHeight - 50;
    const scrollAnterior = chatMensajes.scrollTop;

    chatMensajes.innerHTML = '';

    mensajes.forEach(msg => {
      const fecha = new Date(msg.fecha.$date).toLocaleString();
      const esMio = msg.autor === nombreUsuario;
      const claseMensaje = esMio ? 'mensaje-yo' : 'mensaje-otro';

      const divMensaje = document.createElement('div');
      divMensaje.classList.add('mensaje-chat', claseMensaje);
      divMensaje.dataset.id = msg._id;

      divMensaje.innerHTML = `
        <div class="mensaje-burbuja">
          <p class="mensaje-autor"><strong>${msg.autor}</strong></p>
          <p class="mensaje-texto">${msg.mensaje}</p>
          <p class="mensaje-info"><span class="mensaje-hora">${fecha}</span></p>
        </div>
      `;

      chatMensajes.appendChild(divMensaje);
    });

    if (estabaAlFinal) {
      chatMensajes.scrollTop = chatMensajes.scrollHeight;
    } else {
      chatMensajes.scrollTop = scrollAnterior;
    }

    // Verificar si hay nuevos mensajes para notificar
    if (mensajes.length > 0) {
      const ultimoMensaje = mensajes[mensajes.length - 1];
      
      // Solo notificar si:
      // 1. No es del usuario actual
      // 2. No ha sido notificado antes
      if (ultimoMensaje.autor !== nombreUsuario && !mensajesNotificados.has(ultimoMensaje._id)) {
        mostrarNotificacionChat(ultimoMensaje);
        mensajesNotificados.add(ultimoMensaje._id); // Registrar como notificado
      }
      
      ultimoMensajeId = ultimoMensaje._id;
    }
  }

  function mostrarNotificacionChat(mensaje) {
    const btnNotificacion = document.getElementById('btn-notificacion');
    
    // Verificar si las notificaciones están activadas
    const notificacionesActivadas = localStorage.getItem('notificaciones_activadas') === 'si';
    const chatNotificacionesActivadas = localStorage.getItem('chat_notificaciones_activadas') !== 'no';

    if (notificacionesActivadas && chatNotificacionesActivadas) {
      const modal = document.getElementById('modal_notificacion');
      const notificacionesContainer = modal.querySelector('.contenedor-notificaciones');
      
      // Crear notificación en el modal
      const nuevaNotificacion = document.createElement('div');
      nuevaNotificacion.className = 'notificacion-item nueva';
      nuevaNotificacion.dataset.tipo = 'chat';
      nuevaNotificacion.dataset.mensajeId = mensaje._id; // Identificador único
      nuevaNotificacion.innerHTML = `
        <div class="contenido-notificacion">
          <h3 class="notificacion-titulo">Nuevo mensaje en el chat</h3>
          <p class="notificacion-descripcion">
            <strong>${mensaje.autor}:</strong> ${mensaje.mensaje.substring(0, 50)}${mensaje.mensaje.length > 50 ? '...' : ''}
          </p>
          <small class="notificacion-hora">Visto: ${new Date().toLocaleTimeString()}</small>
        </div>
      `;
      
      // Marcar como vista si ya fue vista antes
      if (mensajesVistos.has(mensaje._id)) {
        nuevaNotificacion.classList.add('vista');
      }
      
      // Evento para marcar como vista al hacer clic
      nuevaNotificacion.addEventListener('click', () => {
        if (!nuevaNotificacion.classList.contains('vista')) {
          nuevaNotificacion.classList.add('vista');
          mensajesVistos.add(mensaje._id);
          actualizarContador();
        }
      });
      
      // Insertar al principio
      notificacionesContainer.insertBefore(nuevaNotificacion, notificacionesContainer.firstChild);
      
      // Actualizar estado del modal
      const mensajeVacio = modal.querySelector('.mensaje-sin-notificaciones');
      mensajeVacio.classList.add('oculto');
      
      // Actualizar contador
      actualizarContador();
      
      // Mostrar notificación aunque el modal no esté abierto
      if (!modal.classList.contains('active')) {
        // Pequeña animación para llamar la atención
        btnNotificacion.style.transform = 'scale(1.1)';
        setTimeout(() => {
          btnNotificacion.style.transform = 'scale(1)';
        }, 300);
      }
    }
  }

  async function cargarMensajes() {
    try {
      const resp = await fetch('/Pantalla_principal/contenidos/obtener_mensajes.php');
      const mensajes = await resp.json();
      await mostrarMensajes(mensajes);
    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mensaje = mensajeInput.value.trim();
    if (!mensaje) return;

    const formData = new FormData();
    formData.append('mensaje', mensaje);

    try {
      const resp = await fetch('/Pantalla_principal/contenidos/insertar_mensaje.php', {
        method: 'POST',
        body: formData
      });
      const resultado = await resp.json();

      if (resultado.success) {
        mensajeInput.value = '';
        await cargarMensajes();
      } else {
        console.error('❌ Error al enviar mensaje:', resultado.error);
      }
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
    }
  });

  // Iniciar y recargar cada 3 segundos
  cargarMensajes();
  setInterval(cargarMensajes, 3000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarChatComunidad);