

// Variables globales
let planActual = null;
let recetasPlan = null;

// Frases motivacionales para el dashboard
const frasesMotivacionales = [
    "El veganismo no es solo una forma de alimentarse, es un camino hacia la salud, la compasión y un planeta mejor.",
    "Cada comida vegana es un voto por un mundo más compasivo y sostenible.",
    "Tu cuerpo agradece cada elección vegana con más energía y vitalidad.",
    "La transición vegana es un viaje, no una carrera. Celebra cada pequeño progreso.",
    "Alimentarse de plantas es alimentarse de vida, energía y futuro.",
    "Cada bocado vegano contribuye a un mundo más saludable para todos.",
    "Tu salud florece cuando tu plato se llena de colores vegetales.",
    "Ser vegano es vivir en armonía con tu cuerpo, los animales y el planeta."
];

// Cargar el plan al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Cargar datos del usuario (nivel)
        await cargarDatosUsuario();
        
        // 2. Cargar plan actual
        await cargarPlanActual();
        
        // 3. Configurar eventos de la guía
        configurarGuiaColores();
        
        // 4. Configurar frase motivacional aleatoria
        configurarFraseMotivacional();
        
    } catch (error) {
        console.error('Error al cargar el dashboard:', error);
        mostrarMensajeError('Error al cargar los datos del plan');
    }
});

// Función para cargar datos del usuario
async function cargarDatosUsuario() {
    try {
        const respuesta = await fetch('cargar_datos_dieta_ia.php');
        const data = await respuesta.json();
        
        if (data.success && data.perfil) {
            document.getElementById('nivel_usuario').textContent = 
                data.perfil.nivel_meta || 'Transicionista';
        }
    } catch (error) {
        console.error('Error al cargar datos usuario:', error);
    }
}

// Función para cargar el plan actual
async function cargarPlanActual() {
    try {
        const respuesta = await fetch('obtener_plan_actual.php');
        const data = await respuesta.json();
        
        if (data.success && data.tiene_plan) {
            planActual = data.plan;
            recetasPlan = data.recetas;
            
            // Mostrar plan en el dashboard
            mostrarPlanDashboard();
            
            // Actualizar contador de días
            actualizarContadorDias();
            
        } else {
            // No hay plan activo
            mostrarSinPlan();
        }
    } catch (error) {
        console.error('Error al cargar plan:', error);
        mostrarSinPlan();
    }
}

// Función para mostrar el plan en el dashboard
function mostrarPlanDashboard() {
    const contenedor = document.getElementById('recetas_contenedor');
    const sinPlanDiv = document.getElementById('sin_plan');
    const progresoDiv = document.getElementById('progreso_plan');
    
    // Ocultar mensaje sin plan
    sinPlanDiv.style.display = 'none';
    
    // Mostrar contenedor de recetas
    contenedor.innerHTML = '';
    
    // Crear tarjetas para cada comida
    const comidas = [
        { key: 'desayuno', label: 'Desayuno', letra: 'D', clase: 'tipo_desay' },
        { key: 'almuerzo', label: 'Almuerzo', letra: 'A', clase: 'tipo_almue' },
        { key: 'cena', label: 'Cena', letra: 'C', clase: 'tipo_cena' }
    ];
    
    comidas.forEach(comida => {
        const receta = recetasPlan[comida.key];
        
        if (!receta || !receta.nombre) {
            crearTarjetaVacia(comida, contenedor);
            return;
        }
        
        // Preparar URL de imagen
        let imagenSrc = receta.imagen || '/Images/fondo_pu_oscuro.png';
        if (imagenSrc && !imagenSrc.startsWith('/') && !imagenSrc.startsWith('http')) {
            imagenSrc = '/' + imagenSrc;
        }
        
        // Crear tarjeta
        const tarjetaHTML = `
            <div class="tarjeta_receta ${comida.clase}" data-tipo="${comida.key}">
                <img src="${imagenSrc}" alt="${receta.nombre}" class="img_receta">
                <span class="etiqueta_letra">${comida.letra}</span>
                <p class="nombre_receta">${receta.nombre}</p>
                <button class="btn-ver-mas-dash ver-mas" onclick="verRecetaPlan('${comida.key}')">
                    Ver más 
                    <i class="ph ph-arrow-circle-right"></i>
                </button>
            </div>
        `;
        
        contenedor.innerHTML += tarjetaHTML;
    });
    
    // Calcular y mostrar progreso
    calcularProgreso();
    progresoDiv.style.display = 'flex';
}

