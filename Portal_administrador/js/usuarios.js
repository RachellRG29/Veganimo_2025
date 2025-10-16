document.addEventListener('DOMContentLoaded', async function() {
    // Verificar si es admin antes de cargar nada
    const response = await fetch('/Login/check_session.php');
    const sessionData = await response.json();
    
    if (!sessionData.logged_in || sessionData.role !== 'admin') {
        // Ocultar o eliminar la tabla si no es admin
        const tablaContainer = document.querySelector('[data-admin-only]');
        if (tablaContainer) {
            tablaContainer.style.display = 'none';
        }
        return; // Salir si no es admin
    }

    // Declarar variables en el ámbito superior
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    const busquedaInput = document.getElementById('busquedaUsuarios');
    let usuariosData = [];

    // Cargar usuarios al iniciar
    cargarUsuarios();

    function cargarUsuarios() {
        fetch('usuarios.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No autorizado');
                }
                return response.json();
            })
            .then(data => {
                usuariosData = data;
                renderizarTabla(data);
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
                tablaUsuarios.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error al cargar usuarios: ${error.message}</td></tr>`;
            });
    }

    // Función para renderizar la tabla
    function renderizarTabla(usuarios) {
        if (usuarios.length === 0) {
            tablaUsuarios.innerHTML = `<tr><td colspan="6" class="text-center">No hay usuarios registrados</td></tr>`;
            return;
        }

        tablaUsuarios.innerHTML = usuarios.map(usuario => `
            <tr data-id="${usuario._id}">
                <td>${usuario.fullname}</td>
                <td>${usuario.email}</td>
                <td>${new Date(usuario.birthdate).toLocaleDateString()}</td>
                <td>${usuario.gender}</td>
                <td>${new Date(usuario.created_at).toLocaleString()}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary btn-editar" data-id="${usuario._id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${usuario._id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Agregar eventos a los botones
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', () => abrirModalEdicion(btn.dataset.id));
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => confirmarEliminacion(btn.dataset.id));
        });
    }

    // Función para buscar usuarios
    busquedaInput.addEventListener('input', function() {
        const termino = this.value.toLowerCase();
        const resultados = usuariosData.filter(usuario => 
            usuario.fullname.toLowerCase().includes(termino) ||
            usuario.email.toLowerCase().includes(termino) ||
            usuario.gender.toLowerCase().includes(termino)
        );
        renderizarTabla(resultados);
    });

    // Función para abrir modal de edición
    function abrirModalEdicion(idUsuario) {
        const usuario = usuariosData.find(u => u._id === idUsuario);
        
        Swal.fire({
            title: 'Editar Usuario',
            html: `
                <form id="formEditarUsuario">
                    <input type="hidden" name="_id" value="${usuario._id}">
                    <div class="mb-3">
                        <label class="form-label">Nombre completo</label>
                        <input type="text" name="fullname" class="form-control" value="${usuario.fullname}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" class="form-control" value="${usuario.email}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Fecha de nacimiento</label>
                        <input type="date" name="birthdate" class="form-control" value="${usuario.birthdate}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Género</label>
                        <select name="gender" class="form-control" required>
                            <option value="Femenino" ${usuario.gender === 'Femenino' ? 'selected' : ''}>Femenino</option>
                            <option value="Masculino" ${usuario.gender === 'Masculino' ? 'selected' : ''}>Masculino</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nueva contraseña (opcional)</label>
                        <input type="password" name="password" class="form-control" placeholder="Dejar vacío para no cambiar">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Confirmar contraseña</label>
                        <input type="password" name="confirmPassword" class="form-control" placeholder="Confirmar nueva contraseña">
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            focusConfirm: false,
            preConfirm: () => {
                const form = document.getElementById('formEditarUsuario');
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Validaciones básicas
                if (!data.fullname || !data.email || !data.birthdate || !data.gender) {
                    Swal.showValidationMessage('Complete todos los campos obligatorios');
                    return false;
                }
                
                if (data.password && data.password !== data.confirmPassword) {
                    Swal.showValidationMessage('Las contraseñas no coinciden');
                    return false;
                }
                
                return data;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                actualizarUsuario(result.value);
            }
        });
    }

    // Función para actualizar usuario
    function actualizarUsuario(datos) {
        fetch('usuarios.php', {
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
                    title: 'Usuario actualizado',
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                cargarUsuarios();
            } else {
                throw new Error('Error al actualizar usuario');
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo actualizar el usuario'
            });
        });
    }

    // Función para confirmar eliminación
    function confirmarEliminacion(idUsuario) {
        Swal.fire({
            title: '¿Eliminar usuario?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarUsuario(idUsuario);
            }
        });
    }

    // Función para eliminar usuario
    function eliminarUsuario(idUsuario) {
        fetch(`usuarios.php?id=${idUsuario}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario eliminado',
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                cargarUsuarios();
            } else {
                throw new Error('Error al eliminar usuario');
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo eliminar el usuario'
            });
        });
    }

    // Escuchar cambios en el formulario de registro para actualizar la tabla
    document.getElementById('formRegistro')?.addEventListener('submit', function() {
        setTimeout(cargarUsuarios, 3500); // Esperar 3.5 segundos (tiempo de redirección)
    });
});