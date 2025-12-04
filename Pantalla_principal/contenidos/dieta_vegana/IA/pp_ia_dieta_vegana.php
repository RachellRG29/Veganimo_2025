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
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Gloock&display=swap" rel="stylesheet">
    
    <!-- Iconos -->
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/phosphor.css">
    
    <!-- CSS -->
    <link rel="stylesheet" href="/Pantalla_principal/contenidos/dieta_vegana/styles_pp_dieta_ia.css">
    <link rel="stylesheet" href="/Pantalla_principal/css/styles_index_pp.css">
    

</head>

<body>
    <!-- IA PARA CREAR EL PLAN NUTRICIONAL -->
    <section class="section_dieta_ia">
        <!-- SECCIÓN 1: VISUALIZACIÓN DE DATOS DEL PERFIL -->
        <section class="sect_dieta_ia" id="seccion_perfil">
            <div class="lbl_bienvenida_vg_dieta_ia">
                <h3 class="lbl_dietas_vg">Dietas Veganas</h3>
                <h5 class="lbl_subt">Crea tu plan de dieta vegana</h5>
            </div>

            <div class="contenedor_dieta_ia">
                <div class="tarjeta_vg_dieta_ia">
                    <div class="contenido_tarj_dieta_ia">
                        <div class="circulo_dieta_vg_ia">
                            <img src="/Images/avatares/sf_predeterminado.png" alt="Avatar usuario" 
                                 class="img_tarj_dieta_ia_pred" id="avatar_usuario">
                        </div>
                        
                        <div class="contenedor_sub_titulo">
                            <h5 class="titulo_tarj_dieta_ia_vg">Crear mi Dieta Vegana Automatizada​</h5>
                            <h6 class="sub_dieta_ia">Basada en tu perfil nutricional</h6>
                        </div>
                        
                        <!-- Datos del perfil nutricional -->
                        <div class="datos_dieta_ia">
                            <div class="seccion_referencia">
                                <p>Peso actual: <span id="peso">00</span> kg</p>
                                <p>Altura: <span id="altura">155</span> cm</p>
                                <p>Edad: <span id="edad">x</span> años</p>
                                <p>Género: <span id="genero">masculino/fem</span></p>
                                <p>Dieta actual: <span id="dieta_actual">normal</span></p>
                                <p>Meta a futuro: <span id="meta_futura">vegano</span></p>
                                <p>Objetivo: <span id="objetivo">perder peso</span></p>
                            </div>

                            <div class="seccion_historia">
                                <div>
                                    <h6>Historia clínica</h6>
                                    <p id="historia_clinica">Cargando...</p>
                                </div>
                                <div>
                                    <h6>Afecciones personales</h6>
                                    <p id="afecciones">Cargando...</p>
                                </div>
                                <div>
                                    <h6>Síntomas gastrointestinales</h6>
                                    <p id="sintomas">Cargando...</p>
                                </div>
                            </div>
                        </div>

                        <h6 style="margin-bottom: 20px; color: #154734; text-align: center;">
                            Para editar estos campos, ve al portal de tu perfil nutricional
                        </h6>

                        <div class="botones_dieta_ia">
                            <button class="btn_cancelar_ia" onclick="window.history.back()">
                                <i class="ph ph-arrow-left"></i> Cancelar
                            </button> 

                            <button class="btn_crear_ia" id="btn_crear_dieta">
                                <i class="ph ph-magic-wand"></i> Crear dieta vegana
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECCIÓN 2: LOADING MIENTRAS SE GENERA EL PLAN -->
        <section class="loading-section" id="seccion_loading">
            <div class="loader">
                <span class="loader-text">Generando</span>
                <span class="load"></span>
            </div>
            <div class="loading-message">
                <h4>🍃 Creando tu plan personalizado...</h4>
                <p>Estamos analizando tu perfil y seleccionando las mejores recetas veganas para ti.</p>
                <p>Esto tomará solo unos segundos.</p>
            </div>
        </section>

        <!-- SECCIÓN 3: RECETAS GENERADAS -->
        <section class="recetas-section" id="seccion_recetas">
            <h2 class="section-title">🎯 Tu Plan de Alimentación Diario</h2>
            
            <!-- Análisis del usuario -->
            <div class="analisis-container" style="
                background: white;
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 40px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.08);
                border-left: 5px solid #007848;
            ">
                <h4 style="color: #154734; font-family: 'Gloock', serif;">
                    <i class="ph ph-chart-line-up"></i> Análisis Nutricional
                </h4>
                <p id="analisis_usuario" style="
                    font-family: 'Comfortaa', sans-serif;
                    color: #555;
                    line-height: 1.7;
                    margin-top: 10px;
                ">
                    Cargando análisis...
                </p>
            </div>
            
            <!-- Recetas generadas -->
            <div class="grid-container-recetas" id="contenedor_recetas">
                <!-- Las 3 recetas se cargarán aquí dinámicamente -->
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
                <button class="btn_crear_ia" onclick="window.location.reload()" style="padding: 12px 30px;">
                    <i class="ph ph-arrow-clockwise"></i> Generar Nuevo Plan
                </button>

                <button class="btn_dashboard" id="btn_ir_dashboard" style="padding: 12px 30px;">
                    <i class="ph ph-layout"></i> Ir al Dashboard
                </button>
            </div>
        </section>
    </section>