// Función para crear tarjeta vacía
function crearTarjetaVacia(comida, contenedor) {
    const tarjetaHTML = `
        <div class="tarjeta_receta ${comida.clase}">
            <img src="/Images/fondo_pu_oscuro.png" alt="${comida.label}" class="img_receta">
            <span class="etiqueta_letra">${comida.letra}</span>
            <p class="nombre_receta">${comida.label}</p>
            <button class="btn-ver-mas-dash ver-mas" style="background-color: #BEBEBE;" disabled>
                Sin receta
                <i class="ph ph-clock-afternoon"></i>
            </button>
        </div>
    `;
    
    contenedor.innerHTML += tarjetaHTML;
}

// Función para mostrar mensaje cuando no hay plan
function mostrarSinPlan() {
    const contenedor = document.getElementById('recetas_contenedor');
    const sinPlanDiv = document.getElementById('sin_plan');
    const progresoDiv = document.getElementById('progreso_plan');
    
    contenedor.style.display = 'none';
    progresoDiv.style.display = 'none';
    sinPlanDiv.style.display = 'block';
}

// Función para calcular progreso del plan
function calcularProgreso() {
    if (!planActual || !planActual.completadas) return;
    
    const completadas = planActual.completadas;
    let totalCompletadas = 0;
    let totalComidas = 0;
    
    // Contar comidas completadas
    for (const comida in completadas) {
        totalComidas++;
        if (completadas[comida]) {
            totalCompletadas++;
        }
    }
    
    // Calcular porcentaje
    const porcentaje = totalComidas > 0 ? Math.round((totalCompletadas / totalComidas) * 100) : 0;
    
    // Actualizar UI
    document.getElementById('barra_progreso').style.width = porcentaje + '%';
    document.getElementById('porcentaje_progreso').textContent = porcentaje + '%';
    
    // Calcular calorías totales
    let totalCalorias = 0;
    if (recetasPlan) {
        for (const comida in recetasPlan) {
            if (recetasPlan[comida] && recetasPlan[comida].calorias) {
                const caloriasText = recetasPlan[comida].calorias;
                const match = caloriasText.match(/\d+/);
                if (match) {
                    totalCalorias += parseInt(match[0]);
                }
            }
        }
    }
    
    document.getElementById('total_calorias').textContent = totalCalorias + ' Calorías';
}

// Función para actualizar contador de días
function actualizarContadorDias() {
    if (!planActual || !planActual.fecha_inicio) return;
    
    const fechaInicio = new Date(planActual.fecha_inicio);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaInicio.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;
    
    document.getElementById('dias_plan').textContent = dias + ' días';
}

// Función para configurar frase motivacional
function configurarFraseMotivacional() {
    const fraseAleatoria = frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)];
    document.getElementById('frase_motivacional').textContent = fraseAleatoria;
}

// Función para ver receta en modal
async function verRecetaPlan(tipoComida) {
    if (!recetasPlan || !recetasPlan[tipoComida]) {
        alert('No hay información disponible para esta receta');
        return;
    }
    
    const receta = recetasPlan[tipoComida];
    
    try {
        // Obtener detalles completos de la receta desde la BD
        const respuesta = await fetch('obtener_receta_por_nombre.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: receta.nombre })
        });
        
        const resultado = await respuesta.json();
        
        if (!resultado.success) {
            // Si no se encuentra la receta completa, mostrar información básica
            mostrarModalRecetaBasica(receta, tipoComida);
            return;
        }
        
        const recetaCompleta = resultado.receta;
        mostrarModalRecetaCompleta(recetaCompleta, tipoComida, receta);
        
    } catch (error) {
        console.error('Error al obtener detalles:', error);
        mostrarModalRecetaBasica(receta, tipoComida);
    }
}

