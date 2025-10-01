    <?php include_once __DIR__ . '/menu_perfil.php'; 
    require_once __DIR__ . '/auth_middleware.php';?>


<!-- SECTION INFORMATE PANTALLA PRINCIPAL -->
<section class="informate">
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
    
    
    <div class="informate-header">
        <h1>Infórmate</h1>
    </div>
  
    <!-- SECTION ACLARACION DE CONCEPTOS -->
    <section class="inf_conceptos" id="inf_conceptos">
        <div class="seccion-contenido">
            <div class="texto-contenedor">
                <h3 class="subtitulo-seccion">Aclaración de Conceptos</h3>
                <div class="contenido-textual">
                    <h4 class="titulo-contenido">Conceptos del veganismo</h4>
                    <p class="descripcion-contenido">
                        ¿Qué es el veganismo?
                        El veganismo es una filosofía y estilo de vida que busca excluir la explotación y 
                        crueldad hacia los animales en todas sus formas, ya sea para alimentación, vestimenta,
                         entretenimiento o cualquier otro propósito. Va más allá de una dieta, involucrando la elección de productos y servicios que no exploten o dañen a los animales. <br>
                        Diferencias entre vegano y vegetariano
                        Aunque ambos estilos de vida excluyen el consumo de carne, existen diferencias clave: 
                        Vegetariano: Evita el consumo de carne, pero puede incluir en su dieta productos de origen animal como leche, huevos y miel. 
                        Vegano: No consume ningún producto de origen animal y evita el uso de cualquier producto que implique explotación animal, como cuero, lana, cosméticos probados en animales, entre otros. 
                        Variantes del veganismo
                        Dentro del veganismo, existen distintas variantes que se enfocan en aspectos específicos:
                        Crudiveganismo: Excluye todos los alimentos de origen animal y además evita la cocción de los alimentos
                         a temperaturas superiores a 40°C, basándose en la creencia de que los alimentos crudos conservan mejor sus nutrientes.  
                        Frugivorismo: Es una forma más estricta de veganismo que se limita al consumo de frutas, nueces y semillas, evitando cualquier alimento que implique la muerte de la planta.
                    </p>
                </div>
            </div>
            <img src="../Images/img_inf_salud.jpg" alt="Conceptos veganismo" class="imagen-contenido">
        </div>
    </section>
  
    <!-- SECTION SALUD -->
    <section class="inf_salud" id="inf_salud">
        <div class="seccion-contenido">
            <div class="texto-contenedor">
                <h3 class="subtitulo-seccion">Salud, prevención y precauciones</h3>
                <div class="contenido-textual">
                    <h4 class="titulo-contenido"></h4>
                    <p class="descripcion-contenido">
                        Dado que se ha demostrado que la proteína animal no es estrictamente necesaria,
                        optar por una dieta o estilo de vida vegetariano o vegano es una oportunidad para 
                        explorar el gran mundo de los vegetales y dar un paso más hacia nuestra salud, los 
                        derechos animales y el bienestar de la naturaleza.
                       Es muy importante informarse bien antes de empezar una dieta vegetariana o vegana, 
                       dado hay que garantizar el aporte de los nutrientes esenciales que se han obtenido
                        hasta el momento a través de los productos animales o derivados. <br>
                       Dependiendo de lo estricta que sea la dieta que se siga, existe riesgo de padecer déficit
                        de diferentes nutrientes necesarios para el organismo. En una dieta vegana, hay que tener
                         en cuenta que puede no cubrir las necesidades nutricionales de vitamina A, vitamina B2, 
                         vitamina B12, vitamina D, hierro, zinc, calcio y omega-3 (DHA).
                       Según evidencia científica, los veganos ingieren una menor cantidad de vitamina D a través de 
                       la dieta. La concentración plasmática de 25-hidroxivitamina D (25(OH)D) total es menor en 
                       veganos, por consiguiente en las dietas veganas puede ser importante su complementación.
                       Respecto a la vitamina B12, casi todos los veganos son ya conscientes del riesgo de padecer 
                       déficit de esta vitamina, por eso su complementación es muy común y, gracias a ello, no
                        se asocia un mayor déficit de esta vitamina a los veganos.
                       Para poder obtener los beneficios que puede proporcionar la dieta vegana sin sufrir déficits 
                       nutricionales, es importante que esté bien planificada y se adapte a cada persona de manera individual para evitar la posibilidad de tener problemas de salud
                    </p>
                </div>
            </div>
            <img src="../Images/img_salud_suplementos.jpg" alt="Salud vegana" class="imagen-contenido">
        </div>
    </section>
  
    <!-- SECTION CONCIENTIZACION -->
    <section class="inf_concientizacion" id="inf_concientizacion">
        <div class="seccion-contenido">
            <div class="texto-contenedor">
                <h3 class="subtitulo-seccion">Concientización sobre el maltrato animal</h3>
                <div class="contenido-textual">
                    <h4 class="titulo-contenido">Concientización</h4>
                    <p class="descripcion-contenido">
                        El veganismo es una postura ética que rechaza toda forma de explotación animal.
                        Es la base de los Derechos de los Animales, que defienden que los animales no deben
                        ser considerados propiedad ni usados como recursos por los humanos.
                        Los derechos son protecciones a intereses fundamentales, como la vida,
                        la libertad y la integridad física. Así como estos derechos se aplican a los humanos, 
                        deben extenderse a los animales, reconociendo su capacidad de sentir y su interés en 
                        vivir libres de daño.
                        Frente a esto, se contrasta con la visión del Bienestar Animal, que acepta el uso de animales
                        siempre y cuando se minimice su sufrimiento. Esta postura busca mejorar el trato, pero no cuestiona la legitimidad de usarlos.
                        Los Derechos de los Animales, en cambio, afirman que: <br>
                        •	Usar animales está mal, sin importar el trato. <br>
                        •	Lo que se debe hacer no es explotarlos "mejor", sino no explotarlos en absoluto.
                        Por tanto, se rechazan campañas que solo buscan reducir el sufrimiento (como prohibir jaulas
                        o ciertas prácticas) y se promueve el veganismo como una forma de respeto real a los animales.
                        
                    </p>
                </div>
            </div>
            <img src="../Images/img_conc_animal.jpg" alt="Concientización animal" class="imagen-contenido">
        </div>
    </section>
</section>

<script>
    window.addEventListener('pageshow', function(event) {
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            // Si se accede desde el caché (por botón atrás), forzar recarga
            window.location.reload();
        }
    });
</script>