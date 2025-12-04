// dashboard_script.js
console.log('📊 Script del dashboard cargado');

// Función principal de inicialización del dashboard
window.inicializarDashboard = async function() {
    console.log('🚀 Inicializando dashboard...');

    // Si hay planId reciente en localStorage, usarlo
    const planIdReciente = localStorage.getItem('planIdReciente') || localStorage.getItem('ultimaPlanId') || null;

    // Si no tenemos dashboardConfig, iniciarlo vacio
    if (!window.dashboardConfig) {
        window.dashboardConfig = { tienePlan: false, planId: '', recetas: {}, completadas: {} };
    }

    // Si detectamos planRecienCreado o planIdReciente, pedir el plan activo al backend
    const planRecien = localStorage.getItem('planRecienCreado') === 'true' || !!planIdReciente;

    if (planRecien) {
        try {
            const url = planIdReciente ? (`obtener_plan_acual.php?plan_id=${encodeURIComponent(planIdReciente)}`) : 'obtener_plan_acual.php';
            const res = await fetch(url, { method: 'GET', cache: 'no-store' });
            const data = await res.json();

            if (data.success && data.tiene_plan && data.plan) {
                window.dashboardConfig.tienePlan = true;
                window.dashboardConfig.planId = data.plan._id || planIdReciente || '';
                window.dashboardConfig.recetas = data.recetas || {};
                window.dashboardConfig.plan = data.plan || {};
                window.dashboardConfig.completadas = data.plan.completadas || { desayuno:false, almuerzo:false, cena:false };

                // Renderizar tarjetas si la página tiene contenedor
                if (document.getElementById('recetas-contenedor') || document.getElementById('contenedor_recetas')) {
                    // si tu HTML espera recetas en 'recetas-contenedor' insertarlas
                    const cont = document.getElementById('recetas-contenedor') || document.getElementById('contenedor_recetas');
                    if (cont) {
                        // Construir tarjetas usando window.dashboardConfig.recetas
                        cont.innerHTML = ''; // limpiar
                        const recetaObj = window.dashboardConfig.recetas;
                        ['desayuno','almuerzo','cena'].forEach(tipo => {
                            const r = recetaObj[tipo] || { nombre: 'No disponible', imagen: '/Images/default_food.png', calorias: 'N/A', explicacion: '' };
                            const btnData = encodeURIComponent(JSON.stringify(r));
                            const html = `
                                <div class="tarjeta-receta">
                                    <img src="${r.imagen || '/Images/default_food.png'}" alt="${r.nombre}">
                                    <h3>${r.nombre}</h3>
                                    <p>${r.calorias || 'N/A'}</p>
                                    <button class="btn-ver-receta" data-tipo="${tipo}" data-receta='${JSON.stringify(r)}'>Ver</button>
                                </div>`;
                            cont.insertAdjacentHTML('beforeend', html);
                        });
                    }
                }
            } else {
                console.log('ℹ️ No hay plan activo según backend');
            }
        } catch (err) {
            console.error('Error obteniendo plan activo:', err);
        } finally {
            // limpiar bandera temporal
            localStorage.removeItem('planRecienCreado');
        }
    }
};

function configurarBotonesSinPlan() {
    console.log('🔧 Configurando botones sin plan...');
    
    // Botones que redirigen a crear plan
    const botonesPlan = document.querySelectorAll('#btn-desayuno, #btn-almuerzo, #btn-cena');
    console.log(`Encontrados ${botonesPlan.length} botones de plan`);
    
    botonesPlan.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Redirigiendo a crear plan...');
            window.location.href = '/Pantalla_principal/contenidos/dieta_vegana/pp_ia_dieta_vegana.php';
        });
    });
    
    // Botón del mensaje "Crear Plan con IA"
    const btnCrearPlan = document.querySelector('.sin-plan button');
    if (btnCrearPlan) {
        btnCrearPlan.addEventListener('click', function() {
            console.log('Redirigiendo a crear plan IA...');
            window.location.href = '/Pantalla_principal/contenidos/dieta_vegana/pp_ia_dieta_vegana.php';
        });
    }
}

