function inicializarChatComunidad() {
  console.log("✅ Inicializando chat de la comunidad...");

  const chatMensajes = document.getElementById('chat-mensajes');
  const form = document.getElementById('form-enviar-mensaje');
  const mensajeInput = document.getElementById('mensaje');
  let ultimoMensajeId = null;

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
      // 1. No es el primer mensaje (ultimoMensajeId existe)
      // 2. El mensaje es nuevo (id diferente)
      // 3. No es del usuario actual
      if ((!ultimoMensajeId || ultimoMensaje._id !== ultimoMensajeId) && 
          ultimoMensaje.autor !== nombreUsuario) {
        mostrarNotificacionChat(ultimoMensaje);
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
      // Incrementar contador
      const contador = document.querySelector('.contador-noti');
      const currentCount = parseInt(contador.textContent || '0');
      const nuevoCount = currentCount + 1;
      contador.textContent = nuevoCount;
      document.querySelector('.point').style.display = 'flex';

      // Crear notificación en el modal
      const modal = document.getElementById('modal_notificacion');
      const notificacionesContainer = modal.querySelector('.contenedor-notificaciones');
      
      const nuevaNotificacion = document.createElement('div');
      nuevaNotificacion.className = 'notificacion-item nueva';
      nuevaNotificacion.dataset.tipo = 'chat';
      nuevaNotificacion.innerHTML = `
        <div class="contenido-notificacion">
          <h3 class="notificacion-titulo">Nuevo mensaje en el chat</h3>
          <p class="notificacion-descripcion">
            <strong>${mensaje.autor}:</strong> ${mensaje.mensaje.substring(0, 50)}${mensaje.mensaje.length > 50 ? '...' : ''}
          </p>
          <small class="notificacion-hora">${new Date().toLocaleTimeString()}</small>
        </div>
      `;
      
      // Insertar al principio
      notificacionesContainer.insertBefore(nuevaNotificacion, notificacionesContainer.firstChild);
      
      // Actualizar estado del modal
      const mensajeVacio = modal.querySelector('.mensaje-sin-notificaciones');
      mensajeVacio.classList.add('oculto');
      
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