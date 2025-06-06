
    function nextSection(currentSection) {
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
document.getElementById('form-crear-perfil').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Mostrar loader o feedback al usuario
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    
    // Enviar formulario via AJAX
    fetch(this.action, {
        method: 'POST',
        body: new FormData(this)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Perfil nutricional creado con exito',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Cambiado para redirigir a la pantalla principal
                window.location.href = '/Pantalla_principal/index_pantalla_principal.html';
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al enviar el formulario',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Guardar';
    });
});

// Resto de tus funciones para manejar las secciones...