function configurarBotonesRecetas() {
    console.log('🔧 Configurando botones de recetas...');
    
    const botones = document.querySelectorAll('.btn-ver-receta');
    console.log(`Encontrados ${botones.length} botones de recetas`);
    
    botones.forEach(button => {
        button.addEventListener('click', function() {
            const tipo = this.getAttribute('data-tipo');
            let recetaData = {};
            
            try {
                const dataStr = this.getAttribute('data-receta');
                if (dataStr && dataStr !== 'undefined') {
                    recetaData = JSON.parse(dataStr);
                }
            } catch (e) {
                console.error('Error parseando datos de receta:', e);
            }
            
            console.log(`Mostrando receta de ${tipo}:`, recetaData);
            mostrarRecetaModal(tipo, recetaData, window.dashboardConfig.planId);
        });
    });
}

function mostrarRecetaModal(tipo, recetaData, planId) {
    console.log(`📋 Mostrando modal para ${tipo}`);
    
    const modal = document.getElementById('modal-receta-plan');
    if (!modal) {
        console.error('❌ Modal no encontrado');
        return;
    }
    
    const tipoTexto = tipo === 'desayuno' ? 'Desayuno' : 
                     tipo === 'almuerzo' ? 'Almuerzo' : 'Cena';
    
    // Actualizar contenido del modal
    const elementos = {
        titulo: document.getElementById('modal-titulo-plan'),
        nombreReceta: document.getElementById('modal-nombre-receta'),
        descripcion: document.getElementById('modal-descripcion-plan'),
        tiempo: document.getElementById('modal-tiempo-plan'),
        dificultad: document.getElementById('modal-dificultad-plan'),
        calorias: document.getElementById('modal-calorias-plan'),
        imagen: document.getElementById('modal-imagen-plan'),
        letraTipo: document.getElementById('letra-tipo-comida'),
        ingredientes: document.getElementById('modal-ingredientes-plan'),
        pasos: document.getElementById('modal-pasos-plan')
    };
    
    // Actualizar valores
    if (elementos.titulo) elementos.titulo.textContent = `Receta de ${tipoTexto}`;
    if (elementos.nombreReceta) elementos.nombreReceta.textContent = recetaData.nombre || tipoTexto;
    if (elementos.descripcion) elementos.descripcion.textContent = recetaData.descripcion || 'Receta generada por IA según tu perfil.';
    if (elementos.tiempo) elementos.tiempo.textContent = recetaData.tiempo_preparacion || 'N/A';
    if (elementos.dificultad) elementos.dificultad.textContent = recetaData.dificultad || 'Media';
    if (elementos.calorias) elementos.calorias.textContent = recetaData.calorias || 'N/A';
    
    if (elementos.imagen) {
        elementos.imagen.src = recetaData.imagen || '/Images/fondo_pu_oscuro.png';
        elementos.imagen.alt = recetaData.nombre || tipoTexto;
    }
    
    if (elementos.letraTipo) elementos.letraTipo.textContent = tipo.charAt(0).toUpperCase();
    
    // Actualizar ingredientes
    if (elementos.ingredientes) {
        elementos.ingredientes.innerHTML = '';
        
        if (recetaData.ingredientes && Array.isArray(recetaData.ingredientes)) {
            recetaData.ingredientes.forEach(ing => {
                const li = document.createElement('li');
                li.textContent = ing;
                elementos.ingredientes.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Ingredientes no especificados';
            elementos.ingredientes.appendChild(li);
        }
    }
    
    // Actualizar pasos de preparación
    if (elementos.pasos) {
        elementos.pasos.innerHTML = '';
        
        if (recetaData.pasos && Array.isArray(recetaData.pasos)) {
            recetaData.pasos.forEach((paso, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>Paso ${index + 1}:</strong> ${paso.texto || paso}`;
                elementos.pasos.appendChild(li);
            });
        } else if (recetaData.preparacion) {
            const li = document.createElement('li');
            li.textContent = recetaData.preparacion;
            elementos.pasos.appendChild(li);
        } else {
            const li = document.createElement('li');
            li.textContent = 'Preparación no especificada';
            elementos.pasos.appendChild(li);
        }
    }
    
    // Mostrar modal
    modal.classList.remove('oculto');
    
    // Configurar botón de cerrar
    const btnCerrar = document.getElementById('cerrar-modal-plan');
    if (btnCerrar) {
        btnCerrar.onclick = function() {
            modal.classList.add('oculto');
        };
    }
    
    // Configurar botón de completar receta
    const btnCompletar = document.getElementById('btn-empezar-receta');
    if (btnCompletar && planId) {
        btnCompletar.onclick = async function() {
            try {
                console.log(`Marcando receta ${tipo} como completada...`);
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
                    alert('✅ Receta marcada como completada!');
                    location.reload();
                } else {
                    alert('❌ Error: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ Error al actualizar el estado');
            }
        };
    }
    
    // Cerrar modal al hacer clic fuera
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.add('oculto');
        }
    };
}

function inicializarPopupGuia() {
    console.log('🔧 Inicializando popup de guía...');
    
    const btnGuia = document.querySelector('.btn-guia');
    const popupGuia = document.getElementById('popupGuia');
    const cerrarPopup = document.querySelector('.cerrar_popup_x');
    
    if (!btnGuia || !popupGuia || !cerrarPopup) {
        console.warn('⚠️ Elementos del popup de guía no encontrados');
        return;
    }
    
    btnGuia.addEventListener('click', function(e) {
        e.preventDefault();
        popupGuia.classList.add('open');
    });
    
    cerrarPopup.addEventListener('click', function() {
        popupGuia.classList.remove('open');
    });
    
    // Cerrar al hacer clic fuera
    popupGuia.addEventListener('click', function(e) {
        if (e.target === popupGuia) {
            popupGuia.classList.remove('open');
        }
    });
}

function inicializarModalesAdicionales() {
    console.log('🔧 Inicializando modales adicionales...');
    
    // Botón "Crear receta" del div 3
    const btnCrearReceta = document.querySelector('.btn_crear_receta');
    if (btnCrearReceta) {
        btnCrearReceta.addEventListener('click', function() {
            const modalIngredientes = document.getElementById('modal-ingredientes-casa');
            if (modalIngredientes) {
                modalIngredientes.classList.remove('oculto');
                
                // Configurar cerrar
                const btnCerrar = document.getElementById('cerrar-modal-ingredientes');
                if (btnCerrar) {
                    btnCerrar.onclick = function() {
                        modalIngredientes.classList.add('oculto');
                    };
                }
            }
        });
    }
    
    // Botón "Ingresar" del div 4
    const btnIngresarGustos = document.querySelector('.btn_ingresar_gustos');
    if (btnIngresarGustos) {
        btnIngresarGustos.addEventListener('click', function() {
            const modalPreferencias = document.getElementById('modal-preferencias-ingredientes');
            if (modalPreferencias) {
                modalPreferencias.classList.remove('oculto');
                
                // Configurar cerrar
                const btnCerrar = document.getElementById('cerrar-modal-preferencias');
                if (btnCerrar) {
                    btnCerrar.onclick = function() {
                        modalPreferencias.classList.add('oculto');
                    };
                }
            }
        });
    }
}

function verificarPlanRecienCreado() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('plan_creado') === 'true') {
        console.log('🎉 Plan recién creado detectado');
        
        setTimeout(() => {
            // Crear notificación
            const notificacion = document.createElement('div');
            notificacion.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #007848, #00A86B);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideIn 0.5s ease;
                font-family: 'Comfortaa', sans-serif;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            notificacion.innerHTML = `
                <i class="ph ph-check-circle" style="font-size: 20px;"></i>
                <div>
                    <strong>✅ Plan creado exitosamente!</strong><br>
                    <small>Las recetas están listas en tu dashboard.</small>
                </div>
            `;
            
            document.body.appendChild(notificacion);
            
            // Remover después de 5 segundos
            setTimeout(() => {
                notificacion.style.animation = 'slideOut 0.5s ease';
                setTimeout(() => {
                    if (notificacion.parentNode) {
                        notificacion.parentNode.removeChild(notificacion);
                    }
                }, 500);
            }, 5000);
            
            // Agregar estilos de animación si no existen
            if (!document.querySelector('#animaciones-notificacion')) {
                const style = document.createElement('style');
                style.id = 'animaciones-notificacion';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }, 500);
    }
}

// Auto-inicializar si el script se carga después de que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof window.inicializarDashboard === 'function') {
            window.inicializarDashboard();
        }
    });
} else {
    // DOM ya está listo
    if (typeof window.inicializarDashboard === 'function') {
        window.inicializarDashboard();
    }
}

// Exportar funciones al scope global
window.mostrarRecetaModal = mostrarRecetaModal;
window.inicializarPopupGuia = inicializarPopupGuia;