// Función para mostrar modal con información básica
function mostrarModalRecetaBasica(receta, tipoComida) {
    // Configurar información básica
    const etiquetas = {
        'desayuno': { letra: 'D', color: '#FEED98', borde: '#FF814F' },
        'almuerzo': { letra: 'A', color: '#A9F1AF', borde: '#007848' },
        'cena': { letra: 'C', color: '#ACFEED', borde: '#1E88E5' }
    };
    
    const etiqueta = etiquetas[tipoComida] || etiquetas.desayuno;
    
    // Preparar imagen
    let imagenSrc = receta.imagen || '/Images/fondo_pu_oscuro.png';
    if (imagenSrc && !imagenSrc.startsWith('/') && !imagenSrc.startsWith('http')) {
        imagenSrc = '/' + imagenSrc;
    }
    
    // Actualizar modal
    document.getElementById('modal-imagen-plan').src = imagenSrc;
    document.getElementById('modal-nombre-receta').textContent = receta.nombre;
    document.getElementById('modal-descripcion-plan').textContent = 
        receta.explicacion || 'Receta seleccionada por nuestra IA según tu perfil nutricional.';
    document.getElementById('modal-calorias-plan').textContent = receta.calorias || 'N/A';
    document.getElementById('modal-tiempo-plan').textContent = receta.hora || 'Horario sugerido';
    
    // Configurar etiqueta
    const badge = document.getElementById('badge-tipo-comida');
    badge.style.background = etiqueta.color;
    badge.style.border = `2px dashed ${etiqueta.borde}`;
    document.getElementById('letra-tipo-comida').textContent = etiqueta.letra;
    
    // Configurar botón de completar
    const btnCompletar = document.getElementById('btn-empezar-receta');
    const completada = planActual?.completadas?.[tipoComida] || false;
    
    if (completada) {
        document.getElementById('badge-estado-receta').innerHTML = 
            '<i class="ph ph-check-circle"></i><span>Completada</span>';
        btnCompletar.textContent = 'Marcar como Pendiente';
        btnCompletar.style.backgroundColor = '#BEBEBE';
    } else {
        document.getElementById('badge-estado-receta').innerHTML = 
            '<i class="ph ph-clock"></i><span>Pendiente</span>';
        btnCompletar.textContent = 'Marcar como Completada';
        btnCompletar.style.backgroundColor = '#E99A3C';
    }
    
    // Configurar evento del botón
    btnCompletar.onclick = () => toggleCompletada(tipoComida);
    
    // Limpiar ingredientes y pasos (no disponibles)
    document.getElementById('modal-ingredientes-plan').innerHTML = 
        '<li>Información detallada no disponible</li>';
    document.getElementById('modal-pasos-plan').innerHTML = 
        '<li>Consulta la receta original para los pasos de preparación</li>';
    
    // Mostrar modal
    document.getElementById('modal-receta-plan').classList.remove('oculto');
}

