document.addEventListener('DOMContentLoaded', function() {
    const tablaRecetas = document.getElementById('tablaRecetas');
    let recetasData = [];

    cargarRecetas();

    function cargarRecetas() {
        fetch('/Portal_administrador/cargar_recetas.php')
            .then(response => response.json())
            .then(data => {
                if (!data.success) throw new Error('Error al cargar las recetas');
                recetasData = data.data;
                renderizarTabla(recetasData);
            })
            .catch(error => {
                tablaRecetas.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Error al cargar recetas: ${error.message}</td></tr>`;
            });
    }

    function renderizarTabla(recetas) {
        if (recetas.length === 0) {
            tablaRecetas.innerHTML = `<tr><td colspan="9" class="text-center">No hay recetas registradas</td></tr>`;
            return;
        }

        tablaRecetas.innerHTML = recetas.map(receta => `
            <tr data-id="${receta._id}">
                <td>
                    <img src="${receta.imagen}" alt="${receta.nombre_receta}" style="width:60px;height:60px;border-radius:5px;object-fit:cover;">
                </td>
                <td>${receta.nombre_receta}</td>
                <td>${receta.descripcion.length > 50 ? receta.descripcion.substr(0, 50) + '...' : receta.descripcion}</td>
                <td>${receta.tiempo_preparacion || '-'}</td>
                <td>${receta.dificultad || '-'}</td>
                <td>${receta.categoria || '-'}</td>
             
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
    // Editar receta
    // =======================================
    function abrirModalEditar(idReceta) {
        const receta = recetasData.find(r => r._id === idReceta);
        if (!receta) return;

        Swal.fire({
            title: `Editar receta: ${receta.nombre_receta}`,
            html: `
                <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${receta.nombre_receta}">
                <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${receta.descripcion}</textarea>
                <input id="swal-tiempo" class="swal2-input" placeholder="Tiempo preparación" value="${receta.tiempo_preparacion}">
                <input id="swal-dificultad" class="swal2-input" placeholder="Dificultad" value="${receta.dificultad}">
                <input id="swal-categoria" class="swal2-input" placeholder="Categoría" value="${receta.categoria}">
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            preConfirm: () => {
                return {
                    _id: receta._id,
                    nombre_receta: document.getElementById('swal-nombre').value,
                    descripcion: document.getElementById('swal-descripcion').value,
                    tiempo_preparacion: document.getElementById('swal-tiempo').value,
                    dificultad: document.getElementById('swal-dificultad').value,
                    categoria: document.getElementById('swal-categoria').value
                };
            }
        }).then(result => {
            if (result.isConfirmed) {
                guardarEdicion(result.value);
            }
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
                cargarRecetas();
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
