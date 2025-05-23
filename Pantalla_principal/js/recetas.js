
// Variables globales
let recetasData = [];

// Función principal para cargar recetas
window.cargarRecetas = function() {
    const tablaRecetas = document.getElementById('tablaRecetas');
    if (!tablaRecetas) {
        console.error('Elemento tablaRecetas no encontrado');
        return;
    }

    // Mostrar estado de carga
    tablaRecetas.innerHTML = '<tr><td colspan="6" class="text-center">Cargando recetas...</td></tr>';

    fetch('/Pantalla_principal/recetas.php')
        .then(async response => {
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Error al cargar recetas');
            }
            return data.data; // Accedemos al array dentro de la propiedad data
        })
        .then(recetas => {
            if (!Array.isArray(recetas)) {
                throw new Error('Formato de datos inválido');
            }
            recetasData = recetas;
            renderizarTabla(recetas);
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarErrorEnTabla(error.message);
        });
};

// Función para mostrar errores en la tabla
function mostrarErrorEnTabla(mensaje) {
    const tablaRecetas = document.getElementById('tablaRecetas');
    if (tablaRecetas) {
        tablaRecetas.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    ${mensaje}
                    <button onclick="cargarRecetas()" class="btn btn-sm btn-warning mt-2">
                        Reintentar
                    </button>
                </td>
            </tr>
        `;
    }
}

// Función para renderizar la tabla
function renderizarTabla(recetas) {
    const tablaRecetas = document.getElementById('tablaRecetas');
    if (!tablaRecetas) return;

    if (!recetas || recetas.length === 0) {
        tablaRecetas.innerHTML = '<tr><td colspan="6" class="text-center">No hay recetas registradas</td></tr>';
        return;
    }

    try {
        const rows = recetas.map(receta => {
            // Validación básica de la estructura de la receta
            if (!receta?._id || !receta?.nombre_receta) {
                console.warn('Receta con estructura inválida:', receta);
                return null;
            }

            return `
                <tr data-id="${receta._id}">
                    <td>${receta.nombre_receta || ''}</td>
                    <td>${(receta.descripcion || '').substring(0, 50)}${receta.descripcion?.length > 50 ? '...' : ''}</td>
                    <td>${receta.tiempo_preparacion || ''}</td>
                    <td>${receta.dificultad || ''}</td>
                    <td>${receta.fecha_creacion ? new Date(receta.fecha_creacion).toLocaleString() : ''}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-primary btn-editar" data-id="${receta._id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${receta._id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).filter(row => row !== null).join('');

        tablaRecetas.innerHTML = rows || '<tr><td colspan="6" class="text-center">Datos no válidos</td></tr>';
        
        // Configurar eventos de los botones
        configurarEventosBotones();
    } catch (error) {
        console.error('Error al renderizar tabla:', error);
        mostrarErrorEnTabla('Error al mostrar las recetas');
    }
}

// Configurar eventos para botones de editar/eliminar
function configurarEventosBotones() {
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => abrirModalEdicion(btn.dataset.id));
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminacion(btn.dataset.id));
    });
}

// Función para buscar recetas
function configurarBusqueda() {
    const busquedaInput = document.getElementById('busquedaRecetas');
    if (!busquedaInput) return;

    busquedaInput.addEventListener('input', function() {
        const termino = this.value.toLowerCase();
        const resultados = recetasData.filter(receta => 
            (receta.nombre_receta?.toLowerCase().includes(termino) ||
            (receta.descripcion?.toLowerCase().includes(termino)) ||
            (receta.dificultad?.toLowerCase().includes(termino))
        ));
        renderizarTabla(resultados);
    });
}

