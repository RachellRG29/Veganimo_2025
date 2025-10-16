document.addEventListener('DOMContentLoaded', async function() {
    // Verificar si es admin antes de cargar nada
    const response = await fetch('/Login/check_session.php');
    const sessionData = await response.json();
    
    if (!sessionData.logged_in || sessionData.role !== 'admin') {
        const tablaContainer = document.querySelector('[data-admin-only]');
        if (tablaContainer) tablaContainer.style.display = 'none';
        return;
    }

    const tablaUsuarios = document.getElementById('tablaUsuarios');
    const busquedaInput = document.getElementById('busquedaUsuarios');
    let usuariosData = [];

    cargarUsuarios();

    function cargarUsuarios() {
        fetch('usuarios.php')
            .then(response => {
                if (!response.ok) throw new Error('No autorizado');
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
                    <div class="btn-group">
                    <!-- Botón Baneo -->
                    <button class="btn btn-baneo ${usuario.banned ? 'btn-success' : 'btn-warning'} ${usuario.role === 'admin' ? 'disabled' : ''}" data-id="${usuario._id}">
                        <i class="ph ${usuario.banned ? 'ph-lock-open' : 'ph-prohibit'} baneo-icon"></i>
                        <span class="baneo-text">${usuario.banned ? 'Desbloquear' : 'Bloquear'}</span>
                    </button>

                    <!-- Botón Eliminar -->
                    <button class="btn btn-danger btn-eliminar" data-id="${usuario._id}" ${usuario.role === 'admin' ? 'disabled' : ''}>
                        <i class="ph-fill ph-trash eliminar-icon"></i>
                        <span class="eliminar-text">Eliminar</span>
                    </button>
                    </div>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-baneo').forEach(btn => {
            btn.addEventListener('click', () => toggleBaneo(btn.dataset.id));
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => confirmarEliminacion(btn.dataset.id));
        });
    }

        
    // =========================
    // BUSCADOR EN TIEMPO REAL
    // =========================
    busquedaInput.addEventListener('input', function() {
        const termino = this.value.toLowerCase();
        const resultados = usuariosData.filter(usuario => 
            usuario.fullname.toLowerCase().includes(termino) ||
            usuario.email.toLowerCase().includes(termino) ||
            usuario.gender.toLowerCase().includes(termino) ||
            usuario._id.toLowerCase().includes(termino)
        );
        renderizarTabla(resultados);
    });

    // =========================
    // BLOQUEAR / DESBLOQUEAR
    // =========================
    function toggleBaneo(idUsuario) {
        const usuario = usuariosData.find(u => u._id === idUsuario);

        if (usuario.role === 'admin') {
            Swal.fire({
                icon: 'warning',
                title: 'No permitido',
                text: 'No puedes bloquear a un administrador',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const nuevoEstado = !usuario.banned;
        const accion = nuevoEstado ? 'bloquear' : 'desbloquear';

        Swal.fire({
            title: `¿Desea ${accion} a este usuario?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: nuevoEstado ? '#d33' : '#28a745',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                fetch('/Portal_administrador/baneo.php', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id: idUsuario, banned: nuevoEstado })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: nuevoEstado ? 'Usuario bloqueado' : 'Usuario desbloqueado',
                            toast: true,
                            position: 'bottom-end',
                            showConfirmButton: false,
                            timer: 3000
                        });
                        cargarUsuarios();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.error || 'No se pudo actualizar el estado del usuario'
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'No se pudo actualizar el estado del usuario'
                    });
                });
            }
        });
    }

    // =========================
    // ELIMINAR USUARIO
    // =========================
    function confirmarEliminacion(idUsuario) {
        const usuario = usuariosData.find(u => u._id === idUsuario);

        if (usuario.role === 'admin') {
            Swal.fire({
                icon: 'warning',
                title: 'No permitido',
                text: 'No puedes eliminar a un administrador',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        Swal.fire({
            title: '¿Eliminar usuario?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) eliminarUsuario(idUsuario);
        });
    }

    function eliminarUsuario(idUsuario) {
        fetch(`usuarios.php?id=${idUsuario}`, { method: 'DELETE' })
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

    // =========================
    // RECARGA TRAS REGISTRO
    // =========================
    document.getElementById('formRegistro')?.addEventListener('submit', function() {
        setTimeout(cargarUsuarios, 3500);
    });
});


    // =========================
    // DISEÑO CSS DINÁMICO portal usuarios y recetas
    // =========================
    document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = `
    .btn-group {
        display: flex;
        align-items: center;
    }

    /*Usuarios*/
    /* Botón de baneo */
        .btn-baneo {
            font-size: 0.85rem;
            background: linear-gradient(to right, #FABC3F, #ECE852);
            border: 2px solid #F6FFFE;
            padding: 0.35rem 0.7rem;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            border-radius: 0.35rem;
            transition: all 0.2s ease;
            position: relative;
        }

        .baneo-icon, 
        .eliminar-icon,
        .editar-icon{
            font-size: 18px;
            font-style: bold;
        }

        .btn-baneo:hover .baneo-icon{
            animation: rotationBack 1s linear infinite reverse;
        }

        @keyframes rotationBack {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(-360deg);
        }
        }  

        /* Botón eliminar */
        .btn-eliminar {
            font-size: 0.85rem;
            padding: 0.35rem 0.7rem;
            display: flex;
            background: linear-gradient(to right, #c72e2eff, #D32F2F);
            border: 2px solid #F6FFFE;
            align-items: center;
            gap: 0.3rem;
            border-radius: 0.35rem;
            transition: all 0.2s ease;
        }

        /* Iconos dentro de los botones */
        .baneo-icon, .eliminar-text {
            vertical-align: middle;
        }

        /* Para no afectar la tabla */
        td .btn-group {
            justify-content: flex-start; /* que los botones se alineen a la izquierda en la celda */
        }


        /*boton editar/modificar de recetas*/
        .btn-edit {
            font-size: 0.85rem;
            background: linear-gradient(to right, #157bd4ff, #1E88E5);
            border: 2px solid #F6FFFE;
            padding: 0.35rem 0.7rem;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            border-radius: 0.35rem;
            transition: all 0.2s ease;
            position: relative;
        }


    `;
    document.head.appendChild(style);
    });