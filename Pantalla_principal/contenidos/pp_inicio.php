<?php
session_start();

// Ruta corregida al archivo de configuración
require_once __DIR__ . '/../../misc/db_config.php';

$perfilExistente = false;

if (isset($_SESSION['user_id'])) {
    try {
        $query = new MongoDB\Driver\Query(['user_id' => $_SESSION['user_id']]);
        $cursor = $cliente->executeQuery('Veganimo.Perfil_nutricional', $query);
        $perfil = current($cursor->toArray());
        $perfilExistente = $perfil ? true : false;
    } catch (Exception $e) {
        $perfilExistente = false;
    }
}
?>

<div class="menu_perfil" id="menu_popup" style="display: none;">
    <ul>
        <?php if ($perfilExistente): ?>
            <li><a href="/Perfil_nutricional/perfil_nutricional.html">Perfil nutricional</a></li>
        <?php else: ?>
            <li><a href="/Perfil_nutricional/crear_perfil_nutric.html" id="btn_crear_perfil">Crear perfil nutricional</a></li>
        <?php endif; ?>

        <li>
            <a href="#" class="pop-cerrar-sesion">
                Cerrar sesión 
                <i class="ph ph-sign-out" style="font-size: 18px; position: relative; bottom: -4px;"></i>
            </a>
        </li>
    </ul>
</div>


<!-- pp_inicio.php y css: styles_pp_inicio.css -->
<section class="section_inicio">
    <h1 class="lbl_bienvenida_vg">Bienvenido a Vegánimo 🌱</h1>
    <!-- <p class="lbl_user_bienvenida"> Usuario </p> -->

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


    <!-- INICIAR PLAN  -->
    <div class="iniciar_plan">
        <div class="tarjeta_inic_plan">
            <div class="contenido_tarj_plan">
                <div class="circulo_plan">
                    <img src="../Images/libro_receta_vegana.png" alt="" class="img_tarj_plan">
                </div>
                
                <h2 class="titulo_tarj_plan">¡Hola! ¿Listo para empezar?</h2>
                <p class="descripcion_tarj_plan">Antes de arrancar con tu vida vegana, 
                    cuentanos un poco sobre ti. <br>
                    Comparte tus datos nutricionales y 
                    armamos un plan que se adapte a ti. <br>
                    ¡Así te conocemos mejor y te hechamos una mano desde el día uno!
                </p>

               <!-- <button class="btn_iniciar_plan"> Iniciar plan 
                    <i class="ph ph-caret-right" 
                    style="font-size: 24px;"></i>
                </button> -->

            </div>
        </div>
    </div>
    <br><br>



</section>

<script src="/Pantalla_principal/js/pp_inicio.js"></script>

<!--
    <div class="contenedor_recomendaciones">
             GRID DE LA TARJETAS DE RECOMENDACIONES/contenedor en cuadriculas 
        <h1 class="lbl_recomendaciones">Recomendaciones</h1>
        <div class="grid-container-recomendaciones">
            
         Diseño de tarjeta de receta oficial
          <div class="tarjeta-receta">
            <div class="circulo-img">
            <img src="../Images/img_plato_sf_p3.png" alt="Imagen del plato" class="img-plato">
          </div>
          <div class="body-tarjeta">
            <h2 class="title-tarjeta">nombre de receta</h2>
            <p class="descripcion-tarjeta">descripción</p>
            <p class="categoria-tarjeta" 
            style=" color: #F6FFFE; 
            font-weight: bold; 
            text-align: center;
            background-color: #154734;
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;">
            Categoría: Vegano</p>

            <div class="estrellas_vot">
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
            </div>

            <div class="datos-receta">
              <div class="tiempo-receta">
                <p style="font-weight: bold;">Tiempo de preparación</p>
                <div class="grupo_tiempo">
                  <i class="ph ph-timer" style="font-size: 24px;"></i>
                  <p class="lbl_tiempo_receta">30 minutos</p>
                </div>
              </div>

              <div class="linea-datos"></div>

              <div class="dificultad-receta">
                <p style="font-weight: bold;">Dificultad</p>
                <div class="grupo_dif">
                  <i class="ph ph-square-fill" style="font-size: 24px; color: green;background-color: white; border: 1px; border-radius: 3px;"></i>
                  <p class="lbl_dificultad">alta</p>
                </div>
              </div>
            </div>
          </div>

          </div>

        Diseño de tarjeta de receta oficial
          <div class="tarjeta-receta">
            <div class="circulo-img">
            <img src="../Images/img_plato_sf_p3.png" alt="Imagen del plato" class="img-plato">
          </div>
          <div class="body-tarjeta">
            <h2 class="title-tarjeta">nombre de receta</h2>
            <p class="descripcion-tarjeta">descripción</p>
            <p class="categoria-tarjeta" 
            style=" color: #F6FFFE; 
            font-weight: bold; 
            text-align: center;
            background-color: #154734;
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;">
            Categoría: Vegano</p>

            <div class="estrellas_vot">
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
            </div>

            <div class="datos-receta">
              <div class="tiempo-receta">
                <p style="font-weight: bold;">Tiempo de preparación</p>
                <div class="grupo_tiempo">
                  <i class="ph ph-timer" style="font-size: 24px;"></i>
                  <p class="lbl_tiempo_receta">30 minutos</p>
                </div>
              </div>

              <div class="linea-datos"></div>

              <div class="dificultad-receta">
                <p style="font-weight: bold;">Dificultad</p>
                <div class="grupo_dif">
                  <i class="ph ph-square-fill" style="font-size: 24px; color: green;background-color: white; border: 1px; border-radius: 3px;"></i>
                  <p class="lbl_dificultad">alta</p>
                </div>
              </div>
            </div>
          </div>

          </div>

          <!-- Diseño de tarjeta de receta oficial
          <div class="tarjeta-receta">
            <div class="circulo-img">
            <img src="../Images/img_plato_sf_p3.png" alt="Imagen del plato" class="img-plato">
          </div>
          <div class="body-tarjeta">
            <h2 class="title-tarjeta">nombre de receta</h2>
            <p class="descripcion-tarjeta">descripción</p>
            <p class="categoria-tarjeta" 
            style=" color: #F6FFFE; 
            font-weight: bold; 
            text-align: center;
            background-color: #154734;
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;">
            Categoría: Vegano</p>

            <div class="estrellas_vot">
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
              <i class="ph ph-star" style="font-size: 24px;"></i>
            </div>

            <div class="datos-receta">
              <div class="tiempo-receta">
                <p style="font-weight: bold;">Tiempo de preparación</p>
                <div class="grupo_tiempo">
                  <i class="ph ph-timer" style="font-size: 24px;"></i>
                  <p class="lbl_tiempo_receta">30 minutos</p>
                </div>
              </div>

              <div class="linea-datos"></div>

              <div class="dificultad-receta">
                <p style="font-weight: bold;">Dificultad</p>
                <div class="grupo_dif">
                  <i class="ph ph-square-fill" style="font-size: 24px; color: green;background-color: white; border: 1px; border-radius: 3px;"></i>
                  <p class="lbl_dificultad">alta</p>
                </div>
              </div>
            </div>
          </div>

          </div>

   
        </div>  fin de grid-container 


    </div>-->