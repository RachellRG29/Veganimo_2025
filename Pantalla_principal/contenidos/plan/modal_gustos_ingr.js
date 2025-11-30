// Función para inicializar categorías desplegables
function inicializarCategoriasDesplegablesPreferencias() {
  const categorias = document.querySelectorAll('.categoria-grupo-preferencias');
  
  categorias.forEach(categoria => {
    const header = categoria.querySelector('.categoria-header-preferencias');
    
    // Inicializar todas cerradas
    categoria.classList.add('cerrada');
    
    header.addEventListener('click', () => {
      categoria.classList.toggle('cerrada');
    });
  });
}

// Función para inicializar el modal de preferencias
function inicializarModalPreferencias() {
  const modalPreferencias = document.getElementById('modal-preferencias-ingredientes');
  const btnCerrar = document.getElementById('cerrar-modal-preferencias');
  const btnGuardar = document.getElementById('btn-guardar-preferencias');
  const botonesPreferencia = document.querySelectorAll('.btn-preferencia');
  const btnAbrirModal = document.querySelector('.btn_ingresar_gustos'); // NUEVO: Botón para abrir modal

  console.log('🔧 Inicializando modal de preferencias...');
  console.log('Modal encontrado:', !!modalPreferencias);
  console.log('Botón cerrar:', !!btnCerrar);
  console.log('Botón guardar:', !!btnGuardar);
  console.log('Botones preferencia encontrados:', botonesPreferencia.length);
  console.log('Botón abrir modal encontrado:', !!btnAbrirModal); // NUEVO

  // Abrir modal cuando se hace clic en el botón "Ingresar"
  if (btnAbrirModal) {
    btnAbrirModal.addEventListener('click', abrirModalPreferencias);
    console.log('✅ Event listener agregado al botón "Ingresar"');
  } else {
    console.error('❌ No se encontró el botón .btn_ingresar_gustos');
  }

  // Cerrar modal
  if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
      modalPreferencias.classList.add('oculto');
    });
  }

  // Cerrar al hacer click fuera del contenido
  if (modalPreferencias) {
    modalPreferencias.addEventListener('click', (e) => {
      if (e.target === modalPreferencias) {
        modalPreferencias.classList.add('oculto');
      }
    });
  }

  // Manejar selección de preferencias
  botonesPreferencia.forEach(boton => {
    boton.addEventListener('click', manejarSeleccionPreferencia);
  });

  // Guardar preferencias
  if (btnGuardar) {
    btnGuardar.addEventListener('click', guardarPreferencias);
  }
}

// Manejar selección de like/dislike
function manejarSeleccionPreferencia(e) {
  const boton = e.currentTarget;
  const ingredienteItem = boton.closest('.ingrediente-item');
  const ingrediente = ingredienteItem.getAttribute('data-ingrediente');
  const nombreIngrediente = ingredienteItem.querySelector('.nombre-ingrediente').textContent;
  const preferencia = boton.getAttribute('data-preferencia');
  
  // Obtener botones del mismo ingrediente
  const botonesIngrediente = ingredienteItem.querySelectorAll('.btn-preferencia');
  
  // Desactivar todos los botones del ingrediente
  botonesIngrediente.forEach(btn => {
    btn.classList.remove('activo');
  });
  
  // Activar el botón seleccionado
  boton.classList.add('activo');
  
  // Actualizar resumen
  actualizarResumenPreferencias(ingrediente, nombreIngrediente, preferencia);
}

