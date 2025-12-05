// modales-plan.js - Script UNIFICADO para abrir modal de recetas
console.log("✅ modales-plan.js cargado");

// Variables globales para recetas dinámicas
let recetasDinamicas = {
    desayuno: null,
    almuerzo: null,
    cena: null
};

// Función principal para abrir modal con datos dinámicos
function abrirModalRecetaDashboard(tipoComida, boton = null) {
    console.log(`🔓 Abriendo modal para: ${tipoComida}`);
    
    // Verificar si tenemos datos dinámicos para este tipo
    const receta = recetasDinamicas[tipoComida];
    
    if (!receta) {
        console.error(`❌ No hay datos para: ${tipoComida}`);
        
        // Datos de prueba (fallback)
        const recetasPrueba = {
            desayuno: {
                titulo: "Desayuno - Receta del Plan",
                nombre: "Receta de Desayuno",
                descripcion: "Receta personalizada según tu plan nutricional.",
                imagen: "/Images/fondo_pu_oscuro.png",
                tiempo: "15 min",
                dificultad: "Media",
                calorias: "N/A",
                tipo: "desayuno",
                ingredientes: ["Ingredientes no disponibles"],
                preparacion: ["Preparación no especificada"],
                estado: "disponible"
            },
            almuerzo: {
                titulo: "Almuerzo - Receta del Plan", 
                nombre: "Receta de Almuerzo",
                descripcion: "Receta personalizada según tu plan nutricional.",
                imagen: "/Images/fondo_pu_oscuro.png",
                tiempo: "30 min",
                dificultad: "Media", 
                calorias: "N/A",
                tipo: "almuerzo",
                ingredientes: ["Ingredientes no disponibles"],
                preparacion: ["Preparación no especificada"],
                estado: "disponible"
            },
            cena: {
                titulo: "Cena - Receta del Plan",
                nombre: "Receta de Cena",
                descripcion: "Receta personalizada según tu plan nutricional.",
                imagen: "/Images/fondo_pu_oscuro.png", 
                tiempo: "25 min",
                dificultad: "Media",
                calorias: "N/A",
                tipo: "cena",
                ingredientes: ["Ingredientes no disponibles"],
                preparacion: ["Preparación no especificada"],
                estado: "disponible"
            }
        };
        
        abrirModalConDatos(tipoComida, recetasPrueba[tipoComida], boton);
        return;
    }
    
    // Usar datos dinámicos
    abrirModalConDatos(tipoComida, receta, boton);
}

