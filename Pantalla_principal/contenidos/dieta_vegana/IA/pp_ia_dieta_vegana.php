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
    const avatarCont = document.querySelector('.circulo_dieta_vg_ia');

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

    // Función para ajustar el avatar dentro del círculo
    const ajustarAvatar = () => {
        const size = Math.min(avatarCont.offsetWidth, avatarCont.offsetHeight);
        avatarImg.style.width = size + 'px';
        avatarImg.style.height = size + 'px';
        avatarImg.style.borderRadius = '50%';
        avatarImg.style.objectFit = 'cover';
        avatarImg.style.display = 'block';
    };

    // Ajuste inicial y al cambiar tamaño de ventana
    ajustarAvatar();
    window.addEventListener('resize', ajustarAvatar);

    try {
        const resp = await fetch('cargar_datos_dieta_ia.php');
        const data = await resp.json();
        if (!data.success) throw new Error(data.message || 'No se pudieron cargar los datos del perfil.');

        const usuario = data.usuario;
        const perfil = data.perfil || {};

        if (usuario.avatar) avatarImg.src = '/Images/avatares/' + usuario.avatar;

        const birthDate = usuario.fecha_nacimiento ? new Date(usuario.fecha_nacimiento) : null;
        const edad = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : 'N/D';

        pesoSpan.textContent = perfil.peso ?? 'No definido';
        alturaSpan.textContent = perfil.altura ? perfil.altura + ' cm' : 'No definida';
        edadSpan.textContent = edad + ' años';
        generoSpan.textContent = usuario.genero || 'No definido';
        dietaActualSpan.textContent = perfil.dieta_actual || 'No especificada';
        metaFuturaSpan.textContent = perfil.nivel_meta || 'No definido';
        objetivoSpan.textContent = perfil.objetivo || 'Mantener peso';

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

document.querySelector('.btn_crear_ia').addEventListener('click', async () => {
    const contenedor = document.querySelector('.contenido_tarj_dieta_ia');
    let resultContainer = contenedor.querySelector('.resultado_dieta');
    if (!resultContainer) {
        resultContainer = document.createElement('div');
        resultContainer.classList.add('resultado_dieta');
        contenedor.appendChild(resultContainer);
    }
    resultContainer.innerHTML = '<p style="color:#154734;">⌛ Generando tu plan de dieta personalizada...</p>';

    try {
        const resp = await fetch('cargar_datos_dieta_ia.php');
        const data = await resp.json();
        if (!data.success) { resultContainer.innerHTML = `<p style="color:red;">❌ ${data.message}</p>`; return; }

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
        if (!result.success) { resultContainer.innerHTML = `<p style="color:red;">❌ ${result.message}</p>`; return; }

        const plan = result.plan;

        const renderComida = (comida) => {
            let imgSrc = comida.imagen || '';
            if(imgSrc && imgSrc[0]!=='/') imgSrc = '/' + imgSrc;
            return `
                <div class="comida_item" data-nombre="${comida.nombre}" style="margin-bottom:15px;">
                    <strong>${comida.nombre}</strong> (${comida.calorias})<br>
                    <em>Hora sugerida: ${comida.hora}</em><br>
                    <img src="${imgSrc}" alt="${comida.nombre}" class="img_comida" style="max-width:120px; border-radius:8px; display:block; margin-top:5px; cursor:pointer;">
                    <p>${comida.explicacion}</p>
                </div>
            `;
        };

        // Mostrar análisis antes del plan
        resultContainer.innerHTML = `
            <h4 style="color:#154734;">📝 Análisis nutricional:</h4>
            <p>${result.analisis || 'No se pudo generar el análisis.'}</p>

            <h4 style="color:#154734;">🥗 Plan de dieta personalizado:</h4>
            <h5 style="color:#154734;">Desayuno:</h5>${renderComida(plan.desayuno)}
            <h5 style="color:#154734;">Almuerzo:</h5>${renderComida(plan.almuerzo)}
            <h5 style="color:#154734;">Cena:</h5>${renderComida(plan.cena)}
        `;

        // --- Modal para receta ---
        let modal = document.querySelector('.modal_receta');
        if (!modal) {
            modal = document.createElement('div');
            modal.classList.add('modal_receta');
            modal.innerHTML = `
                <div class="modal_contenido">
                    <span class="cerrar_modal">&times;</span>
                    <div class="contenido_modal"></div>
                </div>
            `;
            document.body.appendChild(modal);

            const modalStyle = document.createElement('style');
            modalStyle.textContent = `
                .modal_receta { display: none; position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.7); justify-content:center; align-items:center; z-index:1000; }
                .modal_contenido { background:white; padding:20px; border-radius:10px; max-width:600px; width:90%; text-align:left; position:relative; box-shadow:0 5px 20px rgba(0,0,0,0.3); overflow-y:auto; max-height:90vh; }
                .cerrar_modal { position:absolute; top:10px; right:15px; font-size:25px; cursor:pointer; color:#444; }
                .cerrar_modal:hover { color:red; }
                .paso-item { margin-bottom:15px; border-left:4px solid #3cb371; padding-left:10px; }
                .paso-item img { width:100%; max-height:200px; object-fit:cover; border-radius:10px; margin-top:8px; }
            `;
            document.head.appendChild(modalStyle);

            modal.querySelector('.cerrar_modal').addEventListener('click', () => modal.style.display='none');
            modal.addEventListener('click', e => { if(e.target===modal) modal.style.display='none'; });
        }

        resultContainer.addEventListener('click', async (e) => {
            if (!e.target.classList.contains('img_comida')) return;
            const img = e.target;
            const nombre = img.closest('.comida_item').dataset.nombre;

            try {
                const respReceta = await fetch('obtener_receta_por_nombre.php', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({nombre})
                });
                const recetaData = await respReceta.json();
                if (!recetaData.success) { alert('❌ ' + recetaData.message); return; }
                const receta = recetaData.receta;

                const pasosHTML = (receta.pasos || []).map((p,i)=>`
                    <div class="paso-item">
                        <h4>Paso ${i+1}</h4>
                        <p>${p.texto||''}</p>
                        ${p.imagen ? `<img src="${p.imagen[0]!=='/'?'/'+p.imagen:p.imagen}" alt="Paso ${i+1}">` : ''}
                    </div>
                `).join('');

                const c = modal.querySelector('.contenido_modal');
                c.innerHTML = `
                    <h2>${receta.nombre_receta}</h2>
                    <img src="${receta.imagen[0]!=='/'?'/'+receta.imagen:receta.imagen}" style="width:100%;border-radius:10px;margin:10px 0;">
                    <p><strong>Descripción:</strong> ${receta.descripcion||'Sin descripción.'}</p>
                    <p><strong>Tiempo:</strong> ${receta.tiempo_preparacion||'-'} min</p>
                    <p><strong>Dificultad:</strong> ${receta.dificultad||'-'}</p>
                    <p><strong>Calificación:</strong> ${receta.calificacion?receta.calificacion.toFixed(1)+' ⭐':'Sin calificación'}</p>
                    <h3>Ingredientes</h3><ul>${(receta.ingredientes||[]).map(i=>`<li>${i}</li>`).join('')}</ul>
                    <h3>Pasos</h3>${pasosHTML || '<p>No hay pasos registrados.</p>'}
                `;
                modal.style.display='flex';

            } catch(err) { console.error(err); alert('❌ Error al obtener la receta.'); }
        });

    } catch(err) {
        console.error(err);
        resultContainer.innerHTML = `<p style="color:red;">❌ Error al conectar con la IA.</p>`;
    }
});
</script>



</body>
</html>

