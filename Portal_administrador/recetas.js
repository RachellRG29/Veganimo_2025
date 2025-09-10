document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos CSS personalizados solo para el modal de edición
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos específicos para el modal de edición de recetas */
        #swal-nombre, #swal-tiempo, #swal-dificultad, #swal-categoria, 
        #swal-ingredientes, #swal-descripcion, #swal-calificacion {
            border-radius: 12px !important;
            border: 2px solid #e0e0e0 !important;
            padding: 12px 15px !important;
            font-size: 15px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05) !important;
            background: #fdfdfd !important;
            color: #333 !important;
        }
        
        #swal-nombre:focus, #swal-tiempo:focus, #swal-dificultad:focus, 
        #swal-categoria:focus, #swal-ingredientes:focus, #swal-descripcion:focus, 
        #swal-calificacion:focus {
            border-color: #007848 !important;
            box-shadow: 0 0 0 3px rgba(0, 120, 72, 0.15) !important;
            outline: none !important;
        }
        
        #swal-ingredientes, #swal-descripcion {
            min-height: 100px !important;
            resize: vertical !important;
        }
        
        #swal-dificultad, #swal-categoria, #swal-calificacion {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23007848' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
            background-repeat: no-repeat !important;
            background-position: right 15px center !important;
            background-size: 16px !important;
            padding-right: 40px !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
        }
        
        .swal2-label {
            font-weight: 600 !important;
            color: #000000ff !important;
            margin-bottom: 8px !important;
            display: block !important;
            text-align: left !important;
            width: 100% !important;
            font-size: 16px !important;
        }
        
        .input-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
            width: 100%;
        }
        
        /* Estilo para el contenedor del modal de edición */
        .swal2-popup {
            border-radius: 18px !important;
            padding: 28px 32px !important;
            background: #FFFFFF !important;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25) !important;
            width: auto !important;
        }
        
        /* Estilo para el botón de cerrar del modal de edición */
        .swal2-close {
            position: absolute !important;
            top: 15px !important;
            right: 15px !important;
            width: 34px !important;
            height: 34px !important;
            border: none !important;
            border-radius: 8px !important;
            background-color: #007848 !important;
            color: #DAFFDA !important;
            font-size: 26px !important;
            line-height: 34px !important;
            text-align: center !important;
            cursor: pointer !important;
            user-select: none !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
            transition: all 0.2s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
        }
        
        .swal2-close:hover {
            background: #006640 !important;
            color: #FFFFFF !important;
            transform: rotate(90deg) scale(1.1) !important;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3) !important;
        }
        
        /* Estilo para los botones del modal de edición */
        .swal2-confirm {
            background-color: #E99A3C !important;
            border-radius: 10px !important;
            padding: 10px 24px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
            border: none !important;
        }
        
        .swal2-confirm:hover {
            background-color: #E99A3C !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 8px rgba(0, 120, 72, 0.3) !important;
        }
        
        /* Ocultar la X en los toast */
        .swal2-toast .swal2-close {
            display: none !important;
        }
      
        
    `;
    document.head.appendChild(style);

    const tablaRecetas = document.getElementById('tablaRecetas');
    let recetasData = [];

    cargarRecetas();

    // =======================================
    // Cargar recetas
    // =======================================
    function cargarRecetas() {
        fetch('/Portal_administrador/cargar_recetas.php')
            .then(response => response.json())
            .then(data => {
                if (!data.success) throw new Error('Error al cargar las recetas');
                recetasData = data.data;
                renderizarTabla(recetasData);
            })
            .catch(error => {
                tablaRecetas.innerHTML = `<tr><td colspan="11" class="text-center text-danger">Error al cargar recetas: ${error.message}</td></tr>`;
            });
    }

    // =======================================
    // Renderizar tabla
    // =======================================
    function renderizarTabla(recetas) {
        if (recetas.length === 0) {
            tablaRecetas.innerHTML = `<tr><td colspan="11" class="text-center">No hay recetas registradas</td></tr>`;
            return;
        }

        tablaRecetas.innerHTML = recetas.map(receta => `
            <tr data-id="${receta._id}">
                <td>
                    <img src="${receta.imagen}" alt="${receta.nombre_receta}" 
                         style="width:60px;height:60px;border-radius:5px;object-fit:cover;">
                </td>
                <td>${receta.nombre_receta}</td>
                <td>${receta.descripcion.length > 50 ? receta.descripcion.substr(0, 50) + '...' : receta.descripcion}</td>
                <td>${receta.tiempo_preparacion || '-'}</td>
                <td>${receta.dificultad || '-'}</td>
                <td>${receta.categoria || '-'}</td>
                <td>
                    ${Array.isArray(receta.ingredientes_array) 
                        ? receta.ingredientes_array.join(", ") 
                        : (receta.ingredientes || "-")}
                </td>
                <td class="text-center">
                    ${receta.calificacion && receta.calificacion > 0
                        ? '⭐'.repeat(Math.round(receta.calificacion))
                        : 'Sin calificar'}
                </td>
                <td>${receta.fecha_creacion ? new Date(receta.fecha_creacion).toLocaleDateString() : '-'}</td>
                <td class="text-center">
                    <div class="btn-group">
                    <!-- Botón Editar -->
                    <button class="btn btn-baneo btn-primary btn-editar" data-id="${receta._id}">
                        <i class="ph ph-pencil-line editar-icon"></i>
                        <span class="baneo-text">Editar</span>
                    </button>

                    <!-- Botón Eliminar -->
                    <button class="btn btn-danger btn-eliminar" data-id="${receta._id}">
                        <i class="ph ph-trash eliminar-icon"></i>
                        <span class="eliminar-text">Eliminar</span>
                    </button>
                    </div>

                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', () => abrirModalEditar(btn.dataset.id));
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => confirmarEliminacion(btn.dataset.id));
        });
    }

        /* css botones de bloquear y eliminar*/
        document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style");
        style.textContent = `
        .btn-group {
            display: flex;
            gap: 6px;
            align-items: center;
        }

        /* Botones comunes (reutilizando estilo usuarios) */
        .btn-editar, .btn-eliminar {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            height: 34px;       /* altura igual a btn-sm */
            min-width: 34px;    /* ancho inicial cuadrado */
            padding: 0 8px;
            border-radius: 0.25rem;
            overflow: hidden;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        /* Expandir al hover (solo ancho) */
        .btn-editar:hover, .btn-eliminar:hover {
            width: 20px;
            justify-content: flex-start;
            padding-left: 8px;
        }

        /* Iconos siempre visibles */
        .baneo-icon, .eliminar-icon, .editar-icon {
            font-size: 16px;
            transition: transform 0.3s ease;
        }

        /* Rotar icono editar al hover */
        .btn-baneo.btn-editar:hover .editar-icon {
            transform: rotate(360deg);
        }

        /* Texto siempre visible */
        .baneo-text, .eliminar-text {
            white-space: nowrap;
            font-size: 14px;
            font-weight: bold;
            margin-left: 6px;
        }

        /* Evitar que los botones se desborden en tablas */
        .btn-group .btn {
            flex-shrink: 0;
        }
        `;
        document.head.appendChild(style);
        });



    // =======================================
    // Confirmar eliminación
    // =======================================
    function confirmarEliminacion(idReceta) {
        Swal.fire({
            title: '¿Eliminar receta?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgba(212, 0, 0, 1)',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) eliminarReceta(idReceta);
        });
    }

    // =======================================
    // Eliminar receta
    // =======================================
    function eliminarReceta(idReceta) {
        fetch(`/Portal_administrador/recetas.php?id=${idReceta}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Receta eliminada',
                        toast: true,
                        position: 'bottom-end',
                        showConfirmButton: false,
                        timer: 3000,
                        showCloseButton: false
                    });
                    cargarRecetas();
                } else {
                    throw new Error(data.error || 'No se pudo eliminar la receta');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'No se pudo eliminar la receta',
                    showCloseButton: true
                });
            });
    }

    // =======================================
    // Editar receta modal
    // =======================================
    function abrirModalEditar(idReceta) {
        const receta = recetasData.find(r => r._id === idReceta);
        if (!receta) return;

        const ingredientesTexto = Array.isArray(receta.ingredientes_array) 
            ? receta.ingredientes_array.join("\n") 
            : receta.ingredientes;

        Swal.fire({
            title: `<span style="font-weight:bold; color:#007848;">Editar receta</span>`,
            width: '70%',
            heightAuto: false,
            padding: '28px 32px',
            background: '#fdfdfd',
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            showCloseButton: true,
            closeButtonHtml: '&times;',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                closeButton: 'custom-close-button'
            },
            html: `
                <div style="width:100%; display:flex; flex-direction:column; align-items:center;">
                    <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:25px;">
                        <img src="${receta.imagen}" alt="${receta.nombre_receta}" 
                             style="width:180px; height:180px; object-fit:cover; border-radius:15px; box-shadow:0 4px 20px rgba(0,0,0,0.25); margin-bottom:10px;">
                        <span style="font-size:22px; font-weight:700; color:#007848;">${receta.nombre_receta}</span>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; width:100%;">
                        <div class="input-group">
                            <label class="swal2-label">Nombre</label>
                            <input id="swal-nombre" class="swal2-input" value="${receta.nombre_receta}">
                        </div>

                        <div class="input-group">
                            <label class="swal2-label">Tiempo preparación</label>
                            <input id="swal-tiempo" class="swal2-input" value="${receta.tiempo_preparacion}">
                        </div>

                       <div class="input-group">
                           <label class="swal2-label">Dificultad</label>
                           <select id="swal-dificultad" class="swal2-select">
                              <option value="" disabled ${!receta.dificultad ? 'selected' : ''}>Seleccionar dificultad</option>
                               <option value="Baja" ${receta.dificultad === 'Baja' ? 'selected' : ''}>Baja</option>
                             <option value="Media" ${receta.dificultad === 'Media' ? 'selected' : ''}>Media</option>
                               <option value="Alta" ${receta.dificultad === 'Alta' ? 'selected' : ''}>Alta</option>
                            </select>
                        </div>

                        <div class="input-group">
                            <label class="swal2-label">Categoría</label>
                            <select id="swal-categoria" class="swal2-select">
                                <option value="" disabled ${!receta.categoria ? 'selected' : ''}>Seleccionar categoría</option>
                                <option value="cat_transc" ${receta.categoria === 'cat_transc' ? 'selected' : ''}>Transicionista</option>
                                <option value="cat_veget" ${receta.categoria === 'cat_veget' ? 'selected' : ''}>Vegetariano</option>
                                <option value="cat_vegan" ${receta.categoria === 'cat_vegan' ? 'selected' : ''}>Vegano</option>
                            </select>
                        </div>

                        <div class="input-group" style="grid-column:1 / span 2;">
                            <label class="swal2-label">Ingredientes (uno por línea)</label>
                            <textarea id="swal-ingredientes" class="swal2-textarea">${ingredientesTexto}</textarea>
                        </div>

                        <div class="input-group" style="grid-column:1 / span 2;">
                            <label class="swal2-label">Descripción</label>
                            <textarea id="swal-descripcion" class="swal2-textarea">${receta.descripcion}</textarea>
                        </div>

                        <div class="input-group" style="grid-column:1 / span 2;">
                            <label class="swal2-label">Calificación</label>
                            <select id="swal-calificacion" class="swal2-select" style="width:150px;">
                                <option value="1" ${receta.calificacion == 1 ? 'selected' : ''}>⭐ 1</option>
                                <option value="2" ${receta.calificacion == 2 ? 'selected' : ''}>⭐⭐ 2</option>
                                <option value="3" ${receta.calificacion == 3 ? 'selected' : ''}>⭐⭐⭐ 3</option>
                                <option value="4" ${receta.calificacion == 4 ? 'selected' : ''}>⭐⭐⭐⭐ 4</option>
                                <option value="5" ${receta.calificacion == 5 ? 'selected' : ''}>⭐⭐⭐⭐⭐ 5</option>
                            </select>
                        </div>
                    </div>
                </div>
            `,
            preConfirm: () => ({
                _id: receta._id,
                nombre_receta: document.getElementById('swal-nombre').value,
                descripcion: document.getElementById('swal-descripcion').value,
                tiempo_preparacion: document.getElementById('swal-tiempo').value,
                dificultad: document.getElementById('swal-dificultad').value,
                categoria: document.getElementById('swal-categoria').value,
                ingredientes: document.getElementById('swal-ingredientes').value
                                .split("\n").map(i => i.trim()).filter(i => i !== ""),
                calificacion: parseInt(document.getElementById('swal-calificacion').value)
            })
        }).then(result => {
            if (result.isConfirmed) guardarEdicion(result.value);
        });
    }

    // =======================================
    // Guardar edición
    // =======================================
    function guardarEdicion(datos) {
        fetch(`/Portal_administrador/recetas.php?id=${datos._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Receta actualizada',
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: false 
                });
                cargarRecetas(); // recargar para reflejar cambios
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'No se pudo actualizar la receta',
                    showCloseButton: true 
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo actualizar la receta',
                showCloseButton: true 
            });
        });
    }
});