// Actualizar resumen de preferencias
function actualizarResumenPreferencias(ingrediente, nombreIngrediente, preferencia) {
  const listaGustos = document.getElementById('lista-gustos');
  const listaDisgustos = document.getElementById('lista-disgustos');
  
  // Eliminar el ingrediente de ambas listas si ya existía
  const elementoExistenteGustos = listaGustos.querySelector(`[data-ingrediente="${ingrediente}"]`);
  const elementoExistenteDisgustos = listaDisgustos.querySelector(`[data-ingrediente="${ingrediente}"]`);
  
  if (elementoExistenteGustos) elementoExistenteGustos.remove();
  if (elementoExistenteDisgustos) elementoExistenteDisgustos.remove();
  
  // Agregar a la lista correspondiente
  if (preferencia === 'like') {
    const elemento = document.createElement('div');
    elemento.className = 'ingrediente-resumen';
    elemento.setAttribute('data-ingrediente', ingrediente);
    elemento.innerHTML = `
      ${nombreIngrediente}
      <button class="btn-eliminar-preferencia" data-ingrediente="${ingrediente}">×</button>
    `;
    listaGustos.appendChild(elemento);
  } else if (preferencia === 'dislike') {
    const elemento = document.createElement('div');
    elemento.className = 'ingrediente-resumen';
    elemento.setAttribute('data-ingrediente', ingrediente);
    elemento.innerHTML = `
      ${nombreIngrediente}
      <button class="btn-eliminar-preferencia" data-ingrediente="${ingrediente}">×</button>
    `;
    listaDisgustos.appendChild(elemento);
  }
  
  // Agregar event listeners a los botones de eliminar
  document.querySelectorAll('.btn-eliminar-preferencia').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ingrediente = btn.getAttribute('data-ingrediente');
      eliminarPreferencia(ingrediente);
    });
  });
}

// Eliminar preferencia de un ingrediente
function eliminarPreferencia(ingrediente) {
  // Eliminar de las listas de resumen
  const elementoGustos = document.querySelector(`#lista-gustos [data-ingrediente="${ingrediente}"]`);
  const elementoDisgustos = document.querySelector(`#lista-disgustos [data-ingrediente="${ingrediente}"]`);
  
  if (elementoGustos) elementoGustos.remove();
  if (elementoDisgustos) elementoDisgustos.remove();
  
  // Desactivar botones en la lista de ingredientes
  const ingredienteItem = document.querySelector(`.ingrediente-item[data-ingrediente="${ingrediente}"]`);
  if (ingredienteItem) {
    const botones = ingredienteItem.querySelectorAll('.btn-preferencia');
    botones.forEach(boton => {
      boton.classList.remove('activo');
    });
  }
}

// Guardar preferencias seleccionadas
function guardarPreferencias() {
  const ingredientesGustan = [];
  const ingredientesNoGustan = [];
  
  // Recopilar ingredientes que gustan
  document.querySelectorAll('#lista-gustos .ingrediente-resumen').forEach(elemento => {
    ingredientesGustan.push({
      value: elemento.getAttribute('data-ingrediente'),
      label: elemento.textContent.replace('×', '').trim()
    });
  });
  
  // Recopilar ingredientes que no gustan
  document.querySelectorAll('#lista-disgustos .ingrediente-resumen').forEach(elemento => {
    ingredientesNoGustan.push({
      value: elemento.getAttribute('data-ingrediente'),
      label: elemento.textContent.replace('×', '').trim()
    });
  });
  
  console.log('Ingredientes que gustan:', ingredientesGustan);
  console.log('Ingredientes que no gustan:', ingredientesNoGustan);
  
  // Aquí puedes agregar la lógica para enviar los datos al servidor
  alert(`Preferencias guardadas:\n- ${ingredientesGustan.length} ingredientes que te gustan\n- ${ingredientesNoGustan.length} ingredientes que no te gustan`);
  
  // Cerrar modal después de guardar
  document.getElementById('modal-preferencias-ingredientes').classList.add('oculto');
}

// Función para abrir el modal de preferencias
function abrirModalPreferencias() {
  console.log('🎯 Abriendo modal de preferencias...');
  const modalPreferencias = document.getElementById('modal-preferencias-ingredientes');
  
  if (!modalPreferencias) {
    console.error('❌ No se encontró el modal de preferencias');
    return;
  }
  
  modalPreferencias.classList.remove('oculto');
  // Inicializar categorías desplegables
  inicializarCategoriasDesplegablesPreferencias();
  // Limpiar selecciones al abrir
  document.getElementById('lista-gustos').innerHTML = '';
  document.getElementById('lista-disgustos').innerHTML = '';
  
  // Desactivar todos los botones de preferencia
  document.querySelectorAll('.btn-preferencia').forEach(boton => {
    boton.classList.remove('activo');
  });
  
  console.log('✅ Modal de preferencias abierto correctamente');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM cargado, inicializando modal de preferencias...');
  inicializarModalPreferencias();
});

// También exportar la función para que esté disponible globalmente
window.abrirModalPreferencias = abrirModalPreferencias;
window.inicializarModalPreferencias = inicializarModalPreferencias;