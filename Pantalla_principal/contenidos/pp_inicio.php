<?php include_once __DIR__ . '/menu_perfil.php'; 
 require_once __DIR__ . '/auth_middleware.php';?>


<!-- pp_inicio.php y css: styles_pp_inicio.css -->
<section class="section_inicio">
    <h1 class="lbl_bienvenida_vg">Bienvenido a Vegánimo 🌱</h1>
    <!-- <p class="lbl_user_bienvenida"> Usuario </p> -->


    <!-- INICIAR PLAN  -->
    <div class="iniciar_plan">
        <div class="tarjeta_inic_plan">
            <div class="contenido_tarj_plan">
                <div class="circulo_plan">
                    <img src="../Images/vegetales.webp" alt="" class="img_tarj_plan">
                </div>
                
                <h2 class="titulo_tarj_plan">¡Hola! ¿Listo para empezar?</h2>
                <p class="descripcion_tarj_plan">Antes de dar el primer paso en tu estilo de vida vegano, 
                    cuentanos un poco sobre ti. <br>
                    Comparte tus datos nutricionales y crearemos un perfil adaptado a tus necesidades. <br>
                    De esta manera podremos armar tu plan personalizado y acompañarte desde el día uno. 🌱 <br> <br>
                    Para activar todos los beneficios de Vegánimo y comenzar con tu plan, solo necesitas tu suscripción.
                </p>

                <button class="btn_iniciar_plan" onclick="window.location.href = '../Perfil_nutricional/crear_perfil_nutric.html'"> Suscríbete
                    <i class="ph ph-caret-right" 
                    style="font-size: 24px;"></i>
                </button> 

            </div>
        </div>
    </div>
    <br><br>



</section>

<script src="/Pantalla_principal/js/pp_inicio.js"></script>
<script>
    window.addEventListener('pageshow', function(event) {
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            // Si se accede desde el caché (por botón atrás), forzar recarga
            window.location.reload();
        }
    });
</script>

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