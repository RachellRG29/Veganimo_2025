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
  let formularioModificado = false;

  // Detecta cualquier cambio en el formulario
  document.querySelector('form').addEventListener('input', () => {
    formularioModificado = true;
  });

  // Confirma si el usuario recarga o cierra la pestaña,
  // pero se omite si hay un modal SweetAlert2 abierto:
  window.addEventListener('beforeunload', (e) => {
    const swalModal = document.querySelector('.swal2-container');
    if (formularioModificado && !swalModal) {
      e.preventDefault();
      e.returnValue = ''; // necesario para algunos navegadores
      return 'Tienes cambios sin guardar. ¿Seguro que quieres salir?';
    }
  });

  // Confirma si el usuario hace clic fuera del formulario,
  // pero se omite si el clic viene de dentro del modal o de Cropper:
  document.addEventListener('click', (e) => {
    if (!formularioModificado) return;

    const formulario = document.querySelector('form');
    const esElementoModal = !!e.target.closest(
      '.swal2-container, .cropper-container, .cropper-modal'
    );
    
    // Verificar si el click es en un botón de eliminar
    const esBotonEliminar = e.target.closest('.btn-eliminar');
    
    if (!formulario.contains(e.target) && !esElementoModal && !esBotonEliminar) {
      e.preventDefault();
      e.stopPropagation();
      if (confirm('¿Estás seguro de que deseas salir del formulario? Los datos ingresados se perderán.')) {
        formulario.reset();
        formularioModificado = false;
      }
    }
});

  function crearAvisoSeccion1(campo, mensaje) {
    let aviso = campo.parentElement.querySelector('.mensaje-error-seccion1');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'mensaje-error-seccion1';
      aviso.style.color = 'red';
      aviso.style.fontSize = '13px';
      aviso.style.marginTop = '5px';
      campo.parentElement.appendChild(aviso);
    }
    aviso.textContent = mensaje;
  }

  function eliminarAvisoSeccion1(campo) {
    const aviso = campo.parentElement.querySelector('.mensaje-error-seccion1');
    if (aviso) aviso.remove();
  }

  function aplicarEstiloError(campo) {
    campo.style.borderColor = 'red';
    campo.style.boxShadow = '0 0 0 2px rgba(255, 0, 0, 0.1)';
  }

  function quitarEstiloError(campo) {
    campo.style.borderColor = '';
    campo.style.boxShadow = '';
  }

  // Contador de palabras descripción
  const contadorPalabras = document.createElement('div');
  Object.assign(contadorPalabras.style, {
    fontSize: '11.5px',
    marginTop: '5px',
    marginBottom: '-10px',
    color: '#999'
  });
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

  descripcion.addEventListener('input', actualizarContador);
  actualizarContador();

  function validarCampoSeccion1(campo, mensaje) {
    if (!campo.value.trim()) {
      aplicarEstiloError(campo);
      crearAvisoSeccion1(campo, mensaje);
      return false;
    } else {
      quitarEstiloError(campo);
      eliminarAvisoSeccion1(campo);
      return true;
    }
  }

  function validarDescripcion() {
    const texto = descripcion.value.trim();
    if (!texto) {
      aplicarEstiloError(descripcion);
      crearAvisoSeccion1(descripcion, 'Por favor, Complete este campo.');
      return false;
    } else if (contarPalabras(texto) < 3) {
      aplicarEstiloError(descripcion);
      crearAvisoSeccion1(descripcion, 'La descripción debe tener al menos 3 palabras.');
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

  // Función para mostrar preview de receta con SweetAlert2 + Cropper
  function mostrarPreviewReceta(input, imgElement) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      Swal.fire({
        title: 'Recortar imagen',
        html: `
          <div style="width:100%;max-height:60vh;margin:0 auto;">
            <img id="imagen-modal" src="${e.target.result}" style="max-width:100%;">
          </div>`,
        showCancelButton: true,
        confirmButtonText: 'Aplicar',
        cancelButtonText: 'Cancelar',
        customClass: { confirmButton: 'btn-confirmar', cancelButton: 'btn-cancelar' },
        buttonsStyling: false,
        didOpen: () => {
          const image = document.getElementById('imagen-modal');
          cropper = new Cropper(image, { aspectRatio:1, viewMode:1, autoCrop:true });
        },
        preConfirm: () => {
          const canvas = cropper.getCroppedCanvas({ width:300, height:300, fillColor:'#fff' });
          return canvas.toDataURL('image/png');
        },
        willClose: () => {
          if (cropper) { cropper.destroy(); cropper = null; }
        }
      }).then(result => {
        if (result.isConfirmed) {
          imgElement.src = result.value;
          imgElement.style.display = 'block';
          document.querySelector('.icono-placeholder').style.display = 'none';
          formularioModificado = true; // marcar cambio
        } else {
          input.value = '';
        }
      });
    };
    reader.readAsDataURL(file);
  }

  // Exponer la función globalmente
  window.mostrarPreviewReceta = mostrarPreviewReceta;

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
    const nombreValido = validarCampoSeccion1(nombre, 'El nombre debe tener al menos 3 letras.');
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

  const palabrasProhibidas = ['mierda', 'puta', 'puto', 'put@', 'estúpido', 'estupido', 'tonto', 'idiota', 'imbécil', 
    'imbecil', 'pendejo', 'maldito', 'perra', 'cabron', 'chingada', 'coño', 'culero', 'cabrón',
    'verga', 'huevón', 'gilipollas', 'cerote', 'chucho', 'puchica', 'maje', 'baboso', 'bolo',
    'vergo', 'vergon', 'pijudo', 'vergazo', 'hijueputa', 'hijuep', 'hijoep', 'vergonada',
    'nalga', 'nalgas', 'verguero', 'malacate', 'asdf', 'asdasd', '123', '321', '111', '0000',
    'loquesea', 'ninguna', 'nada', 'xxx', 'qwerty', 'abc', 'abcdef', 'test', 'testing', 'aaaa',
    'bbbb', 'cccc']; 

  nombre.addEventListener('input', () => {
    // Limpiar caracteres no válidos
    nombre.value = nombre.value
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') // Solo letras con tildes, ñ y espacios
      .replace(/^\s+/, '')                     // Quitar espacios al inicio
      .replace(/\s{2,}/g, ' ');                // Reemplazar múltiples espacios por uno

    const valorLimpio = nombre.value.trim().replace(/\s+/g, ' ');
    const letrasSinEspacios = valorLimpio.replace(/\s/g, '');
    const palabras = valorLimpio.split(' ').filter(Boolean); // Evita contar palabras vacías

    const contieneVulgaridad = palabras.some(palabra =>
      palabrasProhibidas.includes(palabra.toLowerCase())
    );

    // Validar en tiempo real 
    if (contieneVulgaridad) {
      aplicarEstiloError(nombre);
      crearAvisoSeccion1(nombre, 'Por favor, escribe un nombre válido y respetuoso.');
      return;
    }

    if (letrasSinEspacios.length < 3) {
      aplicarEstiloError(nombre);
      crearAvisoSeccion1(nombre, 'El nombre debe tener al menos 3 letras.');
      return;
    }

    if (palabras.length > 6) {
      aplicarEstiloError(nombre);
      crearAvisoSeccion1(nombre, 'El nombre no debe tener más de 6 palabras.');
      return;
    }

    // Si pasa todas las validaciones:
    quitarEstiloError(nombre);
    eliminarAvisoSeccion1(nombre);
  });

