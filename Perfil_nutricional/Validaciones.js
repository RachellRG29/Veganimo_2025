
// VALIDACIONES - Sección Nutricional

function validarSeccionNutricional() {
    let valido = true;
    let primerCampoError = null;

    // Campos a validar con sus reglas, mensajes y referencias DOM
    const campos = [
        {
            name: 'dieta_actual',
            element: document.querySelector('[name="dieta_actual"]'),
            errorElement: document.getElementById('error-dieta'),
            validar: valor => valor !== '',
            errorMsg: '⚠️ Selecciona un tipo de dieta',
            validMsg: 'Selecciona la dieta que sigues actualmente'
        },
        {
            name: 'peso',
            element: document.querySelector('[name="peso"]'),
            errorElement: document.getElementById('error-peso'),
            validar: valor => valor !== '' && !isNaN(valor) && Number(valor) >= 50 && Number(valor) <= 500 && valor.length <= 3 && !valor.includes('-'),
            errorMsg: '⚠️ El peso debe ser un número entre 50 y 500 libras',
            validMsg: 'Ingresa tu peso actual en libras'
        },
        {
            name: 'altura',
            element: document.querySelector('[name="altura"]'),
            errorElement: document.getElementById('error-altura'),
            validar: valor => valor !== '' && !isNaN(valor) && Number(valor) >= 50 && Number(valor) <= 250 && valor.length <= 3 && !valor.includes('-'),
            errorMsg: '⚠️ La altura debe ser un número entre 50 y 250 cm',
            validMsg: 'Ingresa tu altura en centímetros'
        },
        {
            name: 'objetivo',
            element: document.querySelector('[name="objetivo"]'),
            errorElement: document.getElementById('error-objetivo'),
            validar: valor => valor !== '',
            errorMsg: '⚠️ Selecciona un objetivo nutricional',
            validMsg: 'Selecciona tu principal objetivo nutricional'
        },
        {
            name: 'nivel_meta',
            element: document.querySelector('[name="nivel_meta"]'),
            errorElement: document.getElementById('error-nivel-meta'),
            validar: valor => valor !== '',
            errorMsg: '⚠️ Selecciona un nivel de meta',
            validMsg: 'Selecciona el nivel de cambio que deseas lograr'
        }
    ];

    campos.forEach(({element, errorElement, validar, errorMsg, validMsg}) => {
        const valor = element.value.trim();

        element.classList.remove('campo-error', 'campo-valido');
        errorElement.classList.remove('error', 'valido');

        if (!validar(valor)) {
            valido = false;
            element.classList.add('campo-error');
            errorElement.textContent = errorMsg;
            errorElement.classList.add('error');
            if (!primerCampoError) primerCampoError = element;
        } else {
            element.classList.add('campo-valido');
            errorElement.textContent = validMsg;
            errorElement.classList.add('valido');
        }
    });

    if (primerCampoError) {
        primerCampoError.focus();
        primerCampoError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valido;
}

// Validación en tiempo real para todos los campos
document.addEventListener('DOMContentLoaded', () => {
    const campos = [
        {
            element: document.querySelector('[name="dieta_actual"]'),
            errorElement: document.getElementById('error-dieta'),
            validar: valor => valor !== '',
            errorMsg: '⚠️ Selecciona un tipo de dieta',
            validMsg: 'Selecciona la dieta que sigues actualmente'
        },
        {
            element: document.querySelector('[name="peso"]'),
            errorElement: document.getElementById('error-peso'),
            validar: valor => valor !== '' && !isNaN(valor) && Number(valor) >= 50 && Number(valor) <= 500 && valor.length <= 3 && !valor.includes('-'),
            errorMsg: '⚠️ El peso debe ser un número entre 50 y 500 libras',
            validMsg: 'Ingresa tu peso actual en libras'
        },
        {
            element: document.querySelector('[name="altura"]'),
            errorElement: document.getElementById('error-altura'),
            validar: valor => valor !== '' && !isNaN(valor) && Number(valor) >= 50 && Number(valor) <= 250 && valor.length <= 3 && !valor.includes('-'),
            errorMsg: '⚠️ La altura debe ser un número entre 50 y 250 cm',
            validMsg: 'Ingresa tu altura en centímetros'
        },
        {
            element: document.querySelector('[name="objetivo"]'),
            errorElement: document.getElementById('error-objetivo'),
            validar: valor => valor !== '',
            errorMsg: '⚠️ Selecciona un objetivo nutricional',
            validMsg: 'Selecciona tu principal objetivo nutricional'
        },
        {
            element: document.querySelector('[name="nivel_meta"]'),
            errorElement: document.getElementById('error-nivel-meta'),
            validar: valor => valor !== '',
            errorMsg: '⚠️ Selecciona un nivel de meta',
            validMsg: 'Selecciona el nivel de cambio que deseas lograr'
        }
    ];

    campos.forEach(({element, errorElement, validar, errorMsg, validMsg}) => {
        const evento = element.tagName === 'SELECT' ? 'change' : 'input';

        element.addEventListener(evento, () => {
            const valor = element.value.trim();

            element.classList.remove('campo-error', 'campo-valido');
            errorElement.classList.remove('error', 'valido');

            if (!validar(valor)) {
                element.classList.add('campo-error');
                errorElement.textContent = errorMsg;
                errorElement.classList.add('error');
            } else {
                element.classList.add('campo-valido');
                errorElement.textContent = validMsg;
                errorElement.classList.add('valido');
            }
        });
    });



    
  const nivelMeta = document.querySelector('[name="nivel_meta"]');
const errorNivelMeta = document.getElementById('error-nivel-meta');
const selectDieta = document.querySelector('[name="dieta_actual"]');
const errorElement = document.getElementById('error-dieta');

// Definimos las descripciones
const descripcionesDieta = {
    normal: "Normal: Persona que consume todo tipo de alimentos sin ningún tipo de restricción.",
    vegetariana: "Vegetariana: No consume carne, pollo ni pescado, pero sí puede consumir productos de origen animal como leche, huevos o miel.",
    vegana: "Vegana: No consume ningún producto de origen animal, incluyendo carne, lácteos, huevos, miel y derivados."
};

const descripcionesNivelMeta = {
    transicionista: "Transicionista: Persona que está en proceso de dejar de consumir productos de origen animal, pero aún no es completamente vegetariana o vegana.",
    vegetariano: "Vegetariano: No consume carne, pollo ni pescado, pero sí puede consumir productos de origen animal como leche, huevos o miel.",
    vegano: "Vegano: No consume ningún producto de origen animal, incluyendo carne, lácteos, huevos, miel y derivados. También suele evitar el uso de productos animales en otros aspectos de la vida."
};

// Configuramos el evento para dieta (independiente)
selectDieta.addEventListener('change', () => {
    const valor = selectDieta.value.trim();
    
    selectDieta.classList.remove('campo-error', 'campo-valido');
    errorElement.classList.remove('error', 'valido');

    if (valor === '') {
        selectDieta.classList.add('campo-error');
        errorElement.textContent = '⚠️ Selecciona un tipo de dieta';
        errorElement.classList.add('error');
        errorElement.style.fontStyle = '';
        errorElement.style.color = '';
    } else {
        selectDieta.classList.add('campo-valido');
        errorElement.textContent = descripcionesDieta[valor];
        errorElement.classList.add('valido');
        errorElement.style.fontStyle = 'italic';
        errorElement.style.color = '#666';
    }
});

// Configuramos el evento para nivel meta (independiente)
nivelMeta.addEventListener('change', () => {
    const valor = nivelMeta.value.trim();
    
    nivelMeta.classList.remove('campo-error', 'campo-valido');
    errorNivelMeta.classList.remove('error', 'valido');

    if (valor === '') {
        nivelMeta.classList.add('campo-error');
        errorNivelMeta.textContent = '⚠️ Selecciona un nivel de meta';
        errorNivelMeta.classList.add('error');
        errorNivelMeta.style.fontStyle = '';
        errorNivelMeta.style.color = '';
    } else {
        nivelMeta.classList.add('campo-valido');
        errorNivelMeta.textContent = descripcionesNivelMeta[valor];
        errorNivelMeta.classList.add('valido');
        errorNivelMeta.style.fontStyle = 'italic';
        errorNivelMeta.style.color = '#666';
    }
});

    
});


    


// Historia clínica

document.addEventListener('DOMContentLoaded', () => {

  const grupos = ['patologicos', 'familiares', 'quirurgicos'];

  grupos.forEach(grupo => {
    const checkboxes = document.querySelectorAll(`input[name="${grupo}[]"]`);
    const selectedContainer = document.querySelector(`.selected-tags[data-group="${grupo}"]`);

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const label = checkbox.closest('label');
        const value = checkbox.value;

        if (checkbox.checked) {
          label.classList.add('selected');

          if (!selectedContainer.querySelector(`[data-value="${value}"]`)) {
            const tag = document.createElement('div');
            tag.classList.add('selected-tag');
            tag.setAttribute('data-value', value);
            tag.innerHTML = `${value} <span class="remove-tag">&times;</span>`;
            selectedContainer.appendChild(tag);

            tag.querySelector('.remove-tag').addEventListener('click', () => {
              checkbox.checked = false;
              label.classList.remove('selected');
              tag.remove();

              ajustarTamanioEtiquetas(); // Actualiza tamaño al eliminar etiqueta
            });
          }

        } else {
          label.classList.remove('selected');
          const tag = selectedContainer.querySelector(`[data-value="${value}"]`);
          if (tag) tag.remove();
        }

        ajustarTamanioEtiquetas(); // Actualiza tamaño cada vez que cambia selección
      });
    });
  });

  // Inicializa tamaño correcto en carga
  ajustarTamanioEtiquetas();

});

