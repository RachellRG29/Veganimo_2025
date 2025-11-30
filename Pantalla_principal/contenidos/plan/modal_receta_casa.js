// Función para inicializar categorías desplegables
function inicializarCategoriasDesplegables() {
  const categorias = document.querySelectorAll('.categoria-grupo');
  
  categorias.forEach(categoria => {
    const header = categoria.querySelector('.categoria-header');
    
    // Inicializar todas cerradas
    categoria.classList.add('cerrada');
    
    header.addEventListener('click', () => {
      categoria.classList.toggle('cerrada');
    });
  });
}

// Función para inicializar el modal de ingredientes
function inicializarModalIngredientes() {
  const btnCrearReceta = document.querySelector('.btn_crear_receta');
  const modalIngredientes = document.getElementById('modal-ingredientes-casa');
  const btnCerrar = document.getElementById('cerrar-modal-ingredientes');
  const btnGuardar = document.getElementById('btn-guardar-ingredientes');
  const checkboxes = document.querySelectorAll('input[name="ingrediente"]');

  // Abrir modal
  if (btnCrearReceta) {
    btnCrearReceta.addEventListener('click', () => {
      modalIngredientes.classList.remove('oculto');
      // Inicializar categorías desplegables
      inicializarCategoriasDesplegables();
      // Limpiar selecciones al abrir
      actualizarIngredientesSeleccionados();
    });
  }

  // Cerrar modal
  if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
      modalIngredientes.classList.add('oculto');
    });
  }

  // Cerrar al hacer click fuera del contenido
  if (modalIngredientes) {
    modalIngredientes.addEventListener('click', (e) => {
      if (e.target === modalIngredientes) {
        modalIngredientes.classList.add('oculto');
      }
    });
  }

  // Manejar selección de ingredientes
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', actualizarIngredientesSeleccionados);
  });

  // Guardar ingredientes
  if (btnGuardar) {
    btnGuardar.addEventListener('click', guardarIngredientes);
  }
}

// Actualizar lista de ingredientes seleccionados
function actualizarIngredientesSeleccionados() {
  const listaSeleccionados = document.getElementById('lista-seleccionados');
  const checkboxes = document.querySelectorAll('input[name="ingrediente"]:checked');
  
  listaSeleccionados.innerHTML = '';
  
  checkboxes.forEach(checkbox => {
    const ingrediente = checkbox.value;
    const label = checkbox.parentElement.textContent.trim();
    
    const elemento = document.createElement('div');
    elemento.className = 'ingrediente-seleccionado';
    elemento.setAttribute('data-ingrediente', ingrediente);
    elemento.innerHTML = `
      ${label}
      <button class="btn-eliminar-ingrediente" data-ingrediente="${ingrediente}">×</button>
    `;
    
    listaSeleccionados.appendChild(elemento);
  });

  // Agregar event listeners a los botones de eliminar
  document.querySelectorAll('.btn-eliminar-ingrediente').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ingrediente = btn.getAttribute('data-ingrediente');
      const checkbox = document.querySelector(`input[value="${ingrediente}"]`);
      if (checkbox) {
        checkbox.checked = false;
        actualizarIngredientesSeleccionados();
      }
    });
  });
}

// Guardar ingredientes seleccionados
function guardarIngredientes() {
  const checkboxes = document.querySelectorAll('input[name="ingrediente"]:checked');
  const ingredientesSeleccionados = Array.from(checkboxes).map(checkbox => ({
    value: checkbox.value,
    label: checkbox.parentElement.textContent.trim()
  }));
  
  console.log('Ingredientes guardados:', ingredientesSeleccionados);
  
  if (ingredientesSeleccionados.length === 0) {
    alert('Por favor selecciona al menos un ingrediente');
    return;
  }
  
  // Aquí puedes agregar la lógica para enviar los datos al servidor
  // Por ahora solo mostramos un mensaje
  alert(`Se guardaron ${ingredientesSeleccionados.length} ingredientes. Generando recetas...`);
  
  // Cerrar modal después de guardar
  document.getElementById('modal-ingredientes-casa').classList.add('oculto');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarModalIngredientes);