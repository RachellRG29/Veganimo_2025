document.addEventListener('DOMContentLoaded', async function() {
  console.log('📦 solicitud_receta.js cargado - Esperando contenido dinámico...');

  await waitForDynamicContent();

  if (document.getElementById('tablaSolicitudes')) {
    console.log('✅ Inicializando módulo de solicitudes...');
    inicializarSolicitudes();
  } else {
    console.log('❌ No se encontró tablaSolicitudes');
  }
});

function waitForDynamicContent() {
  return new Promise(resolve => {
    let attempts = 0;
    const max = 50;
    const check = () => {
      attempts++;
      const cont = document.getElementById('contenido-admin');
      if (cont && cont.innerHTML.trim() !== '') return resolve();
      if (attempts >= max) return resolve();
      setTimeout(check, 100);
    };
    check();
  });
}

// ===============================
// Objeto de categorías
// ===============================
const categoriasMap = {
  cat_vegan: "Vegano",
  cat_veget: "Vegetariano",
  cat_transc: "Transicionista"
};

// =======================================
// Función global para inicializar
// =======================================
window.cargarSolicitudes = inicializarSolicitudes;

function inicializarSolicitudes() {
  const tabla = document.getElementById('tablaSolicitudes');
  if (!tabla) return console.warn('❌ tablaSolicitudes no encontrada');

  let solicitudesData = [];

  cargarSolicitudes();

  // ===============================
  // Cargar solicitudes
  // ===============================
  function cargarSolicitudes() {
    console.log('📥 Cargando solicitudes...');
    fetch('/Portal_de_administrador/cargar_solicitudes_recetas.php')
      .then(r => r.json())
      .then(data => {
        if (!data.success) throw new Error('Error al cargar solicitudes');
        solicitudesData = data.data;
        renderizarTabla(solicitudesData);
      })
      .catch(err => {
        console.error('❌', err);
        tabla.innerHTML = `<tr><td colspan="13" class="text-center text-danger">${err.message}</td></tr>`;
      });
  }

  // ===============================
  // Buscador en tiempo real
  // ===============================
  const inputBusqueda = document.getElementById('busquedaSolicitudes');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', function() {
      const texto = this.value.toLowerCase().trim();

      const filtradas = solicitudesData.filter(sol =>
        (sol.nombre_receta && sol.nombre_receta.toLowerCase().includes(texto)) ||
        (sol.descripcion && sol.descripcion.toLowerCase().includes(texto)) ||
        (sol.tipo_receta && sol.tipo_receta.toLowerCase().includes(texto)) ||
        (categoriasMap[sol.categoria]?.toLowerCase().includes(texto))
      );

      renderizarTabla(filtradas);
    });
  }

  // ===============================
  // Renderizar estrellas exactas
  // ===============================
  function renderEstrellas(calificaciones) {
    if (!Array.isArray(calificaciones) || calificaciones.length === 0) return '-';
    const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length;
    const estrellas = Math.round(promedio);
    let html = '';
    for (let i = 0; i < estrellas; i++) {
      html += `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             width="20" height="20"
             style="fill:#ffc73a;stroke:#ffc73a;stroke-width:2px;stroke-linejoin:round;">
          <path d="M12,17.27L18.18,21L16.54,13.97
                  L22,9.24L14.81,8.62L12,2L9.19,8.62
                  L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
        </svg>`;
    }
    return html;
  }

  // ===============================
  // Renderizar pasos resumidos
  // ===============================
  function renderPasosCortos(pasos) {
    if (!Array.isArray(pasos) || pasos.length === 0) return '-';
    const total = pasos.length;
    const primeros = pasos.slice(0, 2).map(p => p.texto).join(', ');
    return `${primeros}${total > 2 ? '...' : ''}`;
  }

  // ===============================
  // Renderizar tabla
  // ===============================
  function renderizarTabla(lista) {
    if (!tabla) return;
    if (lista.length === 0) {
      tabla.innerHTML = `<tr><td colspan="13" class="text-center">No hay solicitudes</td></tr>`;
      return;
    }

    tabla.innerHTML = lista.map(sol => `
      <tr data-id="${sol._id}">
        <td><img src="${sol.imagen || '/Images/img_sinperfilusuario.png'}" style="width:60px;height:60px;border-radius:5px;object-fit:cover;"></td>
        <td>${sol.nombre_receta || '-'}</td>
        <td>${sol.descripcion || '-'}</td>
        <td>${sol.tiempo_preparacion || '-'}</td>
        <td>${sol.dificultad || '-'}</td>
        <td>${categoriasMap[sol.categoria] || sol.categoria || '-'}</td>
        <td>${sol.tipo_receta || '-'}</td>
        <td>${Array.isArray(sol.ingredientes_array) ? sol.ingredientes_array.join(', ') : sol.ingredientes || '-'}</td>
        <td>${renderPasosCortos(sol.pasos)}</td>
        <td class="text-center">${renderEstrellas(sol.calificaciones)}</td>
        <td>${sol.fecha_creacion || '-'}</td>
        <td>${sol.nombre_usuario || '-'}</td>
        <td>${sol.email_usuario || '-'}</td>
        <td class="text-center">
          <div class="btn-group">
            <button class="btn btn-info btn-ver" data-id="${sol._id}"><i class="ph ph-eye"></i> Ver</button>
            <button class="btn btn-success btn-aprobar" data-id="${sol._id}"><i class="ph ph-check"></i> Aprobar</button>
            <button class="btn btn-danger btn-rechazar" data-id="${sol._id}"><i class="ph ph-x"></i> Rechazar</button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.btn-ver').forEach(btn => btn.addEventListener('click', () => verSolicitud(btn.dataset.id)));
    document.querySelectorAll('.btn-aprobar').forEach(btn => btn.addEventListener('click', () => actualizarEstado(btn.dataset.id, 'Aprobada')));
    document.querySelectorAll('.btn-rechazar').forEach(btn => btn.addEventListener('click', () => actualizarEstado(btn.dataset.id, 'Rechazada')));
  }

  // ===============================
  // Modal ver solicitud (detallado)
  // ===============================
  function verSolicitud(id) {
    const sol = solicitudesData.find(s => s._id === id);
    if (!sol) return;

    let pasosHTML = '-';
    if (Array.isArray(sol.pasos) && sol.pasos.length > 0) {
      pasosHTML = sol.pasos.map((p, i) => `
        <div style="margin-bottom:10px;text-align:left;">
          <b>Paso ${i + 1}:</b> ${p.texto || ''}
          ${p.imagen ? `<br><img src="${p.imagen}" style="max-width:100%;border-radius:8px;margin-top:5px;">` : ''}
        </div>
      `).join('');
    }

    Swal.fire({
      title: `<span style="color:#007848;">${sol.nombre_receta}</span>`,
      html: `
        <img src="${sol.imagen || '/Images/img_sinperfilusuario.png'}" style="width:180px;height:180px;object-fit:cover;border-radius:10px;margin-bottom:10px;">
        <p><b>Tipo:</b> ${sol.tipo_receta || '-'}</p>
        <p><b>Categoría:</b> ${categoriasMap[sol.categoria] || sol.categoria || '-'}</p>
        <p><b>Dificultad:</b> ${sol.dificultad || '-'}</p>
        <p><b>Descripción:</b> ${sol.descripcion || '-'}</p>
        <p><b>Ingredientes:</b><br>${Array.isArray(sol.ingredientes_array) ? sol.ingredientes_array.join(', ') : sol.ingredientes || '-'}</p>
        <p><b>Tiempo de preparación:</b> ${sol.tiempo_preparacion || '-'}</p>
        <p><b>Calificación:</b> ${renderEstrellas(sol.calificaciones)}</p>
        <hr>
        <p><b>Pasos:</b><br>${pasosHTML}</p>
        <p><b>Fecha creación:</b> ${sol.fecha_creacion || '-'}</p>
        <p><b>Enviado por:</b> ${sol.nombre_usuario || '-'} (${sol.email_usuario || '-'})</p>

      `,
      width: 700,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#007848'
    });
  }

  // ===============================
  // Actualizar estado
  // ===============================
  function actualizarEstado(id, estado) {
    Swal.fire({
      title: `¿${estado === 'Aprobada' ? 'Aprobar' : 'Rechazar'} esta solicitud?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: estado === 'Aprobada' ? '#007848' : '#d33'
    }).then(res => {
      if (res.isConfirmed) {
        fetch('/Portal_de_administrador/solicitud_receta.php', {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ _id: id, estado })
        })
        .then(r => r.json())
        .then(r => {
          if (r.success) {
            Swal.fire({
              icon: 'success',
              title: `Solicitud ${estado.toLowerCase()}`,
              toast: true,
              position: 'bottom-end',
              timer: 3000,
              showConfirmButton: false
            });
            cargarSolicitudes();
          } else {
            throw new Error(r.error || 'Error al actualizar');
          }
        })
        .catch(err => Swal.fire({icon:'error', title:'Error', text:err.message}));
      }
    });
  }
}
