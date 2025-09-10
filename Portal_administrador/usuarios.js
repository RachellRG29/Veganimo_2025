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
                        <i class="fas fa-trash-alt"></i>
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

    busquedaInput.addEventListener('input', function() {
        const termino = this.value.toLowerCase();
        const resultados = usuariosData.filter(usuario => 
            usuario.fullname.toLowerCase().includes(termino) ||
            usuario.email.toLowerCase().includes(termino) ||
            usuario.gender.toLowerCase().includes(termino)
        );
        renderizarTabla(resultados);
    });

    function toggleBaneo(idUsuario) {
        const usuario = usuariosData.find(u => u._id === idUsuario);

        // Verificar si es admin antes de banear
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

    function confirmarEliminacion(idUsuario) {
        const usuario = usuariosData.find(u => u._id === idUsuario);

        // Verificar si es admin antes de continuar
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
            return; // salir de la función
        }

        // Si no es admin, mostrar confirmación normal
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

    document.getElementById('formRegistro')?.addEventListener('submit', function() {
        setTimeout(cargarUsuarios, 3500);
    });
});


/* diseño css */
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
  .btn-group {
    display: flex;
    gap: 6px; /* espacio entre botones */
    align-items: center;
  }

  /* Botones comunes */
  .btn-baneo, .btn-eliminar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 34px; /* mismo alto para ambos */
    min-width: 34px; /* mismo ancho inicial */
    padding: 0 8px;
    border-radius: 0.25rem;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  /* Botón baneo: animación al hover */
  .btn-baneo:hover {
    width: 120px; /* ancho expandido */
    justify-content: flex-start;
    padding-left: 8px;
  }

  /* Iconos */
  .baneo-icon, .btn-eliminar i {
    font-size: 16px;
    transition: transform 0.3s ease;
  }

  /* Animación icono baneo al hover */
  .btn-baneo:hover .baneo-icon {
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

