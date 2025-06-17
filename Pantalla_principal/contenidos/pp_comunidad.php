<!-- pp_comunidad.php -->
<section class="section_comunidad">

    <!-- Notificación+perfil usuario -->
    <div class="contenedor-perfil-notificacion">
      <!-- Notificación -->
      <div class="grupo_notificacion">
        <div id="btn-notificacion" class="notification_loader" style="display: flex; cursor: pointer;"> 
          <svg
            viewBox="0 0 24 24"
            fill="none"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            class="w-6 h-6 text-gray-800 dark:text-white"
          >
            <path
              d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke="currentColor"
            ></path>
          </svg>
          <div class="point"><span class="contador-noti">1</span></div>
        </div>

        <!-- MODAL Notificación -->
        <div id="modal_notificacion" class="modal_notificacion">
          <!-- Contenedor de notificaciones -->
          <div class="notificacion-item">
            <div class="contenido-notificacion">
              <h3 class="notificacion-titulo">¡Tienes una nueva receta disponible!</h3>
              <p class="notificacion-descripcion">
                Explora las nuevas recetas veganas que hemos añadido esta semana.
              </p>
            </div>
          </div>

          <!-- Mensaje si no hay notificaciones -->
          <div class="mensaje-sin-notificaciones oculto">
            <p class="notificacion-descripcion" style="text-align: center;">No tienes notificaciones disponibles.</p>
          </div>
          <!-- Botón para cambiar la configuración -->
          <div id="configuracion-notificaciones" style="text-align: center; margin-top: 10px;">
            <button id="toggle-notificaciones" style="font-size: 13px; background: none; border: none; color: #1a7f5a; cursor: pointer;">
              Desactivar notificaciones
            </button>
          </div>
        </div>

 
      </div>

      <!-- Tarjeta menu perfil nutricional -->
      <div class="tarjeta_menu">
        <!-- Tarjeta usuario del perfil -->
        <div class="tarjeta-perfil" id="tarj_perfil_user">
          <h2 class="lbl_nombre_user">User</h2>  
          <div class="circulo_perfil">
            <img src="../Images/img_sinperfilusuario.png" alt="" class="img_perfil">
          </div>
        </div>

        <!-- Menu perfil popup -->
        <div class="menu_perfil" id="menu_popup" style="display: none;">
          <ul>
            <li><a href="/Perfil_nutricional/crear_perfil_nutric.html" id="btn_crear_perfil">Crear perfil nutricional </a></li>
            <li>
              <a href="#" class="pop-cerrar-sesion">Cerrar sesión 
                <i class="ph ph-sign-out" style="font-size: 18px; position: relative; bottom: -4px;"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

  <div id="chat-comunidad" class="chat-container">
    <div id="chat-mensajes" class="mensajes"></div>

    <form id="form-enviar-mensaje">
      <input type="text" id="mensaje" name="mensaje" placeholder="Escribe tu mensaje..." autocomplete="off" required>
      <button type="submit">Enviar</button>
    </form>
  </div>
</section>







 