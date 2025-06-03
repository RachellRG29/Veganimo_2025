// =========================
// FUNCIONES DE INTERFAZ
// =========================

function cambiarColorIcono() {
  const icon = document.getElementById('icon-dificultad');
  const valor = document.getElementById('select-dificultad').value;

  if (valor === "Alta") icon.style.color = "red";
  else if (valor === "Media") icon.style.color = "orange";
  else icon.style.color = "green";
}

function agregarIngrediente() {
  const lista = document.getElementById("lista-ingredientes");

  const contenedor = document.createElement("div");
  contenedor.className = "ingrediente-item";
  contenedor.style.display = "flex";
  contenedor.style.alignItems = "center";
  contenedor.style.gap = "10px";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control input-border";
  input.name = "ingredientes[]";

  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.className = "btn-eliminar";
  btnEliminar.textContent = "❌";
  btnEliminar.onclick = () => {
    contenedor.remove();
    actualizarNumeracionIngredientes();
  };

  contenedor.appendChild(input);
  contenedor.appendChild(btnEliminar);
  lista.appendChild(contenedor);

  actualizarNumeracionIngredientes();
}

function agregarPaso() {
  const lista = document.getElementById("lista-pasos");

  const pasoItem = document.createElement("div");
  pasoItem.className = "paso-item";

  const pasoImagen = document.createElement("div");
  pasoImagen.className = "paso-imagen-small";

  const icono = document.createElement("i");
  icono.className = "ph ph-image icono-placeholder";

  const imgPreview = document.createElement("img");
  imgPreview.className = "img-preview";
  imgPreview.style.display = "none";

  const inputFilePaso = document.createElement("input");
  inputFilePaso.type = "file";
  inputFilePaso.accept = "image/*";
  inputFilePaso.name = "imagen-paso[]";
  inputFilePaso.style.display = "none";
  inputFilePaso.className = "input-paso-img";

  pasoImagen.onclick = () => inputFilePaso.click();
  inputFilePaso.onchange = function () {
    mostrarPreviewPaso(this, imgPreview);
  };

  pasoImagen.appendChild(icono);
  pasoImagen.appendChild(imgPreview);
  pasoImagen.appendChild(inputFilePaso);

  const inputPaso = document.createElement("input");
  inputPaso.type = "text";
  inputPaso.name = "pasos[]";
  inputPaso.className = "form-control input-border paso-input";

  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.className = "btn-eliminar";
  btnEliminar.textContent = "❌";
  btnEliminar.onclick = () => {
    pasoItem.remove();
    actualizarNumeracionPasos();
  };

  pasoItem.appendChild(pasoImagen);
  pasoItem.appendChild(inputPaso);
  pasoItem.appendChild(btnEliminar);

  lista.appendChild(pasoItem);

  actualizarNumeracionPasos();
}

function actualizarNumeracionIngredientes() {
  const ingredientes = document.querySelectorAll("#lista-ingredientes input[name='ingredientes[]']");
  ingredientes.forEach((input, index) => {
    input.placeholder = `Ingrediente ${index + 1}`;
  });
}

function actualizarNumeracionPasos() {
  const pasos = document.querySelectorAll("#lista-pasos input[name='pasos[]']");
  pasos.forEach((input, index) => {
    input.placeholder = `Paso ${index + 1}`;
  });
}

function mostrarPreviewPaso(input, previewImg) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

// OPCIONAL: resetear numeración después de guardar
function resetFormulario() {
  actualizarNumeracionIngredientes();
  actualizarNumeracionPasos();
}

/*--------------------------------MODAL PARA RECORTAR IMAGEN    --------------------------------- */
/* Modal para recortar la imagen */
let cropper;
function mostrarPreviewReceta(input, imgElement) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    // Mostrar modal de SweetAlert2 con Cropper
    Swal.fire({
      title: 'Recortar imagen',
      html: `
        <div style="width: 100%; max-height: 60vh; margin: 0 auto;">
          <img id="imagen-modal" src="${e.target.result}" style="max-width: 100%;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        // Inicializar Cropper en el modal
        const image = document.getElementById('imagen-modal');
        cropper = new Cropper(image, {
          aspectRatio: 1, // Forma circular
          viewMode: 1,
          autoCrop: true,
        });
      },
      preConfirm: () => {
        // Obtener imagen recortada al hacer clic en "Aplicar"
        const canvas = cropper.getCroppedCanvas({
          width: 300,
          height: 300,
          fillColor: '#fff', // Fondo blanco
        });
        return canvas.toDataURL('image/png'); // Retorna la imagen recortada
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar imagen recortada en el preview
        imgElement.src = result.value;
        imgElement.style.display = 'block';
        //imgElement.style.borderRadius = '50%';  Forma circular
        document.querySelector('.icono-placeholder').style.display = 'none';
      } else {
        // Si cancela, limpia el input
        input.value = '';
      }
    });
  };
  reader.readAsDataURL(file);
}

// Función para agregar un botón "Aplicar recorte"
function agregarBotonAplicar() {
  // Eliminar botón anterior si existe
  const botonAnterior = document.getElementById("boton-aplicar-recorte");
  if (botonAnterior) botonAnterior.remove();

  // Crear botón nuevo
  const boton = document.createElement("button");
  boton.id = "boton-aplicar-recorte";
  boton.textContent = "Aplicar recorte";
  boton.className = "btn-aplicar-recorte"; // Añade estilos en CSS
  boton.onclick = function () {
    // Obtener imagen recortada y actualizar el preview
    const canvas = cropper.getCroppedCanvas({
      width: 300,  // Tamaño final (ajústalo)
      height: 300,
      fillColor: "#fff", // Fondo blanco para bordes transparentes
    });
    document.getElementById("preview-imagen-receta").src = canvas.toDataURL("image/png");
    
    // Ocultar el botón después de aplicar
    boton.style.display = "none";
  };

  // Añadir botón al contenedor de la imagen
  document.querySelector(".imagen-receta").appendChild(boton);
}

function mostrarPreviewPaso(input, imgElement) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imgElement.src = e.target.result;
      imgElement.style.display = "block";
      const icono = imgElement.parentElement.querySelector('.icono-placeholder');
      if (icono) icono.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
}
