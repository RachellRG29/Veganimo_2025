<?php include_once __DIR__ . '/../menu_perfil.php'; ?>


<!-- pp_mi_plan.html -->
<section class="section_mi_plan">

    <div class="lbl_bienvenida_vg_plan">
        <h1>Bienvenido a Mi plan 🌱</h1>
    </div>
    

    <!-- suscripcion activa / acabando de pagar o suscribirse  -->
    <div class="contenedor_plan">
        <div class="tarjeta_vg_plan">
            <div class="contenido_tarj_plan_vg">
                <div class="circulo_plan_vg">
                    <img src="../Images/avatares/sf_predeterminado.png" alt="" class="img_tarj_plan_pred">
                </div>
                
                <div class="contenedor_sub_titulo">
                    <h5 class="titulo_tarj_plan_vg">✨ ¡Tu suscripción está activa! 🌟​</h5>
                    <h6>Gracias por confiar en nosotros. </h6>
                </div>

                <p class="descripcion_tarj_plan_vg">
                    Ahora puedes crear tu dieta vegana personalizada y comenzar tu camino hacia una vida más saludable. 🌱💚 <br>
                    Solo toca el botón y te llevaremos a dietas veganas para generar tu plan.
                </p>

                <button class="btn_plan_dieta" data-page="/dieta_vegana/pp_dieta_vegana.php"> Plan dieta vegana
                    <i class="ph ph-caret-right" 
                    style="font-size: 24px;"></i>
                </button> 

            </div>
        </div>
    </div>

</section>

<script>
    document.querySelectorAll('.btn_plan_dieta').forEach(boton => {
        boton.addEventListener('click', () => {
            const ruta = boton.dataset.page; // obtiene el valor de data-page
            window.location.href = `/Pantalla_principal/contenidos${ruta}`;
        });
    });

</script>