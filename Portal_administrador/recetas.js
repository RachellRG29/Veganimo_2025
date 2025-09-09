document.addEventListener('DOMContentLoaded', function() {
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
                    <button class="btn btn-sm btn-primary btn-editar" data-id="${receta._id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${receta._id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
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

    // =======================================
    // Confirmar eliminación
    // =======================================
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
                        timer: 3000
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
                    text: error.message || 'No se pudo eliminar la receta'
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
            title: `<span style="font-weight:bold; color:#333;">Editar receta</span>`,
            width: '70%',
            heightAuto: false,
            padding: '20px 40px',
            background: '#f8f9fa',
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            cancelButtonText: 'Cancelar',
            showCloseButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            html: `
                <div style="width:100%; display:flex; flex-direction:column; align-items:center;">
                    <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:25px;">
                        <img src="${receta.imagen}" alt="${receta.nombre_receta}" 
                             style="width:180px; height:180px; object-fit:cover; border-radius:15px; box-shadow:0 4px 20px rgba(0,0,0,0.25); margin-bottom:10px;">
                        <span style="font-size:22px; font-weight:700; color:#333;">${receta.nombre_receta}</span>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; width:100%;">
                        <div style="display:flex; flex-direction:column;">
                            <label>Nombre</label>
                            <input id="swal-nombre" class="swal2-input" value="${receta.nombre_receta}">
                        </div>

                        <div style="display:flex; flex-direction:column;">
                            <label>Tiempo preparación</label>
                            <input id="swal-tiempo" class="swal2-input" value="${receta.tiempo_preparacion}">
                        </div>

                       <div style="display:flex; flex-direction:column;">
                       <label>Dificultad</label>
                   <select id="swal-dificultad" class="swal2-select">
                      <option value="" disabled ${!receta.dificultad ? 'selected' : ''}>Seleccionar dificultad</option>
                       <option value="Baja" ${receta.dificultad === 'Baja' ? 'selected' : ''}>Baja</option>
                     <option value="Media" ${receta.dificultad === 'Media' ? 'selected' : ''}>Media</option>
                       <option value="Alta" ${receta.dificultad === 'Alta' ? 'selected' : ''}>Alta</option>
                    </select>
                             </div>


                        <div style="display:flex; flex-direction:column;">
                            <label>Categoría</label>
                            <select id="swal-categoria" class="swal2-select">
                                <option value="" disabled ${!receta.categoria ? 'selected' : ''}>Seleccionar categoría</option>
                                <option value="cat_transc" ${receta.categoria === 'cat_transc' ? 'selected' : ''}>Transicionista</option>
                                <option value="cat_veget" ${receta.categoria === 'cat_veget' ? 'selected' : ''}>Vegetariano</option>
                                <option value="cat_vegan" ${receta.categoria === 'cat_vegan' ? 'selected' : ''}>Vegano</option>
                            </select>
                        </div>

                        <div style="grid-column:1 / span 2; display:flex; flex-direction:column;">
                            <label>Ingredientes (uno por línea)</label>
                            <textarea id="swal-ingredientes" class="swal2-textarea">${ingredientesTexto}</textarea>
                        </div>

                        <div style="grid-column:1 / span 2; display:flex; flex-direction:column;">
                            <label>Descripción</label>
                            <textarea id="swal-descripcion" class="swal2-textarea">${receta.descripcion}</textarea>
                        </div>

                        <div style="grid-column:1 / span 2; display:flex; flex-direction:column; align-items:flex-start;">
                            <label>Calificación</label>
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
                    timer: 3000
                });
                cargarRecetas(); // recargar para reflejar cambios
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'No se pudo actualizar la receta'
                });
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
});