// Función para mostrar modal con información completa
function mostrarModalRecetaCompleta(recetaCompleta, tipoComida, recetaPlan) {
    // Configurar información básica (igual que la función anterior)
    const etiquetas = {
        'desayuno': { letra: 'D', color: '#FEED98', borde: '#FF814F' },
        'almuerzo': { letra: 'A', color: '#A9F1AF', borde: '#007848' },
        'cena': { letra: 'C', color: '#ACFEED', borde: '#1E88E5' }
    };
    
    const etiqueta = etiquetas[tipoComida] || etiquetas.desayuno;
    
    // Preparar imagen
    let imagenSrc = recetaCompleta.imagen || recetaPlan.imagen || '/Images/fondo_pu_oscuro.png';
    if (imagenSrc && !imagenSrc.startsWith('/') && !imagenSrc.startsWith('http')) {
        imagenSrc = '/' + imagenSrc;
    }
    
    // Actualizar modal
    document.getElementById('modal-imagen-plan').src = imagenSrc;
    document.getElementById('modal-nombre-receta').textContent = recetaCompleta.nombre_receta || recetaPlan.nombre;
    document.getElementById('modal-descripcion-plan').textContent = 
        recetaCompleta.descripcion || recetaPlan.explicacion || 'Descripción no disponible';
    document.getElementById('modal-calorias-plan').textContent = recetaPlan.calorias || 'N/A';
    document.getElementById('modal-tiempo-plan').textContent = recetaCompleta.tiempo_preparacion || 'N/A';
    document.getElementById('modal-dificultad-plan').textContent = recetaCompleta.dificultad || 'N/A';
    
    // Configurar etiqueta
    const badge = document.getElementById('badge-tipo-comida');
    badge.style.background = etiqueta.color;
    badge.style.border = `2px dashed ${etiqueta.borde}`;
    document.getElementById('letra-tipo-comida').textContent = etiqueta.letra;
    
    // Configurar botón de completar
    const btnCompletar = document.getElementById('btn-empezar-receta');
    const completada = planActual?.completadas?.[tipoComida] || false;
    
    if (completada) {
        document.getElementById('badge-estado-receta').innerHTML = 
            '<i class="ph ph-check-circle"></i><span>Completada</span>';
        btnCompletar.textContent = 'Marcar como Pendiente';
        btnCompletar.style.backgroundColor = '#BEBEBE';
    } else {
        document.getElementById('badge-estado-receta').innerHTML = 
            '<i class="ph ph-clock"></i><span>Pendiente</span>';
        btnCompletar.textContent = 'Marcar como Completada';
        btnCompletar.style.backgroundColor = '#E99A3C';
    }
    
    // Configurar evento del botón
    btnCompletar.onclick = () => toggleCompletada(tipoComida);
    
    // Mostrar ingredientes
    const ingredientesList = document.getElementById('modal-ingredientes-plan');
    ingredientesList.innerHTML = '';
    
    if (recetaCompleta.ingredientes && recetaCompleta.ingredientes.length > 0) {
        recetaCompleta.ingredientes.forEach(ingrediente => {
            const li = document.createElement('li');
            li.textContent = ingrediente;
            ingredientesList.appendChild(li);
        });
    } else {
        ingredientesList.innerHTML = '<li>No hay información de ingredientes</li>';
    }
    
    // Mostrar pasos
    const pasosList = document.getElementById('modal-pasos-plan');
    pasosList.innerHTML = '';
    
    if (recetaCompleta.pasos && recetaCompleta.pasos.length > 0) {
        recetaCompleta.pasos.forEach((paso, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>Paso ${index + 1}:</strong> ${paso.texto || ''}`;
            pasosList.appendChild(li);
        });
    } else {
        pasosList.innerHTML = '<li>No hay información de preparación</li>';
    }
    
    // Mostrar modal
    document.getElementById('modal-receta-plan').classList.remove('oculto');
}

// Función para marcar/desmarcar receta como completada
async function toggleCompletada(tipoComida) {
    if (!planActual) return;
    
    try {
        // Actualizar estado localmente
        const nuevoEstado = !(planActual.completadas?.[tipoComida] || false);
        
        // Enviar actualización al servidor
        const respuesta = await fetch('actualizar_estado_receta.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan_id: planActual._id,
                tipo_comida: tipoComida,
                completada: nuevoEstado
            })
        });
        
        const resultado = await respuesta.json();
        
        if (resultado.success) {
            // Actualizar estado local
            if (!planActual.completadas) planActual.completadas = {};
            planActual.completadas[tipoComida] = nuevoEstado;
            
            // Recargar la vista del modal
            verRecetaPlan(tipoComida);
            
            // Actualizar progreso en el dashboard
            calcularProgreso();
            
        } else {
            alert('Error al actualizar el estado de la receta');
        }
        
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        alert('Error de conexión');
    }
}

// Función para configurar la guía de colores
function configurarGuiaColores() {
    const btnGuia = document.querySelector('.btn-guia');
    const popupGuia = document.getElementById('popupGuia');
    const cerrarPopup = document.querySelector('.cerrar_popup_x');
    
    if (btnGuia && popupGuia) {
        btnGuia.addEventListener('click', () => {
            popupGuia.classList.add('open');
        });
        
        cerrarPopup.addEventListener('click', () => {
            popupGuia.classList.remove('open');
        });
        
        // Cerrar al hacer clic fuera
        popupGuia.addEventListener('click', (e) => {
            if (e.target === popupGuia) {
                popupGuia.classList.remove('open');
            }
        });
    }
}

// Función para mostrar mensaje de error
function mostrarMensajeError(mensaje) {
    const contenedor = document.getElementById('recetas_contenedor');
    contenedor.innerHTML = `
        <div class="mensaje-error" style="text-align: center; padding: 40px; color: #D32F2F;">
            <h3>⚠️ Error</h3>
            <p>${mensaje}</p>
            <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #007848; color: white; border: none; border-radius: 8px;">
                Reintentar
            </button>
        </div>
    `;
}

// Cerrar modal de receta
document.getElementById('cerrar-modal-plan').addEventListener('click', () => {
    document.getElementById('modal-receta-plan').classList.add('oculto');
});

// Cerrar modal al hacer clic fuera
document.getElementById('modal-receta-plan').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-receta-plan')) {
        document.getElementById('modal-receta-plan').classList.add('oculto');
    }
});

// Funciones para modales existentes (mantener)
function abrirModalIngredientes() {
    document.getElementById('modal-ingredientes-casa').classList.remove('oculto');
}

function abrirModalPreferencias() {
    document.getElementById('modal-preferencias-ingredientes').classList.remove('oculto');
}
