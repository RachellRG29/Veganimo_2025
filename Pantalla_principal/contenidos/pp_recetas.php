<?php include_once __DIR__ . '/menu_perfil.php'; 
 require_once __DIR__ . '/auth_middleware.php';?>


<html>
<head>
  <meta charset="UTF-8">
  <title>Recetas | Vegánimo</title>
  <link rel="stylesheet" href="../Pagina_Principal/css/styles_pp_inicio.css">
  <script src="https://unpkg.com/phosphor-icons"></script>

</head>

  <section class="section_recetas_pp">
    <!-- Contenedor de la barra de búsqueda -->
    <div class="busqueda-conteiner">
      <div class="busqueda-recetas">
        <!-- Barra de búsqueda y categorías -->
        <div class="input-busq-recetas">
          <input type="text" placeholder="Buscar recetas..." class="input_busqueda">
          <i class="ph ph-magnifying-glass"></i>
        </div>

        <div class="input-busq-categoria">
          <select name="categoria" id="categoria-recetas">
            <option value="todos" selected>Todos</option>
            <option value="transicionista">Transicionista</option>
            <option value="vegetariano">Vegetariano</option>
            <option value="vegano">Vegano</option>
          </select>
        </div>
      </div>


      

    </div>

    <!-- Notificación+perfil usuario -->
    <div class="contenedor-perfil-notificacion">
      <!-- Notificación -->
      <div class="grupo_notificacion" style="display: none;">
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

    



      </div>
    </div>

    <h1 class="lbl_title_recetas">Recetas generales de Vegánimo 🌱</h1>

    <!-- Contenedor de tarjetas de recetas -->
    <div class="grid-container-recetas" id="contenedor-recetas">
      <!-- Aquí se insertan las tarjetas dinámicamente -->
    </div>

    <!--  Modal de receta -->
    <div id="modal-receta" class="modal-receta oculto">
      <div class="modal-contenido">

        <!-- BLOQUE 0: Botón cerrar -->
        <div class="bloque-cerrar">
          <button id="cerrar-modal" class="btn-cerrar-modal">×</button>
        </div>

        <!-- BLOQUE 1: Información general -->
        <div class="bloque1">
          <!-- Columna izquierda -->
          <div class="col1">
            <h2 id="modal-titulo"><div class="linea"></div></h2>
            
            <p id="modal-descripcion" class="descripcion"></p>

            <div class="categoria-modal" id="modal-categoria"></div>
            <div class="tipo-modal" id="modal-tipo"></div>

            <div class="info-final">
              <div class="tiempo">
                <p class="subti-info">Tiempo de preparación:</p>
                <div class="valor-horizontal">
                  <span class="icono">⏱️</span>
                  <span id="modal-tiempo"></span>
                  <span id="modal-tiempo-unidad"></span>
                </div>
              </div>

              <div class="dificultad">
                <p class="subti-info">Dificultad:</p>
                <div class="valor-horizontal">
                  <i id="icono-dificultad" class="ph ph-square-fill"></i>
                  <span id="modal-dificultad" class="lbl_dificultad"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha -->
          <div class="col2">
            <div class="contenedor-imagen-verde">
              <img id="modal-imagen" src="" alt="Imagen receta" />
              <div id="modal-estrellas" class="estrellas-votacion"></div>
            </div>
          </div>
        </div>

        <!-- BLOQUE 2: Ingredientes -->
        <div class="bloque2">
          <h3 class="subtitulo-bloque corto">Ingredientes:</h3>
          <ul id="modal-ingredientes"></ul>
        </div>

        <!-- BLOQUE 3: Pasos -->
        <div class="bloque3">
          <h3 class="subtitulo-bloque corto">Pasos:</h3>
          <ol id="modal-pasos"></ol>
        </div>
      </div>
    </div>
    
  <script>
      window.addEventListener('pageshow', function(event) {
          if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
              // Si se accede desde el caché (por botón atrás), forzar recarga
              window.location.reload();
          }
      });
  </script>


  </section>

</html>





  <!-- Tarjeta no found 
  <div class="tarjeta-recip">
    <div class="imagen-superior">
      <img src="../Images/card_not_found0.jpg" alt="Imagen receta no disponible">
      <div class="icono-error">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2"/>
          <line x1="12" y1="7" x2="12" y2="13" stroke="#fff" stroke-width="2"/>
          <circle cx="12" cy="17" r="1.5" fill="#fff"/>
        </svg>
      </div>
    </div>

    <div class="contenido-recip">
      <h2 class="titulo-recip">Receta no encontrada</h2>
      <p class="desc-recip">
        No pudimos encontrar la receta que estás buscando.<br><br>  Intenta cnuevamente.
      </br>
    </div>
  </div>
-->

    <!-- 
css:
<style>
    .modal-receta {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.3s ease;
      opacity: 1;
    }

    .modal-receta.oculto {
      display: none !important;
      opacity: 0;
    }

    .modal-contenido {
      background: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }

    .btn-cerrar-modal {
      position: absolute;
      top: 10px;
      right: 20px;
      background-color: #ff4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-cerrar-modal:hover {
      background-color: #cc0000;
    }

    .modal-contenido img {
      width: 100%;
      border-radius: 10px;
      margin-bottom: 15px;
    }
  </style>

----------------------------------------------------------------------------
    Modal de receta 
    <div id="modal-receta" class="modal-receta oculto">
      <div class="modal-contenido">
        <button id="cerrar-modal" class="btn-cerrar-modal">Cerrar</button>
        <h2 id="modal-titulo"></h2>
        <div id="modal-estrellas" class="estrellas_vot" style="margin-bottom: 10px;"></div>
        <img id="modal-imagen" src="" alt="Imagen receta" />
        <p id="modal-descripcion"></p>
        <p><strong>Tiempo de preparación:</strong> <span id="modal-tiempo"></span></p>
        <p><strong>Dificultad:</strong> <span id="modal-dificultad"></span></p>
        <p><strong>Categoría:</strong> <span id="modal-categoria"></span></p>
        <h3>Ingredientes:</h3>
        <ul id="modal-ingredientes"></ul>
        <h3>Pasos:</h3>
        <ol id="modal-pasos"></ol>
      </div>
    </div>

    -->