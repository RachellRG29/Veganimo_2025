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



