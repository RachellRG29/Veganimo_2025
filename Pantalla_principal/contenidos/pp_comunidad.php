<!-- pp_comunidad.php -->
<section class="section_comunidad">
  <h1 class="lbl_bienvenida_vg">Bienvenido a Chat Comunidad Veganimo 🌱</h1>

    <!-- Notificación+perfil usuario -->
    <div class="contenedor-perfil-notificacion">
      <!-- Notificación -->
      <div class="grupo_notificacion">
        <div id="btn-notificacion" class="notification_loader" style="display: flex; cursor: pointer;">      
          <svg class="logo_bell_campana" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 89.1 107.79">
              <g>
                <path class="cls-1" d="M49.4,101.61H24.7c-1.7,0-3.09,1.38-3.09,3.09s1.39,3.09,3.09,3.09h24.7c1.71,0,3.09-1.39,3.09-3.09s-1.38-3.09-3.09-3.09Z"/>
                <path class="cls-1" d="M89.1,7.03c-.52,8.9-5,17.48-12.93,22.93-5.71,3.94-12.31,5.62-18.73,5.23,6.43,5.66,10.49,13.95,10.49,23.19,0,13.64,3.19,24.08,5.33,27.77,.55,.94,.84,2.01,.84,3.1,0,3.41-2.76,6.18-6.17,6.18H6.17c-1.09,0-2.16-.29-3.1-.84-2.95-1.72-3.94-5.5-2.23-8.44,2.15-3.69,5.33-14.13,5.33-27.77s9.66-26.25,22.78-29.81c-1.36-.99-2.6-2.19-3.67-3.6-4.02-5.28-4.66-12.08-2.28-17.78,6.14-.79,12.52,1.63,16.54,6.9,3.16,4.15,4.24,9.22,3.4,13.97,1.12,.22,2.22,.49,3.29,.83,.33-9.14,4.83-18.02,12.96-23.62C67.12-.18,76.75-1.3,85.24,1.42c1.03,1.51-7.56,9.21-11.32,11.91,3.86-2.55,14.12-7.81,15.18-6.3Z"/>
              </g>
          </svg>

          <div class="point"><span class="contador-noti">1</span></div>
        </div>

        <!-- MODAL Notificación -->
        <div id="modal_notificacion" class="modal_notificacion">
          <!-- Contenedor de notificaciones -->
          <div class="contenedor-notificaciones">
            <!-- Las notificaciones se agregarán aquí dinámicamente -->
          </div>

          <!-- Mensaje si no hay notificaciones -->
          <div class="mensaje-sin-notificaciones">
            <p class="notificacion-descripcion" style="text-align: center;">No tienes notificaciones disponibles.</p>
          </div>
          
          <!-- Botón para cambiar la configuración -->
          <div id="configuracion-notificaciones" style="text-align: center; margin-top: 10px;">
            <button id="toggle-notificaciones" style="font-size: 13px; background: none; border: none; color: #1a7f5a; cursor: pointer;">
              Desactivar notificaciones
            </button>
            <button id="toggle-chat-notificaciones" style="font-size: 13px; background: none; border: none; color: #1a7f5a; cursor: pointer; margin-left: 10px;">
              Desactivar notificaciones del chat
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
<form id="form-enviar-mensaje" style="display: flex; flex-direction: column; gap: 5px;">
  <div style="display: flex; gap: 10px; align-items: center;">
   <div class="inputGroup">
  <input 
    type="text" 
    id="mensaje" 
    name="mensaje" 
    required 
    autocomplete="off"
  />
  <label for="mensaje">Escribe tu mensaje...</label>
</div>

    <button 
      type="submit" 
      id="btn-enviar"
      style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
    >
      Enviar
    </button>
  </div>
  <small 
    id="error-mensaje" 
    style="color: red; display: none; margin-top: 0; font-size: 0.8em; padding-left: 5px;"
  ></small>
</form>
    <button id="btn-ir-abajo" class="boton-ir-abajo" title="Ir al final">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12l7 7 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>


  </div>
</section>







 