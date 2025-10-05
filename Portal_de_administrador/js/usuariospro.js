// usuariospro.js

document.addEventListener('DOMContentLoaded', async () => {
    await waitForTablaUsuariosPro();

    const response = await fetch('/Login/check_session.php');
    const sessionData = await response.json();
    if (!sessionData.logged_in || sessionData.role !== 'admin') {
        const tablaContainer = document.querySelector('[data-pro-only]');
        if (tablaContainer) tablaContainer.style.display = 'none';
        return;
    }

    cargarUsuariosPro();

    const buscador = document.getElementById("busquedaUsuariosPro");
    if (buscador) buscador.addEventListener("input", filtrarUsuariosPro);
});

let listaUsuariosPro = [];

// Esperar a que la tabla exista
function waitForTablaUsuariosPro() {
    return new Promise(resolve => {
        const check = () => {
            if (document.getElementById('tablaUsuariosPro')) resolve();
            else setTimeout(check, 50);
        };
        check();
    });
}

// Mostrar "Cargando..."
function mostrarCargandoPro() {
    const tbody = document.getElementById('tablaUsuariosPro');
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-white">Cargando usuarios PRO...</td></tr>`;
    }
}

// Cargar usuarios PRO desde backend
function cargarUsuariosPro() {
    mostrarCargandoPro();

    fetch('/Portal_de_administrador/usuariospro.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                listaUsuariosPro = data.data;
                mostrarUsuariosPro(listaUsuariosPro);
            } else {
                document.getElementById("tablaUsuariosPro").innerHTML = `
                    <tr><td colspan="8" class="text-center text-white">${data.message}</td></tr>
                `;
            }
        })
        .catch(err => {
            console.error("Error al cargar usuarios PRO:", err);
            document.getElementById("tablaUsuariosPro").innerHTML = `
                <tr><td colspan="8" class="text-center text-white">⚠️ Error al cargar usuarios PRO.</td></tr>
            `;
        });
}

// Mostrar usuarios con botones dinámicos
function mostrarUsuariosPro(usuarios) {
    const tbody = document.getElementById("tablaUsuariosPro");
    if (!tbody) return;

    if (usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-white">No hay usuarios PRO registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = usuarios.map(user => `
        <tr data-id="${user._id}" class="text-center">
            <td>${user.nombre_completo}</td>
            <td>${user.email}</td>
            <td>${user.fecha_nacimiento}</td>
            <td>${user.genero}</td>
            <td>${user.plan}</td>
            <td>${user.tiempo_restante || '—'}</td>
            <td>${user.fecha_creacion}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-baneo ${user.banned ? 'btn-success' : 'btn-warning'} ${user.role === 'admin' ? 'disabled' : ''}" 
                            data-id="${user.usuario_id || user._id}">
                        <i class="ph ${user.banned ? 'ph-lock-open' : 'ph-prohibit'} baneo-icon"></i>
                        <span class="baneo-text">${user.banned ? 'Desbloquear' : 'Bloquear'}</span>
                    </button>
                    <button class="btn btn-danger btn-eliminar" 
                            data-id="${user.usuario_id || user._id}" 
                            ${user.role === 'admin' ? 'disabled' : ''}>
                        <i class="ph-fill ph-trash eliminar-icon"></i>
                        <span class="eliminar-text">Eliminar</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Eventos dinámicos
    document.querySelectorAll('.btn-baneo').forEach(btn => {
        btn.addEventListener('click', () => toggleBaneoPro(btn.dataset.id, btn));
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminacionPro(btn.dataset.id));
    });
}

// Buscador en tiempo real
function filtrarUsuariosPro() {
    const valor = this.value.toLowerCase();
    const filtrados = listaUsuariosPro.filter(user =>
        user.nombre_completo.toLowerCase().includes(valor) ||
        user.email.toLowerCase().includes(valor) ||
        user.plan.toLowerCase().includes(valor)
    );
    mostrarUsuariosPro(filtrados);
}

// =========================
// BLOQUEAR / DESBLOQUEAR USUARIO PRO (dinámico)
// =========================
function toggleBaneoPro(idUsuario, btn) {
    const usuario = listaUsuariosPro.find(u => u.usuario_id === idUsuario);
    if (!usuario) return;

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
        title: `¿Desea ${accion} a este usuario PRO?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: nuevoEstado ? '#d33' : '#28a745',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (!result.isConfirmed) return;

        fetch('/Portal_de_administrador/baneo.php', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: usuario.usuario_id, banned: nuevoEstado })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Actualizar objeto local
                usuario.banned = nuevoEstado;

                // Actualizar botón dinámicamente
                const icon = btn.querySelector('.baneo-icon');
                const text = btn.querySelector('.baneo-text');

                if (nuevoEstado) {
                    btn.classList.remove('btn-warning');
                    btn.classList.add('btn-success');
                    icon.classList.replace('ph-prohibit', 'ph-lock-open');
                    text.textContent = 'Desbloquear';
                } else {
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-warning');
                    icon.classList.replace('ph-lock-open', 'ph-prohibit');
                    text.textContent = 'Bloquear';
                }

                Swal.fire({
                    icon: 'success',
                    title: nuevoEstado ? 'Usuario PRO bloqueado' : 'Usuario PRO desbloqueado',
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'No se pudo actualizar el estado del usuario PRO'
                });
            }
        })
        .catch(err => Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'No se pudo actualizar el estado del usuario PRO'
        }));
    });
}

// =========================
// =========================
// ELIMINAR USUARIO PRO
// =========================
function confirmarEliminacionPro(idUsuario) {
    const usuario = listaUsuariosPro.find(u => (u.usuario_id || u._id) === idUsuario);
    if (!usuario) return;

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
        title: '¿Eliminar usuario PRO?',
        text: 'Esta acción solo eliminará el perfil nutricional del usuario',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) eliminarUsuarioPro(usuario._id); // usamos _id de Perfil_nutricional
    });
}

function eliminarUsuarioPro(idPerfil) {
    fetch(`/Portal_de_administrador/usuariospro.php?id=${idPerfil}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Perfil nutricional eliminado',
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                cargarUsuariosPro();
            } else {
                throw new Error(data.message || 'No se pudo eliminar el perfil nutricional');
            }
        })
        .catch(err => Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'No se pudo eliminar el perfil nutricional'
        }));
}
