// =========================
// VARIABLES GLOBALES
// =========================
let contadorIngredientes = 2;
let contadorPasos = 2;

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
  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control input-border";
  input.placeholder = `Ingrediente ${contadorIngredientes++}`;
  lista.appendChild(input);
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
  inputPaso.className = "form-control input-border paso-input";
  inputPaso.placeholder = `Paso ${contadorPasos++}`;

  pasoItem.appendChild(pasoImagen);
  pasoItem.appendChild(inputPaso);

  lista.appendChild(pasoItem);
}

function mostrarPreviewReceta(input, imgElement) {
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

// =========================
// EVENTOS AL CARGAR
// =========================
document.addEventListener('DOMContentLoaded', () => {
    const inputFile = document.getElementById('input-imagen-receta');
    const imgPreview = document.getElementById('preview-imagen-receta');
  
    if (inputFile && imgPreview) {
      inputFile.addEventListener('change', function () {
        mostrarPreviewReceta(this, imgPreview);
      });
    }
  
    const checkFirebase = setInterval(() => {
      if (firebase.apps.length && window.db) {
        clearInterval(checkFirebase);
       // initFormularioReceta();
      }
    }, 100);
  });