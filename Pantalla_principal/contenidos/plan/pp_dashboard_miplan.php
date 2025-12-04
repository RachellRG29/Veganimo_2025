<?php
require_once __DIR__ . '/../../../misc/db_config.php';
include_once __DIR__ . '/../menu_perfil.php';

// ================================================
//  FUNCIÓN OBTENER PLANES DE DIETA
// ================================================
$arrayPlanesDieta = [];
$planIdSeleccionado = $_GET['plan_id'] ?? null;

try {

    if (!isset($cliente) || !$cliente instanceof MongoDB\Driver\Manager) {
        throw new Exception("Conexión a MongoDB no válida.");
    }

    // Filtro seguro
    if ($planIdSeleccionado) {
        $filtro = ['_id' => new MongoDB\BSON\ObjectId($planIdSeleccionado)];
    } else {
        $filtro = []; // Obtener todos
    }

    $query = new MongoDB\Driver\Query($filtro);
    $cursor = $cliente->executeQuery("Veganimo.Planes_Dieta", $query);

    $planesDieta = [];

    foreach ($cursor as $documento) {
        $planesDieta[] = [
            "id" => isset($documento->_id) ? (string) $documento->_id : '',
            "nombre" => $documento->nombre ?? '',
            "tipo" => $documento->tipo ?? '',
            "calorias" => $documento->calorias ?? 0,
            "fecha_creacion" => $documento->fecha_creacion ?? '',
            "duracion_dias" => $documento->duracion_dias ?? 0
        ];
    }

    // Usar solo el primero si existen
    if (!empty($planesDieta)) {
        $arrayPlanesDieta = [$planesDieta[0]];
    }

} catch (Exception $e) {
    // Evitar romper el dashboard
    $arrayPlanesDieta = [];
}

// ================================================
//  FALLBACK SI NO HAY PLANES
// ================================================
if (empty($arrayPlanesDieta)) {
    $arrayPlanesDieta = [
        [
            "id" => "sin-id",
            "nombre" => "Sin plan",
            "tipo" => "N/A",
            "calorias" => 0,
            "fecha_creacion" => "",
            "duracion_dias" => 0
        ]
    ];
}
?>