// Función interna para abrir modal con datos
function abrirModalConDatos(tipo, receta, boton) {
    console.log(`📋 Cargando receta ${tipo}:`, receta);
    
    // Actualizar contenido del modal
    document.getElementById('modal-titulo-plan').textContent = receta.titulo || `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - ${receta.nombre || 'Receta'}`;
    document.getElementById('modal-nombre-receta').textContent = receta.nombre || `Receta de ${tipo}`;
    document.getElementById('modal-descripcion-plan').textContent = receta.descripcion || receta.explicacion || 'Receta personalizada según tu plan nutricional.';
    document.getElementById('modal-imagen-plan').src = receta.imagen || '/Images/fondo_pu_oscuro.png';
    document.getElementById('modal-tiempo-plan').textContent = receta.tiempo || receta.tiempo_preparacion || '15 min';
    document.getElementById('modal-dificultad-plan').textContent = receta.dificultad || 'Media';
    document.getElementById('modal-calorias-plan').textContent = receta.calorias || 'N/A';
    
    // Actualizar badge del tipo de comida
    const badgeTipo = document.getElementById('badge-tipo-comida');
    if (badgeTipo) {
        badgeTipo.className = 'badge-tipo-comida ' + tipo;
        
        // Aplicar colores según tipo usando las clases CSS
        if (tipo === 'desayuno') {
            badgeTipo.classList.add('desayuno');
            badgeTipo.classList.remove('almuerzo', 'cena');
        } else if (tipo === 'almuerzo') {
            badgeTipo.classList.add('almuerzo');
            badgeTipo.classList.remove('desayuno', 'cena');
        } else if (tipo === 'cena') {
            badgeTipo.classList.add('cena');
            badgeTipo.classList.remove('desayuno', 'almuerzo');
        }
    }
    
    // Actualizar letra del tipo
    const letraEl = document.getElementById('letra-tipo-comida');
    if (letraEl) {
        letraEl.textContent = tipo === 'desayuno' ? 'D' : tipo === 'almuerzo' ? 'A' : 'C';
    }
    
    // ==================== INGREDIENTES ====================
    const listaIngredientes = document.getElementById('modal-ingredientes-plan');
    if (listaIngredientes) {
        listaIngredientes.innerHTML = '';
        
        let ingredientesArray = [];
        
        // Manejar diferentes formatos de ingredientes
        if (Array.isArray(receta.ingredientes)) {
            ingredientesArray = receta.ingredientes;
        } else if (typeof receta.ingredientes === 'string') {
            // Separar por comas, puntos o saltos de línea
            ingredientesArray = receta.ingredientes.split(/[,;.\n]/)
                .map(ing => ing.trim())
                .filter(ing => ing.length > 0);
        } else if (receta.ingredients) { // Alias en inglés
            if (Array.isArray(receta.ingredients)) {
                ingredientesArray = receta.ingredients;
            } else if (typeof receta.ingredients === 'string') {
                ingredientesArray = receta.ingredients.split(/[,;.\n]/)
                    .map(ing => ing.trim())
                    .filter(ing => ing.length > 0);
            }
        }
        
        // Si no hay ingredientes, mostrar mensaje
        if (ingredientesArray.length === 0) {
            ingredientesArray = ['Ingredientes no especificados'];
        }
        
        // Crear lista con el estilo correcto
        ingredientesArray.forEach(ingrediente => {
            const li = document.createElement('li');
            li.textContent = ingrediente;
            
            // Agregar bullet point como en el CSS
            const bullet = document.createElement('span');
            bullet.textContent = '•';
            bullet.style.color = '#E99A3C';
            bullet.style.fontWeight = 'bold';
            bullet.style.marginRight = '10px';
            bullet.style.fontSize = '18px';
            
            li.prepend(bullet);
            listaIngredientes.appendChild(li);
        });
    }
    
    // ==================== PASOS DE PREPARACIÓN ====================
    const listaPasos = document.getElementById('modal-pasos-plan');
    if (listaPasos) {
        listaPasos.innerHTML = '';
        
        let pasosArray = [];
        
        // Manejar diferentes formatos de pasos
        if (Array.isArray(receta.preparacion)) {
            pasosArray = receta.preparacion;
        } else if (typeof receta.preparacion === 'string') {
            // Separar por puntos o números
            pasosArray = receta.preparacion.split(/[.\n](?=\s*\d+\.|\s*[-•])|(?<=\d\)|\w\.)\s+/)
                .map(paso => paso.trim())
                .filter(paso => paso.length > 0);
        } else if (Array.isArray(receta.pasos)) {
            pasosArray = receta.pasos;
        } else if (receta.steps && Array.isArray(receta.steps)) {
            pasosArray = receta.steps;
        }
        
        // Si no hay pasos, mostrar mensaje
        if (pasosArray.length === 0) {
            pasosArray = ['Preparación no especificada. Sigue tu criterio y disfruta la receta.'];
        }
        
        // Crear lista numerada
        pasosArray.forEach((paso, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${paso}`;
            
            // Agregar estilo de borde inferior
            li.style.padding = '12px 0';
            li.style.color = '#2E4437';
            li.style.lineHeight = '1.6';
            li.style.borderBottom = '1px solid #D7F0E0';
            
            listaPasos.appendChild(li);
        });
        
        // Remover borde del último elemento
        const lastLi = listaPasos.lastElementChild;
        if (lastLi) {
            lastLi.style.borderBottom = 'none';
        }
    }
    
    // ==================== ESTADO DE LA RECETA ====================
    const badgeEstado = document.getElementById('badge-estado-receta');
    const btnEmpezarReceta = document.getElementById('btn-empezar-receta');
    
    if (badgeEstado && btnEmpezarReceta) {
        // Verificar si ya está completada
        const estaCompletada = boton ? boton.textContent.includes('Completado') : false;
        
        if (estaCompletada) {
            // Estado COMPLETADA
            badgeEstado.innerHTML = '<i class="ph ph-check-circle"></i><span>Completada</span>';
            badgeEstado.className = 'badge-estado completada';
            badgeEstado.style.background = '#28a745';
            badgeEstado.style.color = 'white';
            badgeEstado.style.border = '2px solid #1e7e34';
            
            btnEmpezarReceta.textContent = '✓ Ya Completada';
            btnEmpezarReceta.disabled = true;
            btnEmpezarReceta.style.background = '#6c757d';
            btnEmpezarReceta.style.cursor = 'not-allowed';
            
            // Remover evento onclick si existe
            btnEmpezarReceta.onclick = null;
            
        } else {
            // Estado DISPONIBLE/PENDIENTE
            const esPendiente = receta.estado === 'pendiente' || false;
            
            if (esPendiente) {
                badgeEstado.innerHTML = '<i class="ph ph-clock"></i><span>Pendiente</span>';
                badgeEstado.className = 'badge-estado pendiente';
                
                btnEmpezarReceta.textContent = 'No Disponible';
                btnEmpezarReceta.disabled = true;
                btnEmpezarReceta.style.background = '#cccccc';
                btnEmpezarReceta.style.cursor = 'not-allowed';
            } else {
                badgeEstado.innerHTML = '<i class="ph ph-check-circle"></i><span>Disponible</span>';
                badgeEstado.className = 'badge-estado disponible';
                
                btnEmpezarReceta.textContent = 'Marcar como Completada';
                btnEmpezarReceta.disabled = false;
                btnEmpezarReceta.style.background = 'linear-gradient(135deg, #E99A3C, #FFB74D)';
                btnEmpezarReceta.style.cursor = 'pointer';
                
                // Configurar evento para marcar como completada
                btnEmpezarReceta.onclick = async () => {
                    await marcarRecetaComoCompletada(tipo, boton);
                };
            }
        }
    }
    
    // Mostrar modal
    const modal = document.getElementById('modal-receta-plan');
    if (modal) {
        modal.classList.remove('oculto');
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal abierto exitosamente');
    }
}

// Función para cerrar modal
function cerrarModalPlan() {
    const modal = document.getElementById('modal-receta-plan');
    if (modal) {
        modal.classList.add('oculto');
        document.body.style.overflow = 'auto';
    }
}

// Función para marcar receta como completada
async function marcarRecetaComoCompletada(tipo, boton) {
    console.log(`📝 Marcando ${tipo} como completada`);
    
    const btnCompletar = document.getElementById('btn-empezar-receta');
    if (!btnCompletar) return;
    
    try {
        btnCompletar.disabled = true;
        btnCompletar.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Procesando...';
        
        // Obtener planId del botón o de localStorage
        const planId = boton ? boton.getAttribute('data-plan-id') : localStorage.getItem('ultimaPlanId');
        
        if (!planId) {
            throw new Error('No se encontró el ID del plan');
        }
        
        // Enviar solicitud al servidor
        const response = await fetch('actualizar_estado_receta.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan_id: planId,
                tipo_comida: tipo,
                completada: true
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Actualizar UI del modal
            const badgeEstado = document.getElementById('badge-estado-receta');
            if (badgeEstado) {
                badgeEstado.innerHTML = '<i class="ph ph-check-circle"></i><span>Completada</span>';
                badgeEstado.className = 'badge-estado completada';
                badgeEstado.style.background = '#28a745';
                badgeEstado.style.color = 'white';
                badgeEstado.style.border = '2px solid #1e7e34';
            }
            
            btnCompletar.textContent = '✓ Ya Completada';
            btnCompletar.style.background = '#6c757d';
            btnCompletar.disabled = true;
            btnCompletar.style.cursor = 'not-allowed';
            
            // Actualizar botón en la tarjeta principal
            if (boton) {
                boton.innerHTML = 'Completado ✓ <i class="ph ph-arrow-circle-right icon-estado-receta"></i>';
                boton.style.background = '#6c757d';
            }
            
            // Mostrar notificación con estilo
            mostrarNotificacion('✅ Receta marcada como completada!', 'success');
            
            // Recargar para actualizar progreso después de 1.5 segundos
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
        } else {
            throw new Error(result.message || 'Error desconocido');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        btnCompletar.disabled = false;
        btnCompletar.textContent = 'Marcar como Completada';
        btnCompletar.style.background = 'linear-gradient(135deg, #E99A3C, #FFB74D)';
        mostrarNotificacion('❌ Error al completar la receta: ' + error.message, 'error');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    let contenedor = document.getElementById('notificaciones-container');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'notificaciones-container';
        contenedor.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000;';
        document.body.appendChild(contenedor);
    }
    
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        background: ${tipo === 'success' ? '#28a745' : '#dc3545'};
        color: white; padding: 15px 20px; border-radius: 8px; margin-bottom: 10px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideInRight 0.3s ease;
        display:flex; gap:10px; align-items:center; min-width:240px;
        font-family: 'Comfortaa', sans-serif;
        z-index: 10001;
    `;
    
    notificacion.innerHTML = `<i class="ph ${tipo === 'success' ? 'ph-check-circle' : 'ph-warning-circle'}"></i><span>${mensaje}</span>`;
    contenedor.appendChild(notificacion);
    
    // Agregar estilos de animación si no existen
    if (!document.querySelector('#notificaciones-animaciones')) {
        const style = document.createElement('style');
        style.id = 'notificaciones-animaciones';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 4500);
}

// Función para inicializar datos de recetas desde el HTML
function inicializarRecetasDesdeHTML() {
    console.log('📊 Inicializando recetas desde HTML...');
    
    // Buscar todos los botones de recetas
    const botonesRecetas = document.querySelectorAll('.btn-ver-receta');
    
    botonesRecetas.forEach(boton => {
        const tipo = boton.getAttribute('data-tipo');
        const recetaJSON = boton.getAttribute('data-receta');
        
        if (tipo && recetaJSON) {
            try {
                const recetaData = JSON.parse(recetaJSON);
                
                // Formatear datos para el modal
                recetasDinamicas[tipo] = {
                    titulo: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - ${recetaData.nombre || 'Receta'}`,
                    nombre: recetaData.nombre || `Receta de ${tipo}`,
                    descripcion: recetaData.explicacion || recetaData.descripcion || 'Receta personalizada según tu plan nutricional.',
                    imagen: recetaData.imagen || '/Images/fondo_pu_oscuro.png',
                    tiempo: recetaData.tiempo || recetaData.tiempo_preparacion || '15 min',
                    dificultad: recetaData.dificultad || 'Media',
                    calorias: recetaData.calorias || 'N/A',
                    tipo: tipo,
                    ingredientes: recetaData.ingredientes || [],
                    preparacion: recetaData.preparacion || recetaData.pasos || [],
                    estado: recetaData.estado || 'disponible'
                };
                
                console.log(`✅ Datos cargados para ${tipo}:`, recetaData.nombre);
                
            } catch (error) {
                console.error(`❌ Error parseando datos de ${tipo}:`, error);
                console.log('JSON problemático:', recetaJSON);
            }
        }
    });
    
    console.log('📦 Recetas dinámicas inicializadas:', recetasDinamicas);
}

// Inicializar event listeners
function inicializarModalesPlan() {
    console.log("🚀 Inicializando modales del plan...");
    
    // Primero, inicializar datos desde el HTML
    inicializarRecetasDesdeHTML();
    
    // Configurar botones "Ver más"
    const botonesVerMas = document.querySelectorAll('.btn-ver-receta');
    console.log(`🔍 Encontrados ${botonesVerMas.length} botones de recetas`);
    
    botonesVerMas.forEach(boton => {
        // Remover cualquier event listener existente para evitar duplicados
        const nuevoBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevoBoton, boton);
        
        nuevoBoton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const tipo = nuevoBoton.getAttribute('data-tipo');
            if (tipo) {
                console.log(`🟢 Botón clickeado: ${tipo}`);
                abrirModalRecetaDashboard(tipo, nuevoBoton);
            }
        });
    });
    
    // Configurar cierre del modal
    const btnCerrar = document.getElementById('cerrar-modal-plan');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarModalPlan);
    }
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modal-receta-plan');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModalPlan();
            }
        });
    }
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modal-receta-plan');
            if (modal && !modal.classList.contains('oculto')) {
                cerrarModalPlan();
            }
        }
    });
    
    console.log('✅ Modales del plan inicializados correctamente');
}

// Hacer funciones disponibles globalmente
window.abrirModalRecetaDashboard = abrirModalRecetaDashboard;
window.abrirModalReceta = abrirModalRecetaDashboard; // Alias para compatibilidad
window.cerrarModalPlan = cerrarModalPlan;
window.inicializarModalesPlan = inicializarModalesPlan;
window.mostrarNotificacion = mostrarNotificacion;

// Auto-inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado - verificando si debemos inicializar modales...');
    
    // Solo inicializar si estamos en la página del dashboard
    if (window.location.pathname.includes('pp_dashboard_miplan.php') || 
        document.querySelector('.recetas_contenedor')) {
        console.log('🏠 Detectado dashboard - inicializando modales...');
        setTimeout(() => {
            inicializarModalesPlan();
        }, 100);
    }
});

// Función para debug
window.debugRecetasModal = function() {
    console.log('=== DEBUG DE MODALES ===');
    console.log('Recetas dinámicas:', recetasDinamicas);
    console.log('Botones encontrados:', document.querySelectorAll('.btn-ver-receta').length);
    console.log('Modal existe:', !!document.getElementById('modal-receta-plan'));
    
    // Probar abrir modal manualmente
    const testReceta = {
        titulo: "Desayuno - Prueba",
        nombre: "Receta de Prueba",
        descripcion: "Esta es una receta de prueba",
        imagen: "/Images/fondo_pu_oscuro.png",
        tiempo: "20 min",
        dificultad: "Fácil",
        calorias: "300 cal",
        tipo: "desayuno",
        ingredientes: ['1 taza de avena', '2 tazas de agua', '1 plátano maduro', '1 cucharada de miel', 'Canela al gusto'],
        preparacion: [
            'Mezclar la avena con el agua en una olla',
            'Cocinar a fuego medio por 10 minutos, revolviendo ocasionalmente',
            'Agregar el plátano machacado y la canela',
            'Cocinar por 5 minutos más hasta que espese',
            'Servir caliente con miel por encima'
        ],
        estado: "disponible"
    };
    
    recetasDinamicas.desayuno = testReceta;
    abrirModalRecetaDashboard('desayuno', { 
        textContent: 'Ver más',
        getAttribute: (attr) => attr === 'data-plan-id' ? 'test-id' : null
    });
};