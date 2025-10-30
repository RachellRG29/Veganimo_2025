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
    <script>
document.addEventListener('DOMContentLoaded', async () => {
    const avatarImg = document.querySelector('.img_tarj_dieta_ia_pred');
    const pesoSpan = document.getElementById('peso');
    const alturaSpan = document.getElementById('altura');
    const edadSpan = document.getElementById('edad');
    const generoSpan = document.getElementById('genero');
    const dietaActualSpan = document.getElementById('dieta_actual');
    const metaFuturaSpan = document.getElementById('meta_futura');
    const objetivoSpan = document.getElementById('objetivo');
    const historiaSpan = document.getElementById('historia_clinica');
    const afeccionesSpan = document.getElementById('afecciones');
    const sintomasSpan = document.getElementById('sintomas');

    try {
        const resp = await fetch('cargar_datos_dieta_ia.php');
        const data = await resp.json();

        if (!data.success) {
            alert('⚠️ ' + (data.message || 'No se pudieron cargar los datos del perfil.'));
            return;
        }

        const usuario = data.usuario;
        const perfil = data.perfil || {};

        // Avatar
        if (usuario.avatar) {
            avatarImg.src = '/Images/avatares/' + usuario.avatar;
        }

        // Datos generales
        const birthDate = usuario.fecha_nacimiento ? new Date(usuario.fecha_nacimiento) : null;
        const edad = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : 'N/D';

        pesoSpan.textContent = perfil.peso ?? 'No definido';
        alturaSpan.textContent = perfil.altura ? perfil.altura + ' cm' : 'No definida';
        edadSpan.textContent = edad + ' años';
        generoSpan.textContent = usuario.genero || 'No definido';
        dietaActualSpan.textContent = perfil.dieta_actual || 'No especificada';
        metaFuturaSpan.textContent = perfil.nivel_meta || 'No definido';
        objetivoSpan.textContent = perfil.objetivo || 'Mantener peso';

        // Historia clínica
        const patologicos = Array.isArray(perfil.patologicos) ? perfil.patologicos.join(', ') : (perfil.patologicos || 'Ninguno');
        const familiares = Array.isArray(perfil.familiares) ? perfil.familiares.join(', ') : (perfil.familiares || 'Ninguno');
        const quirurgicos = Array.isArray(perfil.quirurgicos) ? perfil.quirurgicos.join(', ') : (perfil.quirurgicos || 'Ninguno');
        historiaSpan.textContent = `Patológicos: ${patologicos}. Familiares: ${familiares}. Quirúrgicos: ${quirurgicos}`;

        const intolerancias = Array.isArray(perfil.intolerancias) ? perfil.intolerancias.join(', ') : (perfil.intolerancias || 'Ninguna');
        const alergias = Array.isArray(perfil.alergias) ? perfil.alergias.join(', ') : (perfil.alergias || 'Ninguna');
        afeccionesSpan.textContent = `Intolerancias: ${intolerancias}. Alergias: ${alergias}`;

        const sintomas = Array.isArray(perfil.sintomas) ? perfil.sintomas.join(', ') : (perfil.sintomas || 'Ninguno');
        sintomasSpan.textContent = sintomas;

    } catch (err) {
        console.error('Error al cargar los datos:', err);
        alert('❌ Error al cargar los datos del usuario.');
    }
});

// --- Evento para crear la dieta vegana ---
document.querySelector('.btn_crear_ia').addEventListener('click', async () => {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('resultado_dieta');
    resultContainer.style.marginTop = '30px';
    resultContainer.style.padding = '15px';
    resultContainer.style.background = '#f9f9f9';
    resultContainer.style.borderRadius = '10px';
    resultContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    resultContainer.innerHTML = '<p style="color:#154734;">⌛ Generando tu plan de dieta personalizada...</p>';
    document.querySelector('.contenido_tarj_dieta_ia').appendChild(resultContainer);

    try {
        const respDatos = await fetch('cargar_datos_dieta_ia.php');
        const data = await respDatos.json();

        if (!data.success) {
            resultContainer.innerHTML = `<p style="color:red;">⚠️ ${data.message}</p>`;
            return;
        }

        const usuario = data.usuario;
        const perfil = data.perfil || {};

        const datos = {
            nombre: usuario.nombre_completo || '',
            genero: usuario.genero || '',
            edad: perfil.edad || '',
            peso: perfil.peso || '',
            altura: perfil.altura || '',
            dieta_actual: perfil.dieta_actual || '',
            objetivo: perfil.objetivo || '',
            nivel_meta: perfil.nivel_meta || '',
            descripcion_dieta: perfil.descripcion_dieta || '',
            plan: perfil.plan || '',
            patologicos: perfil.patologicos || '',
            familiares: perfil.familiares || '',
            quirurgicos: perfil.quirurgicos || '',
            intolerancias: perfil.intolerancias || '',
            alergias: perfil.alergias || '',
            sintomas: perfil.sintomas || ''
        };

        const respDeepSeek = await fetch('deepseek_ia.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const result = await respDeepSeek.json();

        if (result.error) {
            resultContainer.innerHTML = `<p style="color:red;">❌ ${result.error}</p>`;
        } else {
            const plan = result.recomendacion || result.dieta || 'No se generó respuesta.';
            resultContainer.innerHTML = `
                <h4 style="color:#154734;">🥗 Tu plan de dieta personalizado:</h4>
                <p style="white-space:pre-line;">${plan}</p>
            `;
        }
    } catch (err) {
        console.error(err);
        resultContainer.innerHTML = `<p style="color:red;">❌ Error al conectar con la IA.</p>`;
    }
});
</script>

</body>
</html>

