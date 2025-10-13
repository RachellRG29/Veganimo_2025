function nextSection(currentSection) {
  if (currentSection === 2 && !validarSeccionNutricional()) {
    return; // No avanza si hay errores
  }

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

// ================================
// Guardar plan seleccionado
// ================================
function guardarPlan(plan) {
  const inputPlan = document.getElementById('planSeleccionado');
  if (inputPlan) {
    inputPlan.value = plan;
    console.log('Plan guardado en input oculto:', plan);
  } else {
    console.log('Plan elegido:', plan);
  }

  nextSection(6); // Suponiendo que los botones de plan están en sección 6
}

// ================================
// Validar sección nutricional
// ================================
function validarSeccionNutricional() {
  let valido = true;
  let primerCampoError = null;

  const campos = [
    { name: 'dieta_actual', error: 'Selecciona un tipo de dieta', element: document.querySelector('[name="dieta_actual"]'), errorElement: document.getElementById('error-dieta') },
    { name: 'peso', error: 'Ingresa tu peso en libras', element: document.querySelector('[name="peso"]'), errorElement: document.getElementById('error-peso') },
    { name: 'altura', error: 'Ingresa tu altura en cm', element: document.querySelector('[name="altura"]'), errorElement: document.getElementById('error-altura') },
    { name: 'objetivo', error: 'Selecciona un objetivo nutricional', element: document.querySelector('[name="objetivo"]'), errorElement: document.getElementById('error-objetivo') },
    { name: 'nivel_meta', error: 'Selecciona un nivel de meta', element: document.querySelector('[name="nivel_meta"]'), errorElement: document.getElementById('error-nivel-meta') }
  ];

  campos.forEach(campo => {
    const valor = campo.element.value.trim();
    const esSelect = campo.element.tagName === 'SELECT';

    campo.element.classList.remove('campo-error', 'campo-valido');
    if (campo.errorElement) campo.errorElement.classList.remove('error', 'valido');

    if ((esSelect && valor === '') || (!esSelect && valor === '')) {
      valido = false;
      campo.element.classList.add('campo-error');
      if (campo.errorElement) {
        campo.errorElement.textContent = `⚠️ ${campo.error}`;
        campo.errorElement.classList.add('error');
      }
      if (!primerCampoError) primerCampoError = campo.element;
    } else {
      campo.element.classList.add('campo-valido');
      if (campo.errorElement) {
        campo.errorElement.classList.add('valido');
        if (campo.name === 'peso') campo.errorElement.textContent = 'Ingresa tu peso actual en libras';
        else if (campo.name === 'altura') campo.errorElement.textContent = 'Ingresa tu altura en centímetros';
        else if (campo.name === 'dieta_actual') campo.errorElement.textContent = 'Selecciona la dieta que sigues actualmente';
        else if (campo.name === 'objetivo') campo.errorElement.textContent = 'Selecciona tu principal objetivo nutricional';
        else if (campo.name === 'nivel_meta') campo.errorElement.textContent = 'Selecciona el nivel de cambio que deseas lograr';
      }
    }
  });

  if (primerCampoError) {
    primerCampoError.focus();
    primerCampoError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valido;
}

// ================================
// Validación en tiempo real
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const campos = [
    { name: 'dieta_actual', error: 'Selecciona un tipo de dieta', element: document.querySelector('[name="dieta_actual"]'), errorElement: document.getElementById('error-dieta') },
    { name: 'peso', error: 'Ingresa tu peso en libras', element: document.querySelector('[name="peso"]'), errorElement: document.getElementById('error-peso') },
    { name: 'altura', error: 'Ingresa tu altura en cm', element: document.querySelector('[name="altura"]'), errorElement: document.getElementById('error-altura') },
    { name: 'objetivo', error: 'Selecciona un objetivo nutricional', element: document.querySelector('[name="objetivo"]'), errorElement: document.getElementById('error-objetivo') },
    { name: 'nivel_meta', error: 'Selecciona un nivel de meta', element: document.querySelector('[name="nivel_meta"]'), errorElement: document.getElementById('error-nivel-meta') }
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

// ================================
// Historia clínica y dropdowns
// ================================
function historia(container) {
  const options = container.nextElementSibling;
  options.style.display = (options.style.display === 'none' || options.style.display === '') ? 'block' : 'none';
}

function afecciones(container) {
  const formGroup = container.closest('.form-group');
  const dropdown = formGroup.querySelector('.custom-select-options');
  container.classList.toggle('active');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function toggleDropdown() {
  const options = document.getElementById('dropdownOptions');
  options.style.display = options.style.display === 'block' ? 'none' : 'block';
}

function toggleDietaBox() {
  const checkbox = document.getElementById('dietaCheckbox');
  const descripcion = document.getElementById('dietaDescripcion');
  descripcion.style.display = checkbox.checked ? 'block' : 'none';
}

document.addEventListener('click', function (event) {
  const allDropdowns = document.querySelectorAll('.dropdown-container .dropdown-options, .custom-select-options');
  allDropdowns.forEach(dropdown => {
    if (!dropdown.contains(event.target) && !dropdown.previousElementSibling?.contains(event.target)) {
      dropdown.style.display = 'none';
      const parent = dropdown.closest('.form-group');
      if (parent) {
        const customSelect = parent.querySelector('.custom-select');
        if (customSelect) customSelect.classList.remove('active');
      }
    }
  });
});

// ================================
// Planes (mensual/anual)
// ================================
const radioMensual = document.getElementById("radio-1");
const radioAnual = document.getElementById("radio-2");
const priceStandard = document.getElementById("price-standard");
const pricePremium = document.getElementById("price-premium");
const noteStandard = document.getElementById("note-standard");
const notePremium = document.getElementById("note-premium");
const precioPlanElemento = document.getElementById("precio_plan");

// Función para actualizar precios y notas según mensual/anual
function actualizarPrecios() {
  if (radioMensual.checked) {
    priceStandard.textContent = "$5.00";
    pricePremium.textContent = "$10.00";
    noteStandard.style.display = "none";
    notePremium.style.display = "none";
  } else {
    priceStandard.textContent = "$45.00";
    pricePremium.textContent = "$90.00";
    noteStandard.textContent = "12x $5.00= 60.00 → Pagas solo $45 (Ahorro 25%)";
    notePremium.textContent = "12x $10.00= 120.00 → Pagas solo $90 (Ahorro 25%)";
    noteStandard.style.display = "block";
    notePremium.style.display = "block";
  }

  // Si ya hay un plan seleccionado, actualizar el precio al cambiar período
  const planSeleccionado = localStorage.getItem("planSeleccionado");
  if (planSeleccionado) {
    actualizarPrecioPlan(planSeleccionado);
  }
}

// Función para actualizar el precio final y guardar la selección
function actualizarPrecioPlan(nombrePlan) {
  let precio = 0;

  if (nombrePlan === "Estándar") {
    precio = radioMensual.checked ? 5.00 : 45.00;
  } else if (nombrePlan === "Premium") {
    precio = radioMensual.checked ? 10.00 : 90.00;
  }

  precioPlanElemento.textContent = `$${precio.toFixed(2)}`;
  localStorage.setItem("planSeleccionado", nombrePlan);
  localStorage.setItem("precioPlan", precio);

  console.log(`Plan seleccionado: ${nombrePlan} (${radioMensual.checked ? "Mensual" : "Anual"}) - $${precio}`);
}

// Event listeners para radio buttons de mensual/anual
radioMensual.addEventListener("change", actualizarPrecios);
radioAnual.addEventListener("change", actualizarPrecios);

// Event listeners para los botones de selección de plan
priceStandard.parentElement.addEventListener("click", () => actualizarPrecioPlan("Estándar"));
pricePremium.parentElement.addEventListener("click", () => actualizarPrecioPlan("Premium"));

// Inicializar
actualizarPrecios();
