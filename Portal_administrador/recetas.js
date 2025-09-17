document.addEventListener('DOMContentLoaded', function() {
    // =======================================
    // Estilos personalizados para SweetAlert
    // =======================================
    const style = document.createElement('style');
    style.textContent = `
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
        #swal-ingredientes, #swal-descripcion { min-height: 100px !important; resize: vertical !important; }
        #swal-dificultad, #swal-categoria, #swal-calificacion {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23007848' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
            background-repeat: no-repeat !important;
            background-position: right 15px center !important;
            background-size: 16px !important;
            padding-right: 40px !important;
            appearance: none !important;
        }
        .swal2-label { font-weight: 600 !important; color: #000000ff !important; margin-bottom: 8px !important; display: block !important; text-align: left !important; width: 100% !important; font-size: 16px !important; }
        .input-group { display: flex; flex-direction: column; margin-bottom: 15px; width: 100%; }
        .swal2-popup { border-radius: 18px !important; padding: 28px 32px !important; background: #FFFFFF !important; box-shadow: 0 20px 50px rgba(0,0,0,0.25) !important; width: auto !important; }
        .swal2-close { position: absolute !important; top: 15px !important; right: 15px !important; width: 34px !important; height: 34px !important; border: none !important; border-radius: 8px !important; background-color: #007848 !important; color: #DAFFDA !important; font-size: 26px !important; line-height: 34px !important; text-align: center !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 0 !important; box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important; transition: all 0.2s ease !important; }
        .swal2-close:hover { background: #006640 !important; color: #FFFFFF !important; transform: rotate(90deg) scale(1.1) !important; box-shadow: 0 3px 10px rgba(0,0,0,0.3) !important; }
        .swal2-confirm { background-color: #E99A3C !important; border-radius: 10px !important; padding: 10px 24px !important; font-weight: 600 !important; transition: all 0.2s ease !important; border: none !important; }
        .swal2-confirm:hover { transform: translateY(-2px) !important; box-shadow: 0 4px 8px rgba(0,120,72,0.3) !important; }
        .swal2-toast .swal2-close { display: none !important; }

    `;
    document.head.appendChild(style);

    // =======================================
    // Variables globales
    // =======================================
    const tablaRecetas = document.getElementById('tablaRecetas');
    let recetasData = [];
    cargarRecetas();

    // =======================================
    // Cargar recetas
    // =======================================
    function cargarRecetas() {
        fetch('/Portal_administrador/cargar_recetas.php')
            .then(resp => resp.json())
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
// Búsqueda en tiempo real
// =======================================
const inputBusqueda = document.getElementById('busquedaRecetas');
inputBusqueda.addEventListener('input', () => {
    const texto = inputBusqueda.value.toLowerCase();
    const filtradas = recetasData.filter(r =>
        r.nombre_receta.toLowerCase().includes(texto) ||
        r.descripcion.toLowerCase().includes(texto)
    );
    renderizarTabla(filtradas);
});


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
                <td><img src="${receta.imagen}" alt="${receta.nombre_receta}" style="width:60px;height:60px;border-radius:5px;object-fit:cover;"></td>
                <td>${receta.nombre_receta}</td>
                <td>${receta.descripcion.length > 50 ? receta.descripcion.substr(0,50)+'...' : receta.descripcion}</td>
                <td>${receta.tiempo_preparacion || '-'}</td>
                <td>${receta.dificultad || '-'}</td>
                <td>${receta.categoria || '-'}</td>
                <td>${Array.isArray(receta.ingredientes_array) ? receta.ingredientes_array.join(", ") : (receta.ingredientes || "-")}</td>
                <td class="text-center">${receta.calificacion && receta.calificacion>0 ? '⭐'.repeat(Math.round(receta.calificacion)) : 'Sin calificar'}</td>
                <td>${receta.fecha_creacion ? new Date(receta.fecha_creacion).toLocaleDateString() : '-'}</td>
                <td class="text-center">
                    <div class="btn-group">
                        <button class="btn btn-edit btn-primary btn-editar" data-id="${receta._id}">
                            <i class="ph ph-pencil-line editar-icon"></i><span class="baneo-text">Editar</span>
                        </button>
                        <button class="btn btn-danger btn-eliminar" data-id="${receta._id}">
                            <i class="ph ph-trash eliminar-icon"></i><span class="eliminar-text">Eliminar</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-editar').forEach(btn => btn.addEventListener('click', ()=> abrirModalEditar(btn.dataset.id)));
        document.querySelectorAll('.btn-eliminar').forEach(btn => btn.addEventListener('click', ()=> confirmarEliminacion(btn.dataset.id)));
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
            confirmButtonColor: 'rgba(212,0,0,1)',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if(result.isConfirmed) eliminarReceta(idReceta);
        });
    }

    // =======================================
    // Eliminar receta
    // =======================================
    function eliminarReceta(idReceta) {
        fetch(`/Portal_administrador/recetas.php?id=${idReceta}`, {method:'DELETE'})
            .then(resp=>resp.json())
            .then(data=>{
                if(data.success) {
                    Swal.fire({ icon:'success', title:'Receta eliminada', toast:true, position:'bottom-end', showConfirmButton:false, timer:3000, showCloseButton:false });
                    cargarRecetas();
                } else {
                    throw new Error(data.error || 'No se pudo eliminar la receta');
                }
            }).catch(error=>{
                Swal.fire({ icon:'error', title:'Error', text:error.message || 'No se pudo eliminar la receta', showCloseButton:true });
            });
    }

    // =======================================
