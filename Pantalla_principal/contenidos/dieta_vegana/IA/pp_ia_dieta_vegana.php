<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dieta vegana automatizada</title>
    <link rel="website icon" href="/Images/Icono_veganimo.svg">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css">
    <!-- Gloock y Comfortaa fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Gloock&display=swap" rel="stylesheet">

    <!-- Iconos de Phosphor -->
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/phosphor.css">
    
    <!-- css para ia -->
    <link rel="stylesheet" href="/Pantalla_principal/css/styles_pp_dieta_ia.css">
    <link rel="stylesheet" href="/Pantalla_principal/css/styles_index_pp.css">

</head>

<body>
    <!-- IA PARA CREAR EL PLAN NUTRICIONAL POR MEDIO DE DIETAS VEGANAS  -->
<!-- pp_ia_dieta_vegana, css styles_pp_dieta ia  -->
<section class="section_dieta_ia">

    <!-- SECCIÓN 1: VISUALIZACION DE DATOS PERFIL NUTRICIONAL NO SE MODIFICAN AQUI  -->
    <section class="sect_dieta_ia">

        <div class="lbl_bienvenida_vg_dieta_ia">
            <h3 class="lbl_dietas_vg" >Dietas Veganas</h3>
            <h5 class="lbl_subt" >Crea tu plan de dieta vegana</h5>
        </div>

        <!-- suscripcion activa / acabando de pagar o suscribirse  -->
        <div class="contenedor_dieta_ia">
            <div class="tarjeta_vg_dieta_ia">
                <div class="contenido_tarj_dieta_ia">
                    <div class="circulo_dieta_vg_ia">
                        <img src="/Images/avatares/sf_predeterminado.png" alt="" class="img_tarj_dieta_ia_pred">
                    </div>
                    
                    <div class="contenedor_sub_titulo">
                        <h5 class="titulo_tarj_dieta_ia_vg">Crear mi Dieta Vegana automatizada​</h5>
                        <h6 class="sub_dieta_ia">Basada en tu perfil nutricional</h6>
                    </div>
                    

                    <!-- Datos referencia del perfil nutricional  -->
                    <div class="datos_dieta_ia">
                        <div class="seccion_referencia">
                            <p>Peso actual: <span id="peso">00</span></p>
                            <p>Altura: <span id="altura">155cm</span></p>
                            <p>Edad: <span id="edad">x años</span></p>
                            <p>Género: <span id="genero">masculino/fem</span></p>
                            <p>Dieta actual: <span id="dieta_actual">normal</span></p>
                            <p>Meta a futuro: <span id="meta_futura">vegano</span></p>
                            <p>Objetivo: <span id="objetivo">perder peso</span></p>
                        </div>

                        <div class="seccion_historia">
                            <div>
                            <h6>Historia clínica</h6>
                            <p id="historia_clinica">Antecedentes: patológico, familiar o quirúrgico</p>
                            </div>
                            <div>
                            <h6>Afecciones personales</h6>
                            <p id="afecciones">Intolerancias / Alergias</p>
                            </div>
                            <div>
                            <h6>Síntomas gastrointestinales</h6>
                            <p id="sintomas">Síntomas</p>
                            </div>
                        </div>
                    </div>

                    <h6 style="margin-bottom:20px; color: #154734;">
                        Para poder editar estos campos, deberán ser editados dentro del portal del usuario</h6>



                    <div class="botones_dieta_ia">
                        <button class="btn_cancelar_ia" onclick="window.history.back()"> Cancelar
                        </button> 

                        <button class="btn_crear_ia"> Crear dieta vegana
                        </button>
                    </div>


                </div>
            </div>
        </div>

    </section>

</section>
    
</body>
</html>
