function inicializarChatComunidad() {
  console.log("✅ Inicializando chat de la comunidad...");

  const chatMensajes = document.getElementById('chat-mensajes');
  const form = document.getElementById('form-enviar-mensaje');
  const mensajeInput = document.getElementById('mensaje');

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

  // Renderizar los mensajes y mantener posición de scroll si no estás abajo
  async function mostrarMensajes(mensajes) {
    const nombreUsuario = await obtenerNombreUsuario();

    // ¿Estás al final del scroll?
    const estabaAlFinal =
      chatMensajes.scrollTop + chatMensajes.clientHeight >= chatMensajes.scrollHeight - 50;

    // Guardar scroll anterior si no estás abajo
    const scrollAnterior = chatMensajes.scrollTop;

    // Limpiar chat
    chatMensajes.innerHTML = '';

    mensajes.forEach(msg => {
      const fecha = new Date(msg.fecha.$date).toLocaleString();
      const esMio = msg.autor === nombreUsuario;
      const claseMensaje = esMio ? 'mensaje-yo' : 'mensaje-otro';

      const divMensaje = document.createElement('div');
      divMensaje.classList.add('mensaje-chat', claseMensaje);

      divMensaje.innerHTML = `
        <div class="mensaje-burbuja">
          <p class="mensaje-autor"><strong>${msg.autor}</strong></p>
          <p class="mensaje-texto">${msg.mensaje}</p>
          <p class="mensaje-info"><span class="mensaje-hora">${fecha}</span></p>
        </div>
      `;

      chatMensajes.appendChild(divMensaje);
    });

    // Scroll inteligente: solo baja si estabas abajo
    if (estabaAlFinal) {
      chatMensajes.scrollTop = chatMensajes.scrollHeight;
    } else {
      chatMensajes.scrollTop = scrollAnterior;
    }
  }

  // Cargar mensajes desde el servidor
  async function cargarMensajes() {
    try {
      const resp = await fetch('/Pantalla_principal/contenidos/obtener_mensajes.php');
      const mensajes = await resp.json();
      await mostrarMensajes(mensajes);
    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
    }
  }

  // Enviar mensaje nuevo
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

  // Iniciar y recargar cada 5 segundos
  cargarMensajes();
  setInterval(cargarMensajes, 5000);
}