descripcion.addEventListener('input', () => {
  // Limpieza
  descripcion.value = descripcion.value
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,]/g, '')
    .replace(/^\s+/, '')
    .replace(/^[\s.,]+/, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\.{2,}/g, '.')
    .replace(/,{2,}/g, ',');

  const texto = descripcion.value.trim();
  const palabras = texto.split(/\s+/).filter(Boolean);

  // Detectar vulgaridad
  const contieneVulgaridad = palabras.some(palabra =>
    palabrasProhibidas.includes(palabra.toLowerCase())
  );

  if (contieneVulgaridad) {
    aplicarEstiloError(descripcion);
    crearAvisoSeccion1(descripcion, 'Por favor, escribe una descripción válida y respetuosa.');
  } else {
    quitarEstiloError(descripcion);
    eliminarAvisoSeccion1(descripcion);
  }

  actualizarContador();
  if (intentoEnvio) validarDescripcion();
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
    } else if (valor > 300) {
      if (intentoEnvio2) {
        aplicarEstiloError(tiempoInput);
        crearAvisoSeccion2(tiempoInput, 'El máximo de minutos es 300.');
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
  const regexGeneral = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,]+$/;

  // Desactiva botón si se pasa de 15 ingredientes
  const botonAgregar = document.getElementById('btn-aniadir-ingrediente');
  if (botonAgregar) {
    botonAgregar.disabled = total >= 15;
  }

  // Valida máximo global
if (total > 15) {
  const ultimoInput = inputs[inputs.length - 1];
  aplicarEstiloError(ultimoInput);
  crearAvisoSeccion2(ultimoInput, 'Máximo 15 ingredientes permitidos.');
  todosValidos = false;
}



  inputs.forEach((input, i) => {
    const valor = input.value.trim().toLowerCase();
    const palabras = valor === '' ? 0 : valor.split(/\s+/).length;
    const contieneProhibida = palabrasProhibidas.some(p => valor.includes(p));

    if (valor !== '') {
      if (!regexGeneral.test(valor)) {
        aplicarEstiloError(input);
        crearAvisoSeccion2(input, `Ingrediente ${i+1} no válido.`);
        todosValidos = false;

      } else if (contieneProhibida) {
        aplicarEstiloError(input);
        crearAvisoSeccion2(input, `Ingrediente ${i+1} contiene palabra no permitida.`);
        todosValidos = false;

      } else if (palabras < 1) {
        aplicarEstiloError(input);
        crearAvisoSeccion2(input, `Ingrediente ${i+1} debe tener al menos 1 palabra.`);
        todosValidos = false;

      } else if (palabras > 6) {
        aplicarEstiloError(input);
        crearAvisoSeccion2(input, `Ingrediente ${i+1} no puede exceder 6 palabras.`);
        todosValidos = false;

      } else {
        // válido
        quitarEstiloError(input);
        eliminarAvisoSeccion2(input);
        algunoLleno = true;
      }

    } else {
      // campo vacío
      if (total > 1 && intentoEnvio2) {
        aplicarEstiloError(input);
        crearAvisoSeccion2(input, `Ingrediente ${i+1} está vacío.`);
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

  return todosValidos && algunoLleno && total <= 15;
}

  function validarFormulario2() {
    const tiempoValido = validarTiempo();
    const dificultadValida = validarDificultad();
    const ingredientesValidos = validarIngredientes();
    return tiempoValido && dificultadValida && ingredientesValidos;
  }

  // Eventos sección 2
  let temporizadorMaximoMinutos; // para controlar el tiempo de mensaje

  tiempoInput.addEventListener('beforeinput', (e) => {
    const esNumero = /^[0-9]$/.test(e.data);
    const esPegado = e.inputType === 'insertFromPaste';

    // Detectar si ya tiene 3 dígitos y va a escribir más
    if ((tiempoInput.value.length >= 3 && esNumero) || 
        (esPegado && (e.data?.length + tiempoInput.value.length > 3))) {
      
      e.preventDefault(); // Bloquea la escritura extra

      if (intentoEnvio2) {
        aplicarEstiloError(tiempoInput);
        crearAvisoSeccion2(tiempoInput, 'El máximo de minutos es 300.');

        // Limpiar el anterior si existe
        clearTimeout(temporizadorMaximoMinutos);

        // Ocultar el mensaje después de 5 segundos
        temporizadorMaximoMinutos = setTimeout(() => {
          quitarEstiloError(tiempoInput);
          eliminarAvisoSeccion2(tiempoInput);
        }, 5000);
      }
    }
  });

  tiempoInput.addEventListener('input', () => {
    tiempoInput.value = tiempoInput.value.replace(/[^0-9]/g, '');
    const valor = parseInt(tiempoInput.value, 10);

    if (valor > 300 && intentoEnvio2) {
      aplicarEstiloError(tiempoInput);
      crearAvisoSeccion2(tiempoInput, 'El máximo de minutos es 300.');
    } else if (!isNaN(valor)) {
      quitarEstiloError(tiempoInput);
      eliminarAvisoSeccion2(tiempoInput);
    }

    if (intentoEnvio2) {
      validarTiempo();
    }
  });

  dificultadSelect.addEventListener('change', () => intentoEnvio2 && validarDificultad());
  ingredientesZona.addEventListener('input', (e) => { 
    const target = e.target;

    // Verificamos que sea un input de ingredientes
    if (target.matches('input[name="ingredientes[]"]')) {
      // Solo letras, números, espacios simples y punto y coma
      target.value = target.value
        .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,]/g, '')
        .replace(/^\s+/, '')
        .replace(/^[\s.,]+/, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\.{2,}/g, '.')
        .replace(/,{2,}/g, ',');

      validarIngredientes();
    }
  });

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
  const botonAgregarPaso = document.querySelector('.btn-agregar-paso');

  let intentoEnvio3 = false;

  function crearAvisoSeccion3(campo, mensaje) {
    let aviso = campo.parentElement.querySelector('.mensaje-error-seccion2');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'mensaje-error-seccion2';
      aviso.style.color = 'red';
      aviso.style.fontSize = '13px';
      aviso.style.position = 'absolute';
      aviso.style.right = '0'; // Alinea a la derecha
      aviso.style.top = '100%'; // Posiciona justo debajo del campo
      aviso.style.marginTop = '1px'; // Espacio entre el campo y el mensaje
      aviso.style.lineHeight = '1.5'; // Mejor interlineado
      aviso.style.maxWidth = '100%'; // Evita que se salga del contenedor
      aviso.style.textAlign = 'right'; // Alineación del texto a la derecha
      aviso.style.whiteSpace = 'normal'; // Permite múltiples líneas
      campo.parentElement.style.position = 'relative'; // Necesario para el posicionamiento absoluto
      campo.parentElement.appendChild(aviso);
    }
    aviso.textContent = mensaje;
  }

  function eliminarAvisoSeccion3(campo) {
    const aviso = campo.parentElement.querySelector('.mensaje-error-seccion2');
    if (aviso) aviso.remove();
  }

  function contarPalabras(texto) {
    return texto.trim().split(/\s+/).filter(p => p.length > 0).length;
  }

  function contienePalabraProhibida(texto) {
    const textoLimpio = texto.toLowerCase();
    return palabrasProhibidas.some(p => textoLimpio.includes(p));
  }

  function validarPasos() {
  const inputs = pasosZona.querySelectorAll('input[name="pasos[]"]');
  const total = inputs.length;
  let algunoLleno = false;
  let todosValidos = true;

  if (botonAgregarPaso) {
    botonAgregarPaso.disabled = total >= 20;
  }

  inputs.forEach((input, i) => {
    const valor = input.value.trim();
    const palabras = contarPalabras(valor);

    if (valor !== '') {
      if (palabras < 2) {
        aplicarEstiloError(input);
        crearAvisoSeccion3(input, `El paso ${i + 1} debe tener al menos 2 palabras.`);
        todosValidos = false;
      } else if (palabras > 50) {
        aplicarEstiloError(input);
        crearAvisoSeccion3(input, `El paso ${i + 1} excede el máximo de 50 palabras.`);
        todosValidos = false;
      } else if (contienePalabraProhibida(valor)) {
        aplicarEstiloError(input);
        crearAvisoSeccion3(input, `El paso ${i + 1} contiene palabras no permitidas.`);
        todosValidos = false;
      } else {
        quitarEstiloError(input);
        eliminarAvisoSeccion3(input);
        algunoLleno = true;
      }
    } else {
      if (total > 1 && intentoEnvio3) {
        aplicarEstiloError(input);
        crearAvisoSeccion3(input, `El paso ${i + 1} está vacío.`);
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

  if (total > 20) {
    const ultimo = inputs[inputs.length - 1];
    aplicarEstiloError(ultimo);
    crearAvisoSeccion3(ultimo, 'Máximo 20 pasos permitidos.');
    todosValidos = false;
  }

  return todosValidos && algunoLleno;
}


  // Validación en tiempo real
  pasosZona.addEventListener('input', (e) => {
  const target = e.target;

  if (target.matches('input[name="pasos[]"]')) {
    target.value = target.value
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,]/g, '') // Solo letras, números, espacio, punto, coma
      .replace(/^\s+/, '')
      .replace(/^[\s.,]+/, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\.{2,}/g, '.')
      .replace(/,{2,}/g, ',');

    // Validar siempre en tiempo real
    validarPasos();
  }
});

  // Validación al guardar
  botonGuardar.addEventListener('click', function (e) {
    intentoEnvio3 = true;
    if (!validarPasos()) {
      e.preventDefault();
    }
  });

  // ==== FIN SECCIÓN 3 ====
}

// Inicia todo al cargar el DOM
document.addEventListener('DOMContentLoaded', iniciarValidacionCrearReceta);