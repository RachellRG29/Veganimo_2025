
function nextSection(currentSection) {
    if (currentSection === 2 && !validarSeccionNutricional()) {
        return; // No avanza si hay errores
    }
    
    // Resto del código para cambiar sección...
    document.getElementById(`section${currentSection}`).classList.remove('active');
    document.getElementById(`section${currentSection + 1}`).classList.add('active');
    updateProgressBar(currentSection + 1);
}


    function prevSection(currentSection) {
        document.getElementById(`section${currentSection}`).classList.remove('active');
        document.getElementById(`section${currentSection - 1}`).classList.add('active');
        updateProgressBar(currentSection - 1);
    }

    function updateProgressBar(currentStep) {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('active');
                step.classList.remove('inactive');
            } else {
                step.classList.remove('active');
                step.classList.add('inactive');
            }
        });
    }

// Validar sección nutricional
function validarSeccionNutricional() {
    let valido = true;
    let primerCampoError = null;

    // Campos a validar
    const campos = [
        {
            name: 'dieta_actual',
            error: 'Selecciona un tipo de dieta',
            element: document.querySelector('[name="dieta_actual"]'),
            errorElement: document.getElementById('error-dieta')
        },
        {
            name: 'peso',
            error: 'Ingresa tu peso en libras',
            element: document.querySelector('[name="peso"]'),
            errorElement: document.getElementById('error-peso')
        },
        {
            name: 'altura',
            error: 'Ingresa tu altura en cm',
            element: document.querySelector('[name="altura"]'),
            errorElement: document.getElementById('error-altura')
        },
        {
            name: 'objetivo',
            error: 'Selecciona un objetivo nutricional',
            element: document.querySelector('[name="objetivo"]'),
            errorElement: document.getElementById('error-objetivo')
        },
        {
            name: 'nivel_meta',
            error: 'Selecciona un nivel de meta',
            element: document.querySelector('[name="nivel_meta"]'),
            errorElement: document.getElementById('error-nivel-meta')
        }
    ];

    // Validar cada campo
    campos.forEach(campo => {
        const valor = campo.element.value.trim();
        const esSelect = campo.element.tagName === 'SELECT';

        // Resetear clases
        campo.element.classList.remove('campo-error', 'campo-valido');
        if (campo.errorElement) campo.errorElement.classList.remove('error', 'valido');

        // Validar
        if ((esSelect && valor === '') || (!esSelect && valor === '')) {
            valido = false;
            campo.element.classList.add('campo-error');
            if (campo.errorElement) {
                campo.errorElement.textContent = `⚠️ ${campo.error}`;
                campo.errorElement.classList.add('error');
            }
            if (!primerCampoError) primerCampoError = campo.element;
        } else {
            // Marcar como válido
            campo.element.classList.add('campo-valido');
            if (campo.errorElement) {
                campo.errorElement.classList.add('valido');
                // Restaurar mensaje original para campos válidos
                if (campo.name === 'peso') campo.errorElement.textContent = 'Ingresa tu peso actual en libras';
                else if (campo.name === 'altura') campo.errorElement.textContent = 'Ingresa tu altura en centímetros';
                else if (campo.name === 'dieta_actual') campo.errorElement.textContent = 'Selecciona la dieta que sigues actualmente';
                else if (campo.name === 'objetivo') campo.errorElement.textContent = 'Selecciona tu principal objetivo nutricional';
                else if (campo.name === 'nivel_meta') campo.errorElement.textContent = 'Selecciona el nivel de cambio que deseas lograr';
            }
        }
    });

    // Enfocar y desplazarse al primer error
    if (primerCampoError) {
        primerCampoError.focus();
        primerCampoError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valido;
}

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', () => {
    const campos = [
        {
            name: 'dieta_actual',
            error: 'Selecciona un tipo de dieta',
            element: document.querySelector('[name="dieta_actual"]'),
            errorElement: document.getElementById('error-dieta')
        },
        {
            name: 'peso',
            error: 'Ingresa tu peso en libras',
            element: document.querySelector('[name="peso"]'),
            errorElement: document.getElementById('error-peso')
        },
        {
            name: 'altura',
            error: 'Ingresa tu altura en cm',
            element: document.querySelector('[name="altura"]'),
            errorElement: document.getElementById('error-altura')
        },
        {
            name: 'objetivo',
            error: 'Selecciona un objetivo nutricional',
            element: document.querySelector('[name="objetivo"]'),
            errorElement: document.getElementById('error-objetivo')
        },
        {
            name: 'nivel_meta',
            error: 'Selecciona un nivel de meta',
            element: document.querySelector('[name="nivel_meta"]'),
            errorElement: document.getElementById('error-nivel-meta')
        }
    ];

    campos.forEach(campo => {
        const esSelect = campo.element.tagName === 'SELECT';
        const evento = esSelect ? 'change' : 'input';

        campo.element.addEventListener(evento, () => {
            const valor = campo.element.value.trim();
            campo.element.classList.remove('campo-error', 'campo-valido');
            campo.errorElement.classList.remove('error', 'valido');

            if (valor === '') {
                campo.element.classList.add('campo-error');
                campo.errorElement.textContent = `⚠️ ${campo.error}`;
                campo.errorElement.classList.add('error');
            } else {
                campo.element.classList.add('campo-valido');
                campo.errorElement.classList.add('valido');
                if (campo.name === 'peso') campo.errorElement.textContent = 'Ingresa tu peso actual en libras';
                else if (campo.name === 'altura') campo.errorElement.textContent = 'Ingresa tu altura en centímetros';
                else if (campo.name === 'dieta_actual') campo.errorElement.textContent = 'Selecciona la dieta que sigues actualmente';
                else if (campo.name === 'objetivo') campo.errorElement.textContent = 'Selecciona tu principal objetivo nutricional';
                else if (campo.name === 'nivel_meta') campo.errorElement.textContent = 'Selecciona el nivel de cambio que deseas lograr';
            }
        });
    });
});


    // Mostrar/Ocultar opciones en "historia"
  function historia(container) {
    const options = container.nextElementSibling;
    options.style.display = (options.style.display === 'none' || options.style.display === '') ? 'block' : 'none';
  }

  // Mostrar/Ocultar opciones en "afecciones"
  function afecciones(container) {
    const formGroup = container.closest('.form-group');
    const dropdown = formGroup.querySelector('.custom-select-options');
    container.classList.toggle('active');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }

  // Dropdown general
  function toggleDropdown() {
    const options = document.getElementById('dropdownOptions');
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
  }

  // Mostrar/Ocultar cuadro de descripción para dieta
  function toggleDietaBox() {
    const checkbox = document.getElementById('dietaCheckbox');
    const descripcion = document.getElementById('dietaDescripcion');
    descripcion.style.display = checkbox.checked ? 'block' : 'none';
  }

  // Cierra cualquier dropdown si se hace clic fuera de ellos
  document.addEventListener('click', function (event) {
    // Lista de todos los dropdowns y select personalizados
    const allDropdowns = document.querySelectorAll('.dropdown-container .dropdown-options, .custom-select-options');

    allDropdowns.forEach(dropdown => {
      // Si el clic fue fuera del dropdown o de su botón contenedor
      if (!dropdown.contains(event.target) && !dropdown.previousElementSibling?.contains(event.target)) {
        dropdown.style.display = 'none';

        // Elimina clase 'active' si es un select personalizado
        const parent = dropdown.closest('.form-group');
        if (parent) {
          const customSelect = parent.querySelector('.custom-select');
          if (customSelect) {
            customSelect.classList.remove('active');
          }
        }
      }
    });
  });

 // Función para manejar el envío del formulario
// Función para manejar el envío del formulario
document.getElementById('form-crear-perfil').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Mostrar loader
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    
    // Enviar formulario
    fetch(this.action, {
        method: 'POST',
        body: new FormData(this)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en la respuesta del servidor");
        return response.json();
    })
    .then(data => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        Toast.fire({
            icon: data.icon || (data.success ? 'success' : 'error'),
            title: data.message
        });

        if (data.success) {
            setTimeout(() => {
                window.location.href = '/Pantalla_principal/index_pantalla_principal.html';
            }, 3000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'error',
            title: 'Error al enviar el formulario',
            showConfirmButton: false,
            timer: 3000
        });
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
});

// Resto de tus funciones para manejar las secciones...