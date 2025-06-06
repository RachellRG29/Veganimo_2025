
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
  //Script para dropdown estilo intolerancias -->

  function historia(container) {
    const options = container.nextElementSibling;
    options.style.display = (options.style.display === 'none' || options.style.display === '') ? 'block' : 'none';
  }

  //afecciones
function afecciones(container) {
  // Buscamos el grupo completo del select personalizado
  const formGroup = container.closest('.form-group');
  const dropdown = formGroup.querySelector('.custom-select-options');

  // Alternamos la clase y el estado de visibilidad
  container.classList.toggle('active');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}



    function toggleDropdown() {
        const options = document.getElementById('dropdownOptions');
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    }

    // Cierra el dropdown si se hace clic fuera de él
    document.addEventListener('click', function (event) {
        const dropdown = document.querySelector('.dropdown-container');
        if (!dropdown.contains(event.target)) {
            document.getElementById('dropdownOptions').style.display = 'none';
        }
    });


  
    function toggleDietaBox() {
        const checkbox = document.getElementById('dietaCheckbox');
        const descripcion = document.getElementById('dietaDescripcion');
        descripcion.style.display = checkbox.checked ? 'block' : 'none';
    }
