console.log("✅ validacion_crear_receta.js cargado correctamente");

function iniciarValidacionCrearReceta() {
  // ==== SECCIÓN 1 ====

  const nombre = document.getElementById('name-receta');
  const descripcion = document.getElementById('description-receta');
  const categoria = document.getElementById('categoria-receta');
  const estrellas = document.getElementsByName('star-radio[]');
  const botonSiguiente1 = document.querySelector('#section1 .next-button');
  const imagenInput = document.getElementById('input-imagen-receta');

  let intentoEnvio = false;

  // Funciones para mostrar / eliminar avisos sección 1
  function crearAvisoSeccion1(campo, mensaje) {
    let aviso = campo.parentElement.querySelector('.mensaje-error-seccion1');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'mensaje-error-seccion1';
      aviso.style.color = 'red';
      aviso.style.fontSize = '12.5px';
      aviso.style.marginTop = '5px';
      aviso.style.display = 'block';
      aviso.style.position = 'relative';
      aviso.style.lineHeight = '1.3';
      campo.parentElement.appendChild(aviso);
    }
    aviso.textContent = mensaje;
  }

  function eliminarAvisoSeccion1(campo) {
    const aviso = campo.parentElement.querySelector('.mensaje-error-seccion1');
    if (aviso) aviso.remove();
  }

  // Aplica y quita estilos de error a inputs
  function aplicarEstiloError(campo) {
    campo.classList.add('input-error');
    campo.style.border = '2px solid red';
    campo.style.backgroundColor = 'white';
  }

  function quitarEstiloError(campo) {
    campo.classList.remove('input-error');
    campo.style.border = '';
    campo.style.backgroundColor = '';
  }

  // Contador de palabras descripción
  const contadorPalabras = document.createElement('div');
  contadorPalabras.style.fontSize = '11.5px';
  contadorPalabras.style.marginTop = '5px';
    contadorPalabras.style.marginBottom = '-10px';
  contadorPalabras.style.color = '#999';
  descripcion.parentElement.appendChild(contadorPalabras);

  function contarPalabras(texto) {
    return texto.trim().split(/\s+/).filter(Boolean).length;
  }

  function actualizarContador() {
    const palabras = contarPalabras(descripcion.value);
    contadorPalabras.textContent = `${palabras} / 200 palabras`;
    if (palabras > 200) {
      descripcion.value = descripcion.value.trim().split(/\s+/).slice(0, 200).join(' ');
      contadorPalabras.textContent = `200 / 200 palabras`;
    }
  }

  // Validaciones sección 1

  function validarCampoSeccion1(campo, mensaje) {
    if (!campo.value.trim()) {
      if (intentoEnvio) {
        aplicarEstiloError(campo);
        crearAvisoSeccion1(campo, mensaje);
      } else {
        quitarEstiloError(campo);
        eliminarAvisoSeccion1(campo);
      }
      return false;
    } else {
      quitarEstiloError(campo);
      eliminarAvisoSeccion1(campo);
      return true;
    }
  }

  function validarDescripcion() {
    const palabras = contarPalabras(descripcion.value);
    if (palabras < 3) {
      if (intentoEnvio) {
        aplicarEstiloError(descripcion);
        crearAvisoSeccion1(descripcion, 'Escribe al menos 3 palabras en la descripción.');
      } else {
        quitarEstiloError(descripcion);
        eliminarAvisoSeccion1(descripcion);
      }
      return false;
    } else {
      quitarEstiloError(descripcion);
      eliminarAvisoSeccion1(descripcion);
      return true;
    }
  }

  function validarImagen() {
    const archivo = imagenInput.files[0];
    const imgContainer = document.querySelector('.img-container');
    imgContainer.style.position = 'relative';
    let tooltip = imgContainer.querySelector('.tooltip-error-imagen');

    if (!archivo && intentoEnvio) {
      imgContainer.style.border = '2px solid #FE4D3E';
      imgContainer.style.borderRadius = '8px';
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip-error-imagen';
        tooltip.textContent = 'Selecciona una imagen de receta.';
        Object.assign(tooltip.style, {
          position: 'absolute',
          top: '-2px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          color: '#e53935',
          border: '1px solid #e53935',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          whiteSpace: 'nowrap',
          zIndex: '999',
        });
        imgContainer.appendChild(tooltip);
      }
      return false;
    } else {
      imgContainer.style.border = '';
      if (tooltip) tooltip.remove();
      return true;
    }
  }

  function validarEstrellas() {
    const seleccionado = Array.from(estrellas).some(e => e.checked);
    const contenedor = estrellas[0].closest('.rating');
    contenedor.style.position = 'relative';
    let tooltip = contenedor.querySelector('.tooltip-error');

    if (!seleccionado && intentoEnvio) {
      contenedor.classList.add('error');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip-error';
        tooltip.textContent = 'Selecciona una calificación.';
        Object.assign(tooltip.style, {
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#FFDDD3',
          color: '#1A1C1C',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          whiteSpace: 'nowrap',
          zIndex: '999',
        });
        contenedor.appendChild(tooltip);
      }
      return false;
    } else {
      contenedor.classList.remove('error');
      if (tooltip) tooltip.remove();
      return true;
    }
  }

 function validarFormulario1() {
  const nombreValido = validarCampoSeccion1(nombre, 'El nombre de la receta es obligatorio.');
  const descripcionValida = validarDescripcion();
  const categoriaValida = validarCampoSeccion1(categoria, 'Selecciona una categoría.');
  const estrellasValidas = validarEstrellas();
  const imagenValida = validarImagen();

  const valorLimpio = nombre.value.replace(/\s/g, '');
  if (valorLimpio.length < 3) {
    aplicarEstiloError(nombre);
    crearAvisoSeccion1(nombre, 'El nombre debe tener al menos 3 letras.');
    return false;
  }

  return nombreValido && descripcionValida && categoriaValida && estrellasValidas && imagenValida;
}


  // Eventos sección 1
