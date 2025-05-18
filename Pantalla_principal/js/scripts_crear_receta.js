/*NO SE OCUPA */

let contadorIngredientes = 2; //empieza en 2 por q ya hay ingrediente 1
let contadorPasos = 2; // Empieza en 2 porque ya hay paso 1 

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
  input.name = "ingredientes[]";
  input.className = "form-control input-border";
  input.placeholder = `Ingrediente ${contadorIngredientes++}`;
  lista.appendChild(input);
}

function agregarPaso() {
  const lista = document.getElementById("lista-pasos");

  const pasoItem = document.createElement("div");
  pasoItem.className = "paso-item";

  // Crear contenedor de imagen para paso
  const pasoImagen = document.createElement("div");
  pasoImagen.className = "paso-imagen-small";
  pasoImagen.onclick = function() {
    inputFilePaso.click();
  };

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
  inputFilePaso.name = "imagen-paso[]";  // Asegúrate de añadir el 'name' para que se guarde correctamente

  inputFilePaso.onchange = function() {
    mostrarPreviewPaso(this, imgPreview);
  };

  pasoImagen.appendChild(icono);
  pasoImagen.appendChild(imgPreview);
  pasoImagen.appendChild(inputFilePaso);

  const inputPaso = document.createElement("input");
  inputPaso.type = "text";
  inputPaso.name = "pasos[]";
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
    reader.onload = function(e) {
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
    reader.onload = function(e) {
      imgElement.src = e.target.result;
      imgElement.style.display = "block";
      const icono = imgElement.parentElement.querySelector('.icono-placeholder');
      if (icono) icono.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
}

window.addEventListener('DOMContentLoaded', function() {
  const imgContainer = document.getElementById('img-container-receta');
  const inputFile = document.getElementById('input-imagen-receta');
  const imgPreview = document.getElementById('preview-imagen-receta');
  const icono = imgContainer.querySelector('.icono-placeholder');

  imgContainer.addEventListener('click', function() {
    inputFile.click();  // Abre el selector de archivos
  });

  inputFile.addEventListener('change', function() {
    const file = inputFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imgPreview.src = e.target.result;
        imgPreview.style.display = 'block';
        if (icono) icono.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });
});