// ===============================
// =======================================
// VARIABLES GLOBALES
// =======================================
let recetaEditando = null;
let datosIniciales = {};

// =======================================
// ABRIR MODAL DE EDICIÓN
// =======================================
function abrirModalEditar(idReceta) {
  const receta = recetasData.find(r => r._id === idReceta);
  if (!receta) return;
  recetaEditando = receta;

  const form = document.getElementById('modal-edit-form');
  const title = document.getElementById('modal-edit-title');
  form.innerHTML = '';
  title.textContent = 'Editar receta';

  const ingredientesTexto = Array.isArray(receta.ingredientes_array)
    ? receta.ingredientes_array.join("\n")
    : receta.ingredientes;

  // INYECTAR FORMULARIO CON DISEÑO
  form.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:20px;">
      <img src="${receta.imagen}" alt="${receta.nombre_receta}" style="width:180px;height:180px;object-fit:cover;border-radius:15px;box-shadow:0 4px 20px rgba(0,0,0,0.25);margin-bottom:10px;">
      <span style="font-size:22px;font-weight:700;color:#007848;">${receta.nombre_receta}</span>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; width:100%;">
      <div class="input-group"><label>Nombre</label><input type="text" name="nombre_receta" value="${receta.nombre_receta}"></div>
      <div class="input-group"><label>Tiempo preparación</label><input type="text" name="tiempo_preparacion" value="${receta.tiempo_preparacion}"></div>
      <div class="input-group"><label>Dificultad</label>
        <select name="dificultad">
          <option value="" disabled ${!receta.dificultad?'selected':''}>Seleccionar</option>
          <option value="Baja" ${receta.dificultad==='Baja'?'selected':''}>Baja</option>
          <option value="Media" ${receta.dificultad==='Media'?'selected':''}>Media</option>
          <option value="Alta" ${receta.dificultad==='Alta'?'selected':''}>Alta</option>
        </select>
      </div>
      <div class="input-group"><label>Categoría</label>
        <select name="categoria">
          <option value="" disabled ${!receta.categoria?'selected':''}>Seleccionar</option>
          <option value="cat_transc" ${receta.categoria==='cat_transc'?'selected':''}>Transicionista</option>
          <option value="cat_veget" ${receta.categoria==='cat_veget'?'selected':''}>Vegetariano</option>
          <option value="cat_vegan" ${receta.categoria==='cat_vegan'?'selected':''}>Vegano</option>
        </select>
      </div>
      <div class="input-group" style="grid-column:1 / span 2;"><label>Ingredientes</label><textarea name="ingredientes">${ingredientesTexto}</textarea></div>
      <div class="input-group" style="grid-column:1 / span 2;"><label>Descripción</label><textarea name="descripcion">${receta.descripcion}</textarea></div>
      <div class="input-group" style="grid-column:1 / span 2;"><label>Calificación</label>
        <select name="calificacion">
          <option value="1" ${receta.calificacion==1?'selected':''}>⭐ 1</option>
          <option value="2" ${receta.calificacion==2?'selected':''}>⭐⭐ 2</option>
          <option value="3" ${receta.calificacion==3?'selected':''}>⭐⭐⭐ 3</option>
          <option value="4" ${receta.calificacion==4?'selected':''}>⭐⭐⭐⭐ 4</option>
          <option value="5" ${receta.calificacion==5?'selected':''}>⭐⭐⭐⭐⭐ 5</option>
        </select>
      </div>
    </div>
  `;

  // GUARDAR ESTADO INICIAL
  datosIniciales = new FormData(form);

  // BOTÓN ACTUALIZAR
  const btnGuar = document.querySelector('.btn-guar');
  btnGuar.disabled = true;
  form.addEventListener('input', () => {
    btnGuar.disabled = !hayCambios(form);
  });

  // MOSTRAR MODAL
  const modal = document.getElementById('modal-edit');
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
}

// =======================================
// DETECTAR CAMBIOS
// =======================================
function hayCambios(form) {
  const actuales = new FormData(form);
  for (let [k,v] of actuales.entries()) {
    if (datosIniciales.get(k) !== v) return true;
  }
  return false;
}

// =======================================
// CANCELAR EDICIÓN
// =======================================
function cancelarEdicion() {
  const form = document.getElementById('modal-edit-form');
  if (hayCambios(form)) {
    Swal.fire({
      icon: 'warning',
      title: '¿Salir sin guardar?',
      text: 'Si sales se perderán los cambios.',
      showCancelButton: true,
      confirmButtonText: 'Si salir',
      cancelButtonText: 'Volver',
      allowOutsideClick: false
    }).then(res => {
      if (res.isConfirmed) cerrarModalEdit();
    });
  } else {
    cerrarModalEdit();
  }
}

// =======================================
// GUARDAR EDICIÓN
// =======================================
function guardarEdicion() {
  const form = document.getElementById('modal-edit-form');
  if (!hayCambios(form)) return;

  Swal.fire({
    title: '¿Confirmar actualización?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then(res => {
    if (res.isConfirmed) {
      const data = Object.fromEntries(new FormData(form).entries());
      data._id = recetaEditando._id;
      data.ingredientes = data.ingredientes.split("\n").map(i => i.trim()).filter(i => i !== "");

      fetch(`/Portal_administrador/recetas.php?id=${data._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          Swal.fire({
            icon: 'success',
            title: 'Receta actualizada',
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          cargarRecetas();
          cerrarModalEdit();
        } else {
          Swal.fire({ icon:'error', title:'Error', text:r.error || 'No se pudo actualizar' });
        }
      })
      .catch(err => Swal.fire({ icon:'error', title:'Error', text:err.message }));
    }
  });
}

// =======================================
// CERRAR MODAL
// =======================================
function cerrarModalEdit() {
  const modal = document.getElementById('modal-edit');
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 300);
}

// =======================================
// EVENTOS GLOBALES
// =======================================
document.querySelector('.btn-cancel').addEventListener('click', cancelarEdicion);
document.querySelector('.btn-guar').addEventListener('click', guardarEdicion);
document.getElementById('modal-edit-close').addEventListener('click', cancelarEdicion);
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') cancelarEdicion();
  if (e.target === document.getElementById('modal-edit')) cancelarEdicion();
});
});