<section class="section_mi_plan">
  <div class="lbl_bienvenida_plan_dash">
    <h1 class="lbl_titulo_dash">Mi plan 🌱</h1>
    <p class="lbl_user_nivel">Nivel: Transicionista</p>
  </div>

  <!-- ----------------------------------------------------------------------------- -->
  <div class="dashboard_plan">

    <!-- 1️⃣ Plan Nutricionista -->
    <div class="div_dash1">
      <div class="header_plan">
        <h2 class="titulo_plan">Plan Nutricionista</h2>
        <span class="etiqueta_plan"><?php echo $tienePlan ? 'Plan IA Personalizado' : 'Plan premium/estándar'; ?></span>

        <div class="contenedor-racha">
          <span class="lbl-racha">Racha</span>
          <div class="racha-space">
            <img src="/Images/" class="img-racha-veg" alt="">
          </div>
        </div>
      </div>

      <span class="lbl-subtitulo-dash">Tu plan de dieta está organizado por horarios</span>
      
      <?php if (!$tienePlan): ?>
        <!-- Sin plan - Mostrar estado por defecto -->
        <div class="recetas_contenedor">  
          <div class="tarjeta_receta tipo_desay">
            <img src="/Images/fondo_pu_oscuro.png" alt="Desayuno" class="img_receta">
            <span class="etiqueta_letra">D</span>
            <p class="nombre_receta">Desayuno</p>
            <button class="btn-ver-mas-dash ver-mas" id="btn-desayuno">Crear plan 
              <i class="ph ph-magic-wand" id="estado-receta"></i>
            </button>
          </div>

          <div class="tarjeta_receta tipo_almue">
            <img src="/Images/fondo_pu_oscuro.png" alt="Almuerzo" class="img_receta">
            <span class="etiqueta_letra">A</span>
            <p class="nombre_receta">Almuerzo</p>
            <button class="btn-ver-mas-dash ver-mas" id="btn-almuerzo">Pendiente
              <i class="ph ph-clock-afternoon" id="estado-receta"></i>
            </button>
          </div>

          <div class="tarjeta_receta tipo_cena">
            <img src="/Images/fondo_pu_oscuro.png" alt="Cena" class="img_receta">
            <span class="etiqueta_letra">C</span>
            <p class="nombre_receta">Cena</p>
            <button class="btn-ver-mas-dash ver-mas" id="btn-cena">Pendiente 
              <i class="ph ph-clock-afternoon" id="estado-receta"></i>
            </button>     
          </div>
        </div>
      <?php else: ?>
        <!-- Con plan - Mostrar recetas generadas por IA -->
        <div class="recetas_contenedor" id="recetas-contenedor">
          <!-- Desayuno -->
          <div class="tarjeta_receta tipo_desay" data-receta="desayuno">
            <?php if (isset($recetas['desayuno']['imagen']) && $recetas['desayuno']['imagen']): ?>
              <img src="<?php echo htmlspecialchars($recetas['desayuno']['imagen']); ?>" alt="<?php echo htmlspecialchars($recetas['desayuno']['nombre'] ?? 'Desayuno'); ?>" class="img_receta">
            <?php else: ?>
              <img src="/Images/fondo_pu_oscuro.png" alt="Desayuno" class="img_receta">
            <?php endif; ?>
            <span class="etiqueta_letra">D</span>
            <p class="nombre_receta"><?php echo htmlspecialchars($recetas['desayuno']['nombre'] ?? 'Desayuno'); ?></p>
            <button class="btn-ver-mas-dash ver-mas btn-ver-receta" data-tipo="desayuno" data-receta='<?php echo json_encode($recetas['desayuno'] ?? []); ?>'>
              <?php echo ($planData['completadas']['desayuno'] ?? false) ? 'Completado' : 'Ver más'; ?>
              <i class="ph ph-arrow-circle-right" id="estado-receta"></i>
            </button>
          </div>

          <!-- Almuerzo -->
          <div class="tarjeta_receta tipo_almue" data-receta="almuerzo">
            <?php if (isset($recetas['almuerzo']['imagen']) && $recetas['almuerzo']['imagen']): ?>
              <img src="<?php echo htmlspecialchars($recetas['almuerzo']['imagen']); ?>" alt="<?php echo htmlspecialchars($recetas['almuerzo']['nombre'] ?? 'Almuerzo'); ?>" class="img_receta">
            <?php else: ?>
              <img src="/Images/fondo_pu_oscuro.png" alt="Almuerzo" class="img_receta">
            <?php endif; ?>
            <span class="etiqueta_letra">A</span>
            <p class="nombre_receta"><?php echo htmlspecialchars($recetas['almuerzo']['nombre'] ?? 'Almuerzo'); ?></p>
            <button class="btn-ver-mas-dash ver-mas btn-ver-receta" data-tipo="almuerzo" data-receta='<?php echo json_encode($recetas['almuerzo'] ?? []); ?>'>
              <?php echo ($planData['completadas']['almuerzo'] ?? false) ? 'Completado' : 'Ver más'; ?>
              <i class="ph ph-arrow-circle-right" id="estado-receta"></i>
            </button>
          </div>

          <!-- Cena -->
          <div class="tarjeta_receta tipo_cena" data-receta="cena">
            <?php if (isset($recetas['cena']['imagen']) && $recetas['cena']['imagen']): ?>
              <img src="<?php echo htmlspecialchars($recetas['cena']['imagen']); ?>" alt="<?php echo htmlspecialchars($recetas['cena']['nombre'] ?? 'Cena'); ?>" class="img_receta">
            <?php else: ?>
              <img src="/Images/fondo_pu_oscuro.png" alt="Cena" class="img_receta">
            <?php endif; ?>
            <span class="etiqueta_letra">C</span>
            <p class="nombre_receta"><?php echo htmlspecialchars($recetas['cena']['nombre'] ?? 'Cena'); ?></p>
            <button class="btn-ver-mas-dash ver-mas btn-ver-receta" data-tipo="cena" data-receta='<?php echo json_encode($recetas['cena'] ?? []); ?>'>
              <?php echo ($planData['completadas']['cena'] ?? false) ? 'Completado' : 'Ver más'; ?>
              <i class="ph ph-arrow-circle-right" id="estado-receta"></i>
            </button>
          </div>
        </div>
      <?php endif; ?>

      <?php if ($tienePlan): ?>
        <div class="barra_y_calorias">
          <div class="barra_contenedor">
            <?php 
              $totalComidas = 3;
              $completadas = 0;
              if (isset($planData['completadas'])) {
                foreach ($planData['completadas'] as $completa) {
                  if ($completa) $completadas++;
                }
              }
              $porcentaje = ($completadas / $totalComidas) * 100;
            ?>
            <div class="barra_progreso" style="width:<?php echo $porcentaje; ?>%;"></div>
          </div>
          <span class="porcentaje"><?php echo round($porcentaje); ?>%</span>
          <span class="calorias">Progreso diario</span>
        </div>
      <?php else: ?>
        <div class="sin-plan" style="text-align: center; margin-top: 20px; padding: 20px; background: #F5F7FA; border-radius: 15px;">
          <h3 style="color: #007848;">¡No tienes un plan activo!</h3>
          <p style="color: #555;">Crea tu plan personalizado con IA para comenzar.</p>
          <button onclick="window.location.href='contenidos/dieta_vegana/IA/pp_ia_dieta_vegana.php'" 
                  style="background: #007848; color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; margin-top: 10px;">
            <i class="ph ph-magic-wand"></i> Crear Plan con IA
          </button>
        </div>
      <?php endif; ?>
    </div>

    <!-- 2️⃣ Calendario -->
    <div class="div_dash2">
      <div class="calendario_titulo">
        <h3 id="mes_cald_dash">Octubre 2025</h3>
        <div class="calendario_nav">
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>

      <div class="calendario">
        <div class="dias">
          <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
        </div>
        <div class="numeros">
          <span>1</span><span>2</span><span>3</span><span class="naranja_estado">4</span><span>5</span><span class="verde_estado">6</span><span>7</span>
          <span>8</span><span class="verde_estado">9</span><span class="amarillo_estado">10</span><span>11</span><span>12</span><span>13</span><span>14</span>
          <span>15</span><span class="verde_estado">16</span><span>17</span><span>18</span><span class="rojo_estado">19</span><span>20</span><span>21</span>
          <span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span class="naranja_estado">27</span><span>28</span>
          <span>29</span><span class="verde_estado">30</span><span>31</span>
        </div>
      </div>

      <div class="btn-guia-container">
        <button class="btn-guia">Ver guía</button>
      </div>

      <!-- POPUP DE GUÍA -->
      <div class="popup_guia" id="popupGuia">
        <div class="popup_contenido">
          <!-- Botón cerrar en esquina superior derecha -->
          <button class="cerrar_popup_x">×</button>
          
          <h3>Guía de colores</h3>

          <ul class="guia_colores">
            <li><span class="color_guia amarillo"></span>Receta fácil</li>
            <li><span class="color_guia verde"></span>Receta saludable</li>
            <li><span class="color_guia naranja"></span>Receta intermedia</li>
            <li><span class="color_guia rojo"></span>Receta avanzada</li>
          </ul>
        </div>
      </div>
    </div>
    
     <!-- 3️⃣ Recetas según tus ingredientes -->
    <div class="div_dash3">
        <div class="contenido_div3">
            <h3 class="subtitulo_div3">Recetas según tus ingredientes</h3>
            <p class="texto_tarjeta">“Ingresa lo que tienes en casa y genera recetas”</p>
            <button class="btn_crear_receta">Crear receta</button>
        </div>
    </div>

    <!-- 4️⃣ Ingredientes según tus gustos -->
    <div class="div_dash4">
        <div class="contenido_div4">
            <h3 class="subtitulo_div4">Ingredientes según tus gustos</h3>
            <p class="texto_tarjeta">“Ingresa los ingredientes de tu preferencia y lo adaptaremos a tus gustos”</p>
            <button class="btn_ingresar_gustos">Ingresar</button>
        </div>
    </div>

    <!-- 5️⃣ Contador y frase motivacional -->
    <div class="div_dash5 nuevo_contador">
      <div class="contador_superior">
        <span class="lbl_contador_titulo">Contador</span>
        <span class="lbl_tiempo">Tiempo restante</span>
        <span class="lbl_dias">230 días</span>
      </div>

      <p class="frase_veg">
        El veganismo no es solo una forma de alimentarse, es un camino hacia la salud,
        la compasión y un planeta mejor.
      </p>
    </div>

     <!-- 6️⃣ Disclaimer -->
    <div class="div_dash6 disclaimer_total_pantalla">
      <span class="lbl_plan_auto">Plan automatizado</span>

      <div class="contenido_disclaimer">
        <div class="gif_container">
          <img src="/Images/gif/alerta.gif" alt="Gif vegano" class="gif_disclaimer">
        </div>

        <p class="disclaimer">
          Esta aplicación brinda orientación general y no sustituye el consejo médico o nutricional profesional.  
          <br><br>Un estilo de vida vegano equilibrado puede requerir suplementos como Vitamina B12,
          Vitamina D, Omega-3, Hierro o Calcio según tus necesidades individuales.
        </p>
      </div>
    </div>

  </div>


  <!-- MODALES -->
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Modal de recetas segun desayuno/almuerzo/cena -->
  <div id="modal-receta-plan" class="modal-receta-plan oculto">
    <div class="modal-contenido-plan">
      
      <!-- Header del modal -->
      <div class="modal-header-plan">
        <h2 id="modal-titulo-plan">Recetas del Plan</h2>
        <button id="cerrar-modal-plan" class="btn-cerrar-modal-plan">×</button>
      </div>

      <!-- Contenido principal -->
      <div class="modal-body-plan">
        
        <!-- Información general -->
        <div class="info-receta-plan">
          <div class="imagen-receta-plan">
            <img id="modal-imagen-plan" src="/Images/fondo_pu_oscuro.png" alt="Imagen receta" />
              <div class="badge-tipo-comida" id="badge-tipo-comida">
                <span id="letra-tipo-comida" class="letra-tipo">D</span>
              </div>
          </div>
          
          <div class="detalles-receta-plan">
            <h3 id="modal-nombre-receta">Nombre de la Receta</h3>
            <p id="modal-descripcion-plan">Descripción de la receta...</p>
            
            <div class="meta-info-plan">
              <div class="meta-item">
                <span class="icono">⏱️</span>
                <span id="modal-tiempo-plan">15 min</span>
              </div>
              <div class="meta-item">
                <i class="ph ph-fork-knife"></i>
                <span id="modal-dificultad-plan">Fácil</span>
              </div>
              <div class="meta-item">
                <span class="icono">🔥</span>
                <span id="modal-calorias-plan">250 cal</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ingredientes -->
        <div class="seccion-ingredientes">
          <h3 class="subtitulo-seccion">Ingredientes</h3>
          <ul id="modal-ingredientes-plan" class="lista-ingredientes">
            <!-- Los ingredientes se cargarán aquí -->
          </ul>
        </div>

        <!-- Preparación -->
        <div class="seccion-preparacion">
          <h3 class="subtitulo-seccion">Preparación</h3>
          <ol id="modal-pasos-plan" class="lista-pasos">
            <!-- Los pasos se cargarán aquí -->
          </ol>
        </div>

        <!-- Estado de la receta -->
        <div class="estado-receta-plan">
          <div class="badge-estado" id="badge-estado-receta">
            <i class="ph ph-check-circle"></i>
            <span>Disponible</span>
          </div>
          <button class="btn-empezar-receta" id="btn-empezar-receta">
            Marcar como Completada
          </button>
        </div>

      </div>
    </div>
  </div>

  <!-- ----------------------------------------------------------------------------- -->
  <!-- Modal de ingredientes según casa -->
  <div id="modal-ingredientes-casa" class="modal-ingredientes-casa oculto">
    <div class="modal-contenido-ingredientes">
      
      <!-- Header del modal -->
      <div class="modal-header-ingredientes">
        <h2>Recetas según tus ingredientes</h2>
        <button id="cerrar-modal-ingredientes" class="btn-cerrar-modal-ingredientes">×</button>
      </div>

      <!-- Contenido principal -->
      <div class="modal-body-ingredientes">
        
        <!-- Instrucción -->
        <p class="instruccion-ingredientes">Selecciona los ingredientes que tienes en casa</p>

        <!-- Layout de dos columnas -->
        <div class="contenedor-columnas">
          
          <!-- Columna izquierda - Categorías -->
          <div class="columna-categorias">
            <div class="categorias-ingredientes">
              
              <!-- Vegetales -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Vegetales</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="tomate"><span class="checkmark"></span>Tomate</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="lechuga"><span class="checkmark"></span>Lechuga</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="zanahoria"><span class="checkmark"></span>Zanahoria</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="cebolla"><span class="checkmark"></span>Cebolla</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="pimiento"><span class="checkmark"></span>Pimiento</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="brocoli"><span class="checkmark"></span>Brócoli</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="espinaca"><span class="checkmark"></span>Espinaca</label>
                </div>
              </div>

              <!-- Frutas -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Frutas</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="pera"><span class="checkmark"></span>Pera</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="mango"><span class="checkmark"></span>Mango</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="platano"><span class="checkmark"></span>Plátano</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="manzana"><span class="checkmark"></span>Manzana</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="naranja"><span class="checkmark"></span>Naranja</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="fresa"><span class="checkmark"></span>Fresa</label>
                </div>
              </div>

              <!-- Legumbres -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Legumbres</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="lentejas"><span class="checkmark"></span>Lentejas</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="garbanzos"><span class="checkmark"></span>Garbanzos</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="frijoles"><span class="checkmark"></span>Frijoles</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="soja"><span class="checkmark"></span>Soja</label>
                </div>
              </div>

              <!-- Cereales y Granos -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Cereales y Granos</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="arroz"><span class="checkmark"></span>Arroz</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="avena"><span class="checkmark"></span>Avena</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="quinoa"><span class="checkmark"></span>Quinoa</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="trigo"><span class="checkmark"></span>Trigo</label>
                </div>
              </div>

              <!-- Semillas y Nueces -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Semillas y Nueces</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="almendras"><span class="checkmark"></span>Almendras</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="nueces"><span class="checkmark"></span>Nueces</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="chia"><span class="checkmark"></span>Chía</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="linaza"><span class="checkmark"></span>Linaza</label>
                </div>
              </div>

              <!-- Proteínas Vegetales -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Proteínas Vegetales</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="tofu"><span class="checkmark"></span>Tofu</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="tempeh"><span class="checkmark"></span>Tempeh</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="seitan"><span class="checkmark"></span>Seitán</label>
                </div>
              </div>

              <!-- Carnes Vegetales -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Carnes Vegetales</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="hamburguesa_vegana"><span class="checkmark"></span>Hamburguesa Vegana</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="salchicha_vegana"><span class="checkmark"></span>Salchicha Vegana</label>
                </div>
              </div>

              <!-- Lácteos Veganos -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Lácteos Veganos</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="leche_almendras"><span class="checkmark"></span>Leche de Almendras</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="leche_soja"><span class="checkmark"></span>Leche de Soja</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="yogur_vegano"><span class="checkmark"></span>Yogur Vegano</label>
                </div>
              </div>

              <!-- Condimentos y Salsas -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Condimentos y Salsas</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="salsa_soja"><span class="checkmark"></span>Salsa de Soja</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="vinagre"><span class="checkmark"></span>Vinagre</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="aceite_oliva"><span class="checkmark"></span>Aceite de Oliva</label>
                </div>
              </div>

              <!-- Tubérculos -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Tubérculos</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="papa"><span class="checkmark"></span>Papa</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="camote"><span class="checkmark"></span>Camote</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="yuca"><span class="checkmark"></span>Yuca</label>
                </div>
              </div>

              <!-- Panes y Harinas -->
              <div class="categoria-grupo">
                <div class="categoria-header">
                  <h3 class="titulo-categoria">Panes y Harinas</h3>
                  <span class="categoria-flecha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-checkbox">
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="pan_integral"><span class="checkmark"></span>Pan Integral</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="harina_avena"><span class="checkmark"></span>Harina de Avena</label>
                  <label class="checkbox-item"><input type="checkbox" name="ingrediente" value="harina_almendra"><span class="checkmark"></span>Harina de Almendra</label>
                </div>
              </div>

            </div>
          </div>

          <!-- Columna derecha - Ingredientes seleccionados -->
          <div class="columna-seleccionados">
            <div class="ingredientes-seleccionados">
              <h3 class="titulo-seleccionados">Seleccionados</h3>
              <div id="lista-seleccionados" class="lista-seleccionados">
                <!-- Los ingredientes seleccionados aparecerán aquí -->
              </div>
            </div>
          </div>

        </div>

        <!-- Botón de acción EN FOOTER FIJO -->
        <div class="acciones-modal-ingredientes">
          <button class="btn-guardar-ingredientes" id="btn-guardar-ingredientes">
            Guardar
          </button>
        </div>

      </div>
    </div>
  </div>

  <!-- ----------------------------------------------------------------------------- -->
  <!-- Modal de preferencias de ingredientes -->
  <div id="modal-preferencias-ingredientes" class="modal-preferencias-ingredientes oculto">
    <div class="modal-contenido-preferencias">
      
      <!-- Header del modal -->
      <div class="modal-header-preferencias">
        <h2>Preferencias de Ingredientes</h2>
        <button id="cerrar-modal-preferencias" class="btn-cerrar-modal-preferencias">×</button>
      </div>

      <!-- Contenido principal -->
      <div class="modal-body-preferencias">
        
        <!-- Instrucción -->
        <p class="instruccion-preferencias">Selecciona qué ingredientes te gustan o no te gustan</p>

        <!-- Layout de dos columnas -->
        <div class="contenedor-columnas-preferencias">
          
          <!-- Columna izquierda - Categorías -->
          <div class="columna-categorias-preferencias">
            <div class="categorias-preferencias">
              
              <!-- Vegetales -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Vegetales</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="tomate">
                    <span class="nombre-ingrediente">Tomate</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="lechuga">
                    <span class="nombre-ingrediente">Lechuga</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="zanahoria">
                    <span class="nombre-ingrediente">Zanahoria</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="cebolla">
                    <span class="nombre-ingrediente">Cebolla</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="pimiento">
                    <span class="nombre-ingrediente">Pimiento</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Frutas -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Frutas</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="fresa">
                    <span class="nombre-ingrediente">Fresa</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="kiwi">
                    <span class="nombre-ingrediente">Kiwi</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="guinea">
                    <span class="nombre-ingrediente">Guinea</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="manzana">
                    <span class="nombre-ingrediente">Manzana</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="naranja">
                    <span class="nombre-ingrediente">Naranja</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Legumbres -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Legumbres</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="lentejas">
                    <span class="nombre-ingrediente">Lentejas</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="garbanzos">
                    <span class="nombre-ingrediente">Garbanzos</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="frijoles">
                    <span class="nombre-ingrediente">Frijoles</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cereales y Granos -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Cereales y Granos</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="arroz">
                    <span class="nombre-ingrediente">Arroz</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="avena">
                    <span class="nombre-ingrediente">Avena</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="quinoa">
                    <span class="nombre-ingrediente">Quinoa</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Semillas y Nueces -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Semillas y Nueces</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="almendras">
                    <span class="nombre-ingrediente">Almendras</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="nueces">
                    <span class="nombre-ingrediente">Nueces</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="chia">
                    <span class="nombre-ingrediente">Chía</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Proteínas Vegetales -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Proteínas Vegetales</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="tofu">
                    <span class="nombre-ingrediente">Tofu</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="tempeh">
                    <span class="nombre-ingrediente">Tempeh</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="seitan">
                    <span class="nombre-ingrediente">Seitán</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Carnes Vegetales -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Carnes Vegetales</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="hamburguesa_vegana">
                    <span class="nombre-ingrediente">Hamburguesa Vegana</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="salchicha_vegana">
                    <span class="nombre-ingrediente">Salchicha Vegana</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lácteos Veganos -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Lácteos Veganos</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="leche_almendras">
                    <span class="nombre-ingrediente">Leche de Almendras</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="leche_soja">
                    <span class="nombre-ingrediente">Leche de Soja</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="yogur_vegano">
                    <span class="nombre-ingrediente">Yogur Vegano</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Condimentos y Salsas -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Condimentos y Salsas</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="salsa_soja">
                    <span class="nombre-ingrediente">Salsa de Soja</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="vinagre">
                    <span class="nombre-ingrediente">Vinagre</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="aceite_oliva">
                    <span class="nombre-ingrediente">Aceite de Oliva</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tubérculos -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Tubérculos</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="papa">
                    <span class="nombre-ingrediente">Papa</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="camote">
                    <span class="nombre-ingrediente">Camote</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="yuca">
                    <span class="nombre-ingrediente">Yuca</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Panes y Harinas -->
              <div class="categoria-grupo-preferencias">
                <div class="categoria-header-preferencias">
                  <h3 class="titulo-categoria-preferencias">Panes y Harinas</h3>
                  <span class="categoria-flecha-preferencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                  </span>
                </div>
                <div class="lista-ingredientes-preferencias">
                  <div class="ingrediente-item" data-ingrediente="pan_integral">
                    <span class="nombre-ingrediente">Pan Integral</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="harina_avena">
                    <span class="nombre-ingrediente">Harina de Avena</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                  <div class="ingrediente-item" data-ingrediente="harina_almendra">
                    <span class="nombre-ingrediente">Harina de Almendra</span>
                    <div class="botones-preferencia">
                      <button class="btn-preferencia btn-like" data-preferencia="like">👍</button>
                      <button class="btn-preferencia btn-dislike" data-preferencia="dislike">👎</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Columna derecha - Resumen de preferencias -->
          <div class="columna-resumen-preferencias">
            <div class="resumen-preferencias">
              <h3 class="titulo-resumen">Tus Preferencias</h3>
              <div class="contenedor-resumen">
                <div class="resumen-gustos">
                  <h4 class="subtitulo-resumen">Me gustan</h4>
                  <div id="lista-gustos" class="lista-resumen">
                    <!-- Los ingredientes que gustan aparecerán aquí -->
                  </div>
                </div>
                <div class="resumen-disgustos">
                  <h4 class="subtitulo-resumen">No me gustan</h4>
                  <div id="lista-disgustos" class="lista-resumen">
                    <!-- Los ingredientes que no gustan aparecerán aquí -->
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Botón de acción EN FOOTER FIJO -->
        <div class="acciones-modal-preferencias">
          <button class="btn-guardar-preferencias" id="btn-guardar-preferencias">
            Guardar
          </button>
        </div>

      </div>
    </div>
  </div>

</section>