function ajustarTamanioEtiquetas() {
  const grupos = ['patologicos', 'familiares', 'quirurgicos'];

  grupos.forEach(grupo => {
    const selectedContainer = document.querySelector(`.selected-tags[data-group="${grupo}"]`);
    if (!selectedContainer) return;

    selectedContainer.style.fontSize = '10px';  // tamaño fijo para todas
  });
}

//afecciones personales 
document.addEventListener('DOMContentLoaded', () => {
  const grupos = ['intolerancias', 'alergias', ];

  grupos.forEach(grupo => {
    const checkboxes = document.querySelectorAll(`input[name="${grupo}[]"]`);
    const selectedContainer = document.querySelector(`.selected-tags[data-group="${grupo}"]`);

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const label = checkbox.closest('label');
        const value = checkbox.value;

        if (checkbox.checked) {
          label.classList.add('selected');

          if (!selectedContainer.querySelector(`[data-value="${value}"]`)) {
            const tag = document.createElement('div');
            tag.classList.add('selected-tag');
            tag.setAttribute('data-value', value);
            tag.innerHTML = `${value} <span class="remove-tag">&times;</span>`;
            selectedContainer.appendChild(tag);

            tag.querySelector('.remove-tag').addEventListener('click', () => {
              checkbox.checked = false;
              label.classList.remove('selected');
              tag.remove();
            });
          }
        } else {
          label.classList.remove('selected');
          const tag = selectedContainer.querySelector(`[data-value="${value}"]`);
          if (tag) tag.remove();
        }
      });
    });
  });
});


