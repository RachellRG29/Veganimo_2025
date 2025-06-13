console.log("✅ validacion_crear_receta.js cargado correctamente");

function iniciarValidacionCrearReceta() {
  const nombre = document.getElementById('name-receta');
  const descripcion = document.getElementById('description-receta');
  const categoria = document.getElementById('categoria-receta');
  const estrellas = document.getElementsByName('star-radio[]');
  const botonSiguiente = document.querySelector('.next-button');
  const imagenInput = document.getElementById('input-imagen-receta');

  if (!nombre || !descripcion || !categoria || !estrellas.length || !botonSiguiente || !imagenInput) {
    console.warn("⚠️ Elementos del formulario no encontrados. ¿Ya se cargó el HTML?");
    return;
  }

  let intentoEnvio = false;

  function aplicarEstiloError(campo) {
    campo.style.border = '1px solid red';
    campo.style.backgroundColor = '#ffe5e5';
  }

  function quitarEstiloError(campo) {
    campo.style.border = '';
    campo.style.backgroundColor = '';
  }

  function crearAviso(campo, mensaje) {
    let aviso = campo.parentElement.querySelector('.mensaje-error');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'mensaje-error';
      aviso.style.color = 'red';
      aviso.style.fontSize = '12px';
      aviso.style.marginTop = '5px';
      campo.parentElement.appendChild(aviso);
    }
    aviso.textContent = mensaje;
  }

  function eliminarAviso(campo) {
    let aviso = campo.parentElement.querySelector('.mensaje-error');
    if (aviso) aviso.remove();
  }

  function contarPalabras(texto) {
    return texto.trim().split(/\s+/).filter(Boolean).length;
  }

  // Crear contador de palabras debajo del campo
  const contadorPalabras = document.createElement('div');
  contadorPalabras.style.fontSize = '12px';
  contadorPalabras.style.marginTop = '5px';
  contadorPalabras.style.color = '#999';
  descripcion.parentElement.appendChild(contadorPalabras);

  function actualizarContador() {
    const palabras = contarPalabras(descripcion.value);
    contadorPalabras.textContent = `${palabras} / 200 palabras`;
    if (palabras > 200) {
      descripcion.value = descripcion.value.trim().split(/\s+/).slice(0, 200).join(' ');
      contadorPalabras.textContent = `200 / 200 palabras`;
    }
  }

  function validarDescripcion() {
    const palabras = contarPalabras(descripcion.value);
    if (palabras < 3) {
      if (intentoEnvio) {
        aplicarEstiloError(descripcion);
        crearAviso(descripcion, 'Escribe al menos 3 palabras en la descripción.');
      } else {
        quitarEstiloError(descripcion);
        eliminarAviso(descripcion);
      }
      return false;
    } else {
      quitarEstiloError(descripcion);
      eliminarAviso(descripcion);
      return true;
    }
  }

  function validarCampo(campo, mensaje) {
    if (!campo.value.trim()) {
      if (intentoEnvio) {
        aplicarEstiloError(campo);
        crearAviso(campo, mensaje);
      } else {
        quitarEstiloError(campo);
        eliminarAviso(campo);
      }
      return false;
    } else {
      quitarEstiloError(campo);
      eliminarAviso(campo);
      return true;
    }
  }

function validarImagen() {
  const archivo = imagenInput.files[0];
  const imgContainer = document.querySelector('.img-container');

  // Asegurar que el contenedor tenga position: relative
  imgContainer.style.position = 'relative';

  // Buscar si ya hay un tooltip
  let tooltip = imgContainer.querySelector('.tooltip-error-imagen');

  if (!archivo && intentoEnvio) {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'tooltip-error-imagen';
      tooltip.textContent = 'Selecciona una imagen de receta.';
      Object.assign(tooltip.style, {
        position: 'absolute',
        top: '-2px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#e53935',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
        whiteSpace: 'nowrap',
        zIndex: '999',
      });
      imgContainer.appendChild(tooltip);
    }
    return false;
  } else {
    if (tooltip) tooltip.remove();
    return true;
  }
}


function validarEstrellas() {
  const seleccionado = Array.from(estrellas).some(e => e.checked);
  const contenedor = estrellas[0].closest('.rating');

  contenedor.style.position = 'relative'; // necesario para posicionar el tooltip dentro

  let tooltip = contenedor.querySelector('.tooltip-error');

  if (!seleccionado && intentoEnvio) {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'tooltip-error';
      tooltip.textContent = 'Selecciona una calificación.';
      Object.assign(tooltip.style, {
        position: 'absolute',
        top: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#f44336',
        color: 'white',
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
    if (tooltip) tooltip.remove();
    return true;
  }
}
  function validarFormulario() {
    const nombreValido = validarCampo(nombre, 'El nombre de la receta es obligatorio.');
    const descripcionValida = validarDescripcion();
    const categoriaValida = validarCampo(categoria, 'Selecciona una categoría.');
    const estrellasValidas = validarEstrellas();
    const imagenValida = validarImagen();

    console.log({
      nombreValido,
      descripcionValida,
      categoriaValida,
      estrellasValidas,
      imagenValida
    });

    return nombreValido && descripcionValida && categoriaValida && estrellasValidas && imagenValida;
  }

  nombre.addEventListener('input', () => {
    if (intentoEnvio) validarCampo(nombre, 'El nombre de la receta es obligatorio.');
  });
  descripcion.addEventListener('input', () => {
    actualizarContador();
    if (intentoEnvio) validarDescripcion();
  });
  categoria.addEventListener('change', () => {
    if (intentoEnvio) validarCampo(categoria, 'Selecciona una categoría.');
  });
  estrellas.forEach(e => e.addEventListener('change', () => {
    if (intentoEnvio) validarEstrellas();
  }));
  imagenInput.addEventListener('change', () => {
    if (intentoEnvio) validarImagen();
  });

  botonSiguiente.addEventListener('click', function (e) {
    e.preventDefault();
    intentoEnvio = true;
    const todoValido = validarFormulario();
    console.log('¿Formulario válido?', todoValido);
    if (!todoValido) return;

    if (typeof nextSectionCR === 'function') {
      nextSectionCR(1);
    } else {
      console.warn('⚠️ La función nextSectionCR(1) no está definida.');
    }
  });

  actualizarContador();
  console.log("✅ Validación inicializada correctamente.");
}

document.addEventListener('DOMContentLoaded', iniciarValidacionCrearReceta);
