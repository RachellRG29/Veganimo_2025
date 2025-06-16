function inicializarChatComunidad() {
  console.log("✅ Inicializando chat de la comunidad...");

  const chatMensajes = document.getElementById('chat-mensajes');
  const form = document.getElementById('form-enviar-mensaje');
  const mensajeInput = document.getElementById('mensaje');

  if (!chatMensajes || !form || !mensajeInput) {
    console.error("❌ Elementos del chat no encontrados.");
    return;
  }

  // Función para obtener el nombre del usuario actual
  async function obtenerNombreUsuario() {
    try {
      const res = await fetch('/Login/check_session.php');
      const data = await res.json();
      return data.display_name || 'Invitado';
    } catch {
      return 'Invitado';
    }
  }

  // Función para renderizar todos los mensajes y eliminar los que ya no están
  async function mostrarMensajes(mensajes) {
    const nombreUsuario = await obtenerNombreUsuario();

    // Limpiar el contenedor y reiniciar el registro
    chatMensajes.innerHTML = '';

    mensajes.forEach(msg => {
      const msgId = msg._id?.$oid || JSON.stringify(msg.fecha);
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

    chatMensajes.scrollTop = chatMensajes.scrollHeight;
  }

  // Cargar mensajes desde el backend
  async function cargarMensajes() {
    try {
      const resp = await fetch('/Pantalla_principal/contenidos/obtener_mensajes.php');
      const mensajes = await resp.json();
      await mostrarMensajes(mensajes);
    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
    }
  }

  // Enviar un nuevo mensaje
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
        await cargarMensajes(); // Se actualiza el chat
      } else {
        console.error('❌ Error al enviar mensaje:', resultado.error);
      }
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
    }
  });

  // Cargar mensajes iniciales y luego cada 5 segundos (sin parpadeos)
  cargarMensajes();
  setInterval(cargarMensajes, 5000);
}
