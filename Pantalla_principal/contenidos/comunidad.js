document.addEventListener('DOMContentLoaded', () => {
  const chatMensajes = document.getElementById('chat-mensajes');
  const form = document.getElementById('form-enviar-mensaje');
  const mensajeInput = document.getElementById('mensaje');

  // Función para mostrar mensajes en el contenedor
  function mostrarMensajes(mensajes) {
    chatMensajes.innerHTML = ''; // Limpia el chat

    mensajes.forEach(msg => {
      const divMensaje = document.createElement('div');
      const fecha = new Date(msg.fecha.$date).toLocaleString();

      divMensaje.classList.add('mensaje-chat'); // Puedes usar esta clase para estilos tipo WhatsApp

      divMensaje.innerHTML = `
        <p><strong>${msg.autor}</strong> <span style="font-size: 0.8em; color: #888;">[${fecha}]</span></p>
        <p>${msg.mensaje}</p>
        <hr>
      `;
      chatMensajes.appendChild(divMensaje);
    });

    // Auto-scroll hacia el fondo
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
  }

  // Cargar mensajes desde el servidor
  async function cargarMensajes() {
    try {
      const respuesta = await fetch('/Pantalla_principal/contenidos/obtener_mensajes.php');
      const mensajes = await respuesta.json();
      mostrarMensajes(mensajes);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  }

  // Enviar nuevo mensaje
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar recarga

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
        await cargarMensajes(); // Mostrar mensajes actualizados
      } else {
        console.error('❌ Error al enviar mensaje:', resultado.error);
      }
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
    }
  });

  // Cargar mensajes al iniciar y cada 5 segundos
  cargarMensajes();
  setInterval(cargarMensajes, 5000);
});