// Función para abrir modal de edición
function abrirModalEdicion(idReceta) {
    const receta = recetasData.find(r => r._id === idReceta);
    if (!receta) return;

    Swal.fire({
        title: 'Editar receta',
        html: `
            <form id="formEditarReceta">
                <input type="hidden" name="_id" value="${receta._id}">
                <div class="mb-4">
                    <label class="form-label">Nombre:</label>
                    <input type="text" name="nombre_receta" class="form-control" value="${receta.nombre_receta || ''}" required>
                </div>
                <div class="mb-4">
                    <label class="form-label">Descripción:</label>
                    <textarea name="descripcion" class="form-control" required>${receta.descripcion || ''}</textarea>
                </div>
                <div class="mb-4">
                    <label class="form-label">Tiempo:</label>
                    <input type="text" name="tiempo_preparacion" class="form-control" value="${receta.tiempo_preparacion || ''}" required>
                </div>
                <div class="mb-4">
                    <label class="form-label">Dificultad:</label>
                    <select name="dificultad" class="form-control" required>
                        <option value="Baja" ${receta.dificultad === 'Baja' ? 'selected' : ''}>Baja</option>
                        <option value="Media" ${receta.dificultad === 'Media' ? 'selected' : ''}>Media</option>
                        <option value="Alta" ${receta.dificultad === 'Alta' ? 'selected' : ''}>Alta</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="form-label">Ingredientes:</label>
                    <div id="ingredientes-edicion">
                        ${(receta.ingredientes || []).map((ing, i) => `
                            <input type="text" name="ingredientes[]" class="form-control mb-2" value="${ing}" placeholder="Ingrediente ${i+1}">
                        `).join('')}
                    </div>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="agregarIngredienteEdicion()">+ Añadir ingrediente</button>
                </div>
                <div class="mb-4">
                    <label class="form-label">Pasos:</label>
                    <div id="pasos-edicion">
                        ${(receta.pasos || []).map((paso, i) => `
                            <input type="text" name="pasos[]" class="form-control mb-2" value="${paso}" placeholder="Paso ${i+1}">
                        `).join('')}
                    </div>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="agregarPasoEdicion()">+ Añadir paso</button>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        width: '60%',
        preConfirm: () => {
            const form = document.getElementById('formEditarReceta');
            if (!form) return false;
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Convertir ingredientes y pasos a arrays
            data.ingredientes = Array.from(form.querySelectorAll('input[name="ingredientes[]"]')).map(input => input.value);
            data.pasos = Array.from(form.querySelectorAll('input[name="pasos[]"]')).map(input => input.value);
            
            // Validaciones
            if (!data.nombre_receta || !data.descripcion || !data.tiempo_preparacion || !data.dificultad) {
                Swal.showValidationMessage('Complete todos los campos obligatorios');
                return false;
            }
            
            return data;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            actualizarReceta(result.value);
        }
    });
}

// Función para actualizar receta
function actualizarReceta(datos) {
    fetch('recetas.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Receta actualizada!',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000
            });
            cargarRecetas();
        } else {
            throw new Error(data.error || 'Error al actualizar');
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo actualizar la receta'
        });
    });
}

// Función para confirmar eliminación
function confirmarEliminacion(idReceta) {
    Swal.fire({
        title: '¿Eliminar receta?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarReceta(idReceta);
        }
    });
}

// Función para eliminar receta
function eliminarReceta(idReceta) {
    fetch(`recetas.php?id=${idReceta}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Receta eliminada!',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000
            });
            cargarRecetas();
        } else {
            throw new Error(data.error || 'Error al eliminar');
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo eliminar la receta'
        });
    });
}

// Funciones para agregar campos dinámicos en el modal de edición
window.agregarIngredienteEdicion = function() {
    const container = document.getElementById('ingredientes-edicion');
    if (!container) return;
    
    const count = container.querySelectorAll('input').length + 1;
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'ingredientes[]';
    input.className = 'form-control mb-2';
    input.placeholder = `Ingrediente ${count}`;
    container.appendChild(input);
};

window.agregarPasoEdicion = function() {
    const container = document.getElementById('pasos-edicion');
    if (!container) return;
    
    const count = container.querySelectorAll('input').length + 1;
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'pasos[]';
    input.className = 'form-control mb-2';
    input.placeholder = `Paso ${count}`;
    container.appendChild(input);
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar recetas si existe la tabla
    if (document.getElementById('tablaRecetas')) {
        cargarRecetas();
        configurarBusqueda();
    }
    
    // Configurar envío de formulario
    document.getElementById('form-receta')?.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría tu lógica para guardar la receta
        setTimeout(cargarRecetas, 2000); // Recargar después de guardar
    });
});