//sintomas gastrointestinales
document.addEventListener('DOMContentLoaded', () => {
  const grupos = ['sintomas'];

  grupos.forEach(grupo => {
    const checkboxes = document.querySelectorAll(`input[name="${grupo}[]"]`);
    const selectedContainer = document.querySelector(`.selected-tags[data-group="${grupo}"]`);

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const label = checkbox.closest('label');
        const value = checkbox.value;

        if (checkbox.checked) {
          label.classList.add('selected');

          if (!selectedContainer.querySelector(`[data-value="${value}"]`)) {
            const tag = document.createElement('div');
            tag.classList.add('selected-tag');
            tag.setAttribute('data-value', value);
            tag.innerHTML = `${value} <span class="remove-tag">&times;</span>`;
            selectedContainer.appendChild(tag);

            tag.querySelector('.remove-tag').addEventListener('click', () => {
              checkbox.checked = false;
              label.classList.remove('selected');
              tag.remove();
            });
          }
        } else {
          label.classList.remove('selected');
          const tag = selectedContainer.querySelector(`[data-value="${value}"]`);
          if (tag) tag.remove();
        }
      });
    });
  });
});

//Dieta prescrita por profecional
document.addEventListener('DOMContentLoaded', () => {
  const checkboxDieta = document.getElementById('dietaCheckbox');
  const dietaDescripcion = document.getElementById('descripcionDieta');
  const errorDieta = document.getElementById('errorDieta');
  const contadorPalabras = document.getElementById('contadorPalabras');
  const form = document.getElementById('form-crear-perfil'); // form por id

  const malasPalabras = [
    'mierda', 'puta', 'puto', 'put@', 'estúpido', 'estupido', 'tonto', 'idiota', 'imbécil', 
    'imbecil', 'pendejo', 'maldito', 'perra', 'cabron', 'chingada', 'coño', 'culero', 'cabrón',
    'verga', 'huevón', 'gilipollas', 'cerote', 'chucho', 'puchica', 'maje', 'baboso', 'bolo',
    'vergo', 'vergon', 'pijudo', 'vergazo', 'hijueputa', 'hijuep', 'hijoep', 'vergonada',
    'nalga', 'nalgas', 'verguero', 'malacate', 'asdf', 'asdasd', '123', '321', '111', '0000',
    'loquesea', 'ninguna', 'nada', 'xxx', 'qwerty', 'abc', 'abcdef', 'test', 'testing', 'aaaa',
    'bbbb', 'cccc'
  ];

  // Mostrar/ocultar textarea
  window.toggleDietaBox = function() {
    if (checkboxDieta.checked) {
      dietaDescripcion.parentElement.style.display = 'block';
    } else {
      dietaDescripcion.parentElement.style.display = 'none';
      limpiarEstado();
    }
  };

  function contarPalabras(texto) {
    if (!texto.trim()) return 0;
    return texto.trim().split(/\s+/).length;
  }

  function limpiarEstado() {
    errorDieta.style.display = 'none';
    dietaDescripcion.style.borderColor = '';
    contadorPalabras.style.color = '#555';
  }

  dietaDescripcion.addEventListener('input', () => {
    const texto = dietaDescripcion.value.toLowerCase();
    const palabras = contarPalabras(dietaDescripcion.value);

    contadorPalabras.textContent = `${palabras} / 250 palabras`;

    if (palabras > 250) {
      contadorPalabras.style.color = 'red';
      dietaDescripcion.style.borderColor = 'red';
      errorDieta.textContent = 'Has excedido el límite máximo de 250 palabras.';
      errorDieta.style.display = 'block';
      return;
    }

    const contieneMalaPalabra = malasPalabras.some(palabra => texto.includes(palabra));
    if (contieneMalaPalabra) {
      errorDieta.textContent = 'Por favor, escribe una descripción válida y respetuosa.';
      errorDieta.style.display = 'block';
      dietaDescripcion.style.borderColor = 'red';
    } else {
      limpiarEstado();
    }
  });

  // Validación y envío con fetch
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validar
    if (checkboxDieta.checked) {
      const texto = dietaDescripcion.value.trim();
      const palabras = contarPalabras(texto);
      const contieneMalaPalabra = malasPalabras.some(palabra => texto.toLowerCase().includes(palabra));

      if (texto === '') {
        errorDieta.textContent = 'Por favor, describe la dieta prescrita por el profesional o desmarque el checkbox.';
        errorDieta.style.display = 'block';
        dietaDescripcion.style.borderColor = 'red';
        dietaDescripcion.focus();
        return;
      }

      if (palabras > 250) {
        errorDieta.textContent = 'Has excedido el límite máximo de 250 palabras.';
        errorDieta.style.display = 'block';
        dietaDescripcion.style.borderColor = 'red';
        dietaDescripcion.focus();
        return;
      }

      if (contieneMalaPalabra) {
        errorDieta.textContent = 'Por favor, escribe una descripción válida y respetuosa.';
        errorDieta.style.display = 'block';
        dietaDescripcion.style.borderColor = 'red';
        dietaDescripcion.focus();
        return;
      }
    }

    // Si pasa validación, enviar con fetch y mostrar loader
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
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
});

document.getElementById('form-crear-perfil').addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!validarDieta()) return;

  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

  try {
    const response = await fetch(this.action, {
      method: 'POST',
      body: new FormData(this)
    });
    const data = await response.json();

    if (data.error === "user_exists") {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ya tienes un perfil creado.',
        confirmButtonText: 'Entendido'
      });
      window.location.href = '/Pantalla_principal/index_pantalla_principal.html';
      return; // Detener ejecución
    }

    if (data.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Perfil guardado!',
        timer: 3000
      });
      window.location.href = '/Pantalla_principal/index_pantalla_principal.html';
    } else {
      throw new Error(data.message || "Error desconocido");
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire('Error', 'No se pudo guardar el perfil', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});
