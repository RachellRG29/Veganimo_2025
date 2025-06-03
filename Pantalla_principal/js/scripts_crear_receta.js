//ESTE ARCHIVO TIENE CONFLICTO PARA GUARDAR LAS RECETAS POR LO TANTO FIJENSE AHI

// validaciones
document.getElementById("form-receta").addEventListener("submit", function (e) {
  let valid = true;
  const nombre = document.getElementById("name-receta");
  const descripcion = document.getElementById("description-receta");
  const tiempo = document.getElementById("time-receta");
  const dificultad = document.getElementById("select-dificultad");
  const imagen = document.getElementById("input-imagen-receta");
  const ingredientes = document.getElementsByName("ingredientes[]");
  const pasos = document.getElementsByName("pasos[]");

  // Expresiones regulares
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const regexDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,]+$/;
  const regexTiempo = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/;
  const regexGeneral = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,]+$/;

  // Validación nombre
  if (!nombre.value.trim()) {
    alert("Falta el nombre de la receta.");
    nombre.focus();
    nombre.style.border = "2px solid red";
    valid = false;
  } else if (!regexNombre.test(nombre.value.trim())) {
    alert("El nombre solo puede contener letras y espacios.");
    nombre.focus();
    nombre.style.border = "2px solid red";
    valid = false;
  } else {
    nombre.style.border = "";
  }

  // Validación descripción
  if (!descripcion.value.trim()) {
    alert("Falta la descripción de la receta.");
    descripcion.focus();
    descripcion.style.border = "2px solid red";
    valid = false;
  } else if (!regexDescripcion.test(descripcion.value.trim())) {
    alert("La descripción solo puede contener letras, números, tildes, espacios y puntos.");
    descripcion.focus();
    descripcion.style.border = "2px solid red";
    valid = false;
  } else {
    descripcion.style.border = "";
  }

  // Validación tiempo
  if (!tiempo.value.trim()) {
    alert("Falta el tiempo de preparación.");
    tiempo.focus();
    tiempo.style.border = "2px solid red";
    valid = false;
  } else if (!regexTiempo.test(tiempo.value.trim())) {
    alert("El tiempo solo puede contener letras, números, tildes y espacios.");
    tiempo.focus();
    tiempo.style.border = "2px solid red";
    valid = false;
  } else {
    tiempo.style.border = "";
  }

  // Validación dificultad
  if (!dificultad.value) {
    alert("Debe seleccionar una dificultad.");
    dificultad.focus();
    dificultad.style.border = "2px solid red";
    valid = false;
  } else {
    dificultad.style.border = "";
  }

  // Validación imagen
  if (!imagen.value) {
    alert("Debe seleccionar una imagen para la receta.");
    imagen.focus();
    valid = false;
  }

  // Validación ingredientes
  for (let i = 0; i < ingredientes.length; i++) {
    const ing = ingredientes[i];
    if (!ing.value.trim()) {
      alert(`Falta el ingrediente ${i + 1}.`);
      ing.focus();
      ing.style.border = "2px solid red";
      valid = false;
      break;
    } else if (!regexGeneral.test(ing.value.trim())) {
      alert(`Ingrediente ${i + 1} no válido. Solo letras, números, tildes y puntos.`);
      ing.focus();
      ing.style.border = "2px solid red";
      valid = false;
      break;
    } else {
      ing.style.border = "";
    }
  }

  // Validación pasos
  for (let i = 0; i < pasos.length; i++) {
    const paso = pasos[i];
    if (!paso.value.trim()) {
      alert(`Falta el paso ${i + 1}.`);
      paso.focus();
      paso.style.border = "2px solid red";
      valid = false;
      break;
    } else if (!regexGeneral.test(paso.value.trim())) {
      alert(`Paso ${i + 1} no válido. Solo letras, números, tildes y puntos.`);
      paso.focus();
      paso.style.border = "2px solid red";
      valid = false;
      break;
    } else {
      paso.style.border = "";
    }
  }

  if (!valid) {
    e.preventDefault();
  }
});