<script>
    // Variables globales
    let datosUsuario = null;
    let datosPerfil = null;

    // Cargar datos del usuario al iniciar
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const respuesta = await fetch('cargar_datos_dieta_ia.php');
            const data = await respuesta.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Error al cargar datos');
            }
            
            datosUsuario = data.usuario;
            datosPerfil = data.perfil;
            
            // Actualizar interfaz con los datos
            actualizarInterfaz();
            
        } catch (error) {
            console.error('Error:', error);
            alert('❌ No se pudieron cargar los datos del perfil.');
        }
    });

    // Función para actualizar la interfaz con datos del usuario
    function actualizarInterfaz() {
        if (!datosUsuario || !datosPerfil) return;
        
        // Avatar
        const avatarImg = document.getElementById('avatar_usuario');
        if (datosUsuario.avatar) {
            avatarImg.src = '/Images/avatares/' + datosUsuario.avatar;
        }
        
        // Calcular edad
        const calcularEdad = (fechaNac) => {
            if (!fechaNac) return 'N/D';
            const nacimiento = new Date(fechaNac);
            const hoy = new Date();
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const mes = hoy.getMonth() - nacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            return edad;
        };
        
        // Actualizar datos básicos
        document.getElementById('peso').textContent = datosPerfil.peso || 'No definido';
        document.getElementById('altura').textContent = datosPerfil.altura || 'No definida';
        document.getElementById('edad').textContent = calcularEdad(datosUsuario.fecha_nacimiento) + ' años';
        document.getElementById('genero').textContent = datosUsuario.genero || 'No definido';
        document.getElementById('dieta_actual').textContent = datosPerfil.dieta_actual || 'No especificada';
        document.getElementById('meta_futura').textContent = datosPerfil.nivel_meta || 'No definido';
        document.getElementById('objetivo').textContent = datosPerfil.objetivo || 'Mantener peso';
        
        // Formatear arrays a texto
        const formatArray = (arr) => {
            if (!arr) return 'Ninguno';
            if (Array.isArray(arr)) {
                return arr.length > 0 ? arr.join(', ') : 'Ninguno';
            }
            return arr || 'Ninguno';
        };
        
        // Actualizar historia clínica
        const patologicos = formatArray(datosPerfil.patologicos);
        const familiares = formatArray(datosPerfil.familiares);
        const quirurgicos = formatArray(datosPerfil.quirurgicos);
        document.getElementById('historia_clinica').textContent = 
            `Patológicos: ${patologicos}. Familiares: ${familiares}. Quirúrgicos: ${quirurgicos}`;
        
        // Actualizar afecciones
        const intolerancias = formatArray(datosPerfil.intolerancias);
        const alergias = formatArray(datosPerfil.alergias);
        document.getElementById('afecciones').textContent = 
            `Intolerancias: ${intolerancias}. Alergias: ${alergias}`;
        
        // Actualizar síntomas
        const sintomas = formatArray(datosPerfil.sintomas);
        document.getElementById('sintomas').textContent = sintomas;
    }

    // Función auxiliar para calcular edad
    function calcularEdadDesdeFecha(fechaNac) {
        if (!fechaNac) return '';
        const nacimiento = new Date(fechaNac);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad.toString();
    }
    
    // Función auxiliar para formatear arrays
    function formatArrayParaIA(arr) {
        if (!arr) return '';
        if (Array.isArray(arr)) {
            return arr.join(', ');
        }
        return arr;
    }

    // Botón para generar dieta
    document.getElementById('btn_crear_dieta').addEventListener('click', async () => {
        if (!datosUsuario || !datosPerfil) {
            alert('❌ Primero deben cargarse los datos del usuario.');
            return;
        }
        
        // Ocultar sección de perfil y mostrar loading
        document.getElementById('seccion_perfil').style.display = 'none';
        document.getElementById('seccion_loading').style.display = 'block';
        
        try {
            // PREPARAR DATOS PARA LA IA
            const datosParaIA = {
                nombre: datosUsuario.nombre_completo || '',
                genero: datosUsuario.genero || '',
                edad: calcularEdadDesdeFecha(datosUsuario.fecha_nacimiento),
                peso: datosPerfil.peso || '',
                altura: datosPerfil.altura || '',
                dieta_actual: datosPerfil.dieta_actual || '',
                objetivo: datosPerfil.objetivo || '',
                nivel_meta: datosPerfil.nivel_meta || '',
                descripcion_dieta: datosPerfil.descripcion_dieta || '',
                patologicos: formatArrayParaIA(datosPerfil.patologicos),
                familiares: formatArrayParaIA(datosPerfil.familiares),
                quirurgicos: formatArrayParaIA(datosPerfil.quirurgicos),
                intolerancias: formatArrayParaIA(datosPerfil.intolerancias),
                alergias: formatArrayParaIA(datosPerfil.alergias),
                sintomas: formatArrayParaIA(datosPerfil.sintomas)
            };
            
            console.log('Enviando datos a IA:', datosParaIA);
            
            // Llamar a la IA
            const respuestaIA = await fetch('deepseek_ia.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosParaIA)
            });

            if (!respuestaIA.ok) {
                throw new Error(`Error HTTP: ${respuestaIA.status}`);
            }

            const resultadoIA = await respuestaIA.json();
            console.log('Respuesta de IA:', resultadoIA);

            if (!resultadoIA.success) {
                throw new Error(resultadoIA.message || 'Error al generar el plan');
            }

            // Guardar el plan en MongoDB
            const planId = await guardarPlanEnMongoDB(resultadoIA.plan, resultadoIA.analisis);
            
            if (!planId) {
                throw new Error('No se pudo guardar el plan en la base de datos');
            }

            // Mostrar los datos en pantalla
            renderizarRecetas(resultadoIA.plan);
            document.getElementById('analisis_usuario').textContent = resultadoIA.analisis;

            // Mostrar sección de resultados
            document.getElementById('seccion_loading').style.display = 'none';
            document.getElementById('seccion_recetas').style.display = 'block';

            // Mostrar mensaje de éxito con redirección automática
            mostrarMensajeExito(planId);
            
            // Redirigir automáticamente después de 3 segundos
            setTimeout(() => {
                redirigirAlDashboard(planId);
            }, 3000);

        } catch (error) {
            console.error('Error al generar dieta:', error);
            alert('❌ Error: ' + error.message);
            
            // Regresar a la sección de perfil
            document.getElementById('seccion_perfil').style.display = 'block';
            document.getElementById('seccion_loading').style.display = 'none';
        }
    });

    // Función para guardar el plan en MongoDB
    async function guardarPlanEnMongoDB(plan, analisis) {
        try {
            console.log('Guardando plan en MongoDB...', plan);
            
            const respuesta = await fetch('guardar_plan_mongo.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    plan: plan, 
                    analisis: analisis 
                })
            });

            const resultado = await respuesta.json();
            console.log('Respuesta de guardado:', resultado);
            
            if (resultado.success && resultado.plan_id) {
                // Guardar en localStorage para el dashboard
                localStorage.setItem('planRecienCreado', 'true');
                localStorage.setItem('planIdReciente', resultado.plan_id);
                localStorage.setItem('ultimaPlanId', resultado.plan_id);
                
                return resultado.plan_id;
            } else {
                throw new Error(resultado.message || 'Error al guardar en MongoDB');
            }
        } catch (error) {
            console.error('Error al guardar plan en MongoDB:', error);
            throw error;
        }
    }

    // Función para mostrar mensaje de éxito
    function mostrarMensajeExito(planId) {
        const mensajeHTML = `
            <div id="mensaje-exito" style="
                background: linear-gradient(135deg, #007848, #00A86B);
                color: white;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                text-align: center;
                animation: fadeIn 0.5s ease;
            ">
                <h4 style="margin: 0 0 10px 0;">
                    <i class="ph ph-check-circle"></i> ¡Plan creado exitosamente!
                </h4>
                <p style="margin: 0 0 15px 0;">
                    Plan ID: <strong>${planId.substring(0, 8)}...</strong><br>
                    Serás redirigido al dashboard en 3 segundos...
                </p>
                <div style="background: rgba(255,255,255,0.3); height: 5px; border-radius: 3px; overflow: hidden;">
                    <div id="barra-progreso" style="width: 0%; height: 100%; background: white; transition: width 3s linear;"></div>
                </div>
                <button onclick="redirigirAlDashboard('${planId}')" style="
                    margin-top: 15px;
                    background: white;
                    color: #007848;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    font-family: 'Comfortaa', sans-serif;
                    transition: all 0.3s;
                " onmouseover="this.style.transform='scale(1.05)'" 
                   onmouseout="this.style.transform='scale(1)'">
                    <i class="ph ph-arrow-right"></i> Ir ahora al Dashboard
                </button>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        `;
        
        // Insertar mensaje antes del contenedor de recetas
        const contenedorRecetas = document.getElementById('contenedor_recetas');
        contenedorRecetas.insertAdjacentHTML('beforebegin', mensajeHTML);
        
        // Animar barra de progreso
        setTimeout(() => {
            const barra = document.getElementById('barra-progreso');
            if (barra) barra.style.width = '100%';
        }, 100);
    }

    // Función para redirigir al dashboard
    function redirigirAlDashboard(planId) {
        const destino = '/Pantalla_principal/contenidos/plan/pp_dashboard_miplan.php?plan_id=' 
                        + encodeURIComponent(planId) + '&plan_creado=true';
        
        console.log('Redirigiendo a:', destino);
        
        // Método 1: Si existe cargarContenido
        if (window.parent && typeof window.parent.cargarContenido === 'function') {
            window.parent.cargarContenido(destino);
        }
        // Método 2: Si está en iframe
        else if (window !== window.parent) {
            window.parent.postMessage({
                type: 'NAVIGATE',
                page: destino,
                plan_id: planId
            }, '*');
        }
        // Método 3: Navegación normal
        else {
            window.location.href = destino;
        }
    }

    // Función para renderizar las 3 recetas
    function renderizarRecetas(plan) {
        const contenedor = document.getElementById('contenedor_recetas');
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Definir tipos de comida con sus estilos
        const comidas = [
            { 
                key: 'desayuno', 
                label: 'Desayuno', 
                icon: 'ph ph-sun',
                etiqueta: 'desayuno'
            },
            { 
                key: 'almuerzo', 
                label: 'Almuerzo', 
                icon: 'ph ph-fork-knife',
                etiqueta: 'almuerzo'
            },
            { 
                key: 'cena', 
                label: 'Cena', 
                icon: 'ph ph-moon',
                etiqueta: 'cena'
            }
        ];
        
        // Crear tarjeta para cada comida
        comidas.forEach(comida => {
            const receta = plan[comida.key] || {};
            
            // Asegurar que la ruta de la imagen sea correcta
            let imagenSrc = receta.imagen || '/Images/default_food.png';
            if (imagenSrc && !imagenSrc.startsWith('/') && !imagenSrc.startsWith('http')) {
                imagenSrc = '/' + imagenSrc;
            }
            
            // Escapar comillas simples en el nombre para evitar errores
            const nombreEscapado = receta.nombre ? 
                receta.nombre.replace(/'/g, "\\'").replace(/"/g, '&quot;') : 
                comida.label;
            
            const tarjetaHTML = `
                <div class="tarjeta-receta">
                    <div class="circulo-img">
                        <img src="${imagenSrc}" 
                             alt="${receta.nombre || comida.label}" 
                             class="img-plato"
                             onclick="verDetallesReceta('${nombreEscapado}')"
                             style="cursor: pointer;">
                    </div>
                    
                    <div class="body-tarjeta">
                        <h3 class="title-tarjeta">${receta.nombre || comida.label}</h3>
                        
                        <div class="detalles-receta">
                            <div class="tiempo-receta">
                                <i class="${comida.icon}"></i>
                                <span>${comida.label}</span>
                            </div>
                            
                            <div style="width: 1px; height: 40px; background: rgba(255,255,255,0.3);"></div>
                            
                            <div class="dificultad-receta">
                                <i class="ph ph-fire"></i>
                                <span>${receta.calorias || 'Calorías N/A'}</span>
                            </div>
                        </div>
                        
                        <div class="info-extra">
                            <div class="calorias">
                                <i class="ph ph-calorie"></i> ${receta.calorias || 'N/A'}
                            </div>
                            
                            <div class="hora-sugerida">
                                <i class="ph ph-clock"></i> ${receta.hora || 'Horario sugerido'}
                            </div>
                        </div>
                        
                        <div class="explicacion-receta">
                            <p><strong>💡 Por qué esta receta:</strong><br>
                            ${receta.explicacion || 'Receta seleccionada según tu perfil nutricional.'}</p>
                        </div>
                    </div>
                    
                    <div class="etiqueta-tipo ${comida.etiqueta}">
                        ${comida.label.toUpperCase()}
                    </div>
                </div>
            `;
            
            contenedor.innerHTML += tarjetaHTML;
        });
    }

    // Función para ver detalles de la receta
    async function verDetallesReceta(nombreReceta) {
        try {
            const respuesta = await fetch('obtener_receta_por_nombre.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nombreReceta })
            });
            
            const resultado = await respuesta.json();
            
            if (!resultado.success) {
                alert('❌ ' + resultado.message);
                return;
            }
            
            const receta = resultado.receta;
            
            // Crear modal de detalles
            const modalHTML = `
                <div class="modal fade" id="modalReceta" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header" style="background: linear-gradient(135deg, #007848 0%, #00A86B 100%); color: white;">
                                <h5 class="modal-title">
                                    <i class="ph ph-cooking-pot"></i> ${receta.nombre_receta}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <img src="${receta.imagen || '/Images/default_food.png'}" 
                                             class="img-fluid rounded" 
                                             style="width: 100%; height: 250px; object-fit: cover;">
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong><i class="ph ph-clock"></i> Tiempo:</strong> ${receta.tiempo_preparacion || '-'} min</p>
                                        <p><strong><i class="ph ph-gauge"></i> Dificultad:</strong> ${receta.dificultad || '-'}</p>
                                        <p><strong><i class="ph ph-star"></i> Calificación:</strong> ${receta.calificacion ? '★'.repeat(Math.round(receta.calificacion)) + ` (${receta.calificacion.toFixed(1)})` : 'Sin calificar'}</p>
                                        <p><strong><i class="ph ph-info"></i> Descripción:</strong> ${receta.descripcion || 'Sin descripción'}</p>
                                    </div>
                                </div>
                                
                                <hr>
                                
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <h5><i class="ph ph-list"></i> Ingredientes</h5>
                                        <ul class="list-group">
                                            ${(receta.ingredientes || []).map(ing => `<li class="list-group-item">${ing}</li>`).join('')}
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h5><i class="ph ph-steps"></i> Pasos de preparación</h5>
                                        <div class="pasos-container">
                                            ${(receta.pasos || []).map((paso, index) => `
                                                <div class="card mb-2">
                                                    <div class="card-body">
                                                        <h6>Paso ${index + 1}</h6>
                                                        <p>${paso.texto || ''}</p>
                                                        ${paso.imagen ? `<img src="${paso.imagen}" class="img-fluid rounded mt-2" style="max-height: 150px;">` : ''}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="ph ph-x"></i> Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Remover modal anterior si existe
            const modalAnterior = document.getElementById('modalReceta');
            if (modalAnterior) modalAnterior.remove();
            
            // Agregar nuevo modal al body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('modalReceta'));
            modal.show();
            
        } catch (error) {
            console.error('Error al obtener detalles:', error);
            alert('❌ Error al cargar los detalles de la receta.');
        }
    }

    // Botón "Ir al Dashboard" manual
    document.getElementById('btn_ir_dashboard').addEventListener('click', () => {
        const planId = localStorage.getItem('planIdReciente') || localStorage.getItem('ultimaPlanId');
        
        if (!planId) {
            alert("Primero debes generar un plan. Haz clic en 'Crear dieta vegana'.");
            return;
        }
        
        redirigirAlDashboard(planId);
    });

    // Hacer funciones disponibles globalmente
    window.redirigirAlDashboard = redirigirAlDashboard;
    window.verDetallesReceta = verDetallesReceta;
</script>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    
</body>
</html>