nombre.addEventListener('input', () => {
  nombre.value = nombre.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

  if (intentoEnvio) {
    validarCampoSeccion1(nombre, 'El nombre de la receta es obligatorio.');

    const valorLimpio = nombre.value.replace(/\s/g, '');
    if (valorLimpio.length < 3) {
      aplicarEstiloError(nombre);
      crearAvisoSeccion1(nombre, 'El nombre debe tener al menos 3 letras.');
    } else {
      quitarEstiloError(nombre);
      eliminarAvisoSeccion1(nombre);
    }
  }
});



descripcion.addEventListener('input', () => {
  // Limpiar lo que no sea letras, puntos, comas o espacios
  descripcion.value = descripcion.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ.,\s]/g, '');

  actualizarContador();
  intentoEnvio && validarDescripcion();
});


  categoria.addEventListener('change', () => intentoEnvio && validarCampoSeccion1(categoria, 'Selecciona categoría.'));
  estrellas.forEach(e => e.addEventListener('change', () => intentoEnvio && validarEstrellas()));
  imagenInput.addEventListener('change', () => intentoEnvio && validarImagen());

  botonSiguiente1.addEventListener('click', function (e) {
    e.preventDefault();
    intentoEnvio = true;
    if (validarFormulario1()) {
      nextSectionCR(1);
    }
  });

  actualizarContador();

  // ==== FIN SECCIÓN 1 ====



  // ==== SECCIÓN 2 ====

  const tiempoInput = document.getElementById('time-receta');
  const dificultadSelect = document.getElementById('select-dificultad');
  const ingredientesZona = document.getElementById('lista-ingredientes');
  const botonSiguiente2 = document.querySelector('#section2 .next-button');

  let intentoEnvio2 = false;

  function crearAvisoSeccion2(campo, mensaje) {
    let aviso = campo.parentElement.querySelector('.mensaje-error-seccion2');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'mensaje-error-seccion2';
      aviso.style.color = 'red';
      aviso.style.fontSize = '13px';
      aviso.style.marginTop = '60px';
      aviso.style.display = 'block';
      aviso.style.position = 'absolute';
      aviso.style.lineHeight = '1.3';
      campo.parentElement.appendChild(aviso);
    }
    aviso.textContent = mensaje;
  }

  function eliminarAvisoSeccion2(campo) {
    const aviso = campo.parentElement.querySelector('.mensaje-error-seccion2');
    if (aviso) aviso.remove();
  }

  function validarTiempo() {
    const valor = parseInt(tiempoInput.value, 10);
    if (isNaN(valor) || valor < 1) {
      if (intentoEnvio2) {
        aplicarEstiloError(tiempoInput);
        crearAvisoSeccion2(tiempoInput, 'Tiempo mínimo: 1 unidad.');
      }
      return false;
    } else {
      quitarEstiloError(tiempoInput);
      eliminarAvisoSeccion2(tiempoInput);
      return true;
    }
  }

  function validarDificultad() {
    if (!dificultadSelect.value.trim()) {
      if (intentoEnvio2) {
        aplicarEstiloError(dificultadSelect);
        crearAvisoSeccion2(dificultadSelect, 'Selecciona la dificultad de la receta...');
      }
      return false;
    } else {
      quitarEstiloError(dificultadSelect);
      eliminarAvisoSeccion2(dificultadSelect);
      return true;
    }
  }

  function validarIngredientes() {
    const inputs = ingredientesZona.querySelectorAll('input[name="ingredientes[]"]');
    const total = inputs.length;
    let algunoLleno = false;
    let todosValidos = true;

    inputs.forEach(input => {
      const valor = input.value.trim();

      if (valor !== '') {
        algunoLleno = true;
        quitarEstiloError(input);
        eliminarAvisoSeccion2(input);
      } else {
        if (total > 1 && intentoEnvio2) {
          aplicarEstiloError(input);
          crearAvisoSeccion2(input, 'Este campo no tiene ingrediente.');
          todosValidos = false;
        } else {
          quitarEstiloError(input);
          eliminarAvisoSeccion2(input);
        }
      }
    });

    if (!algunoLleno && intentoEnvio2) {
      aplicarEstiloError(inputs[0]);
      crearAvisoSeccion2(inputs[0], 'Agrega al menos un ingrediente.');
      return false;
    }

    return todosValidos && algunoLleno;
  }

  function validarFormulario2() {
    const tiempoValido = validarTiempo();
    const dificultadValida = validarDificultad();
    const ingredientesValidos = validarIngredientes();
    return tiempoValido && dificultadValida && ingredientesValidos;
  }

  // Eventos sección 2
  tiempoInput.addEventListener('input', () => intentoEnvio2 && validarTiempo());
  dificultadSelect.addEventListener('change', () => intentoEnvio2 && validarDificultad());
  ingredientesZona.addEventListener('input', () => intentoEnvio2 && validarIngredientes());

  botonSiguiente2.addEventListener('click', function (e) {
    e.preventDefault();
    intentoEnvio2 = true;
    if (validarFormulario2()) {
      nextSectionCR(2);
    }
  });

  // ==== FIN SECCIÓN 2 ====



  // ==== SECCIÓN 3 ====

  const pasosZona = document.getElementById('lista-pasos');
  const botonGuardar = document.querySelector('.btn-crear-receta');

  let intentoEnvio3 = false;

  function crearAvisoSeccion3(campo, mensaje) {
    let aviso = campo.parentElement.querySelector('.mensaje-error-seccion3');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'mensaje-error-seccion3';
      aviso.style.color = 'red';
      aviso.style.fontSize = '13px';
      aviso.style.marginTop = '65px';
      aviso.style.marginLeft = '140px';
      aviso.style.display = 'block';
      aviso.style.position = 'absolute';
      aviso.style.lineHeight = '1.3';
      campo.parentElement.appendChild(aviso);
    }
    aviso.textContent = mensaje;
  }

  function eliminarAvisoSeccion3(campo) {
    const aviso = campo.parentElement.querySelector('.mensaje-error-seccion3');
    if (aviso) aviso.remove();
  }

  function validarPasos() {
    const inputs = pasosZona.querySelectorAll('input[name="pasos[]"]');
    const total = inputs.length;
    let algunoLleno = false;
    let todosValidos = true;

    inputs.forEach(input => {
      const valor = input.value.trim();

      if (valor !== '') {
        algunoLleno = true;
        quitarEstiloError(input);
        eliminarAvisoSeccion3(input);
      } else {
        if (total > 1 && intentoEnvio3) {
          aplicarEstiloError(input);
          crearAvisoSeccion3(input, 'Este paso está vacío.');
          todosValidos = false;
        } else {
          quitarEstiloError(input);
          eliminarAvisoSeccion3(input);
        }
      }
    });

    if (!algunoLleno && intentoEnvio3) {
      aplicarEstiloError(inputs[0]);
      crearAvisoSeccion3(inputs[0], 'Agrega al menos un paso.');
      return false;
    }

    return todosValidos && algunoLleno;
  }

  // Eventos sección 3

  pasosZona.addEventListener('input', () => {
    if (intentoEnvio3) validarPasos();
  });

  botonGuardar.addEventListener('click', function (e) {
    intentoEnvio3 = true;
    if (!validarPasos()) {
      e.preventDefault();
    }
  });

  // ==== FIN SECCIÓN 3 ====

}

document.addEventListener('DOMContentLoaded', iniciarValidacionCrearReceta);
