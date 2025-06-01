document.addEventListener("DOMContentLoaded", function () {
  // --- FUNCIONES PARA ABRIR Y CERRAR EL MODAL ---
  function abrirModalReceta() {
    const modal = document.getElementById("modal-receta");
    modal.classList.remove("oculto");
  }

  function cerrarModalReceta() {
    const modal = document.getElementById("modal-receta");
    modal.classList.add("oculto");
  }

  // --- FUNCIÓN PARA CARGAR DATOS EN EL MODAL ---
  function cargarModalReceta(receta) {
    document.getElementById("modal-titulo").textContent = receta.nombre_receta || "";
    document.getElementById("modal-descripcion").textContent = receta.descripcion || "";
    document.getElementById("modal-categoria").textContent = receta.categoria || "";
    document.getElementById("modal-tiempo").textContent = receta.tiempo_preparacion || "";
    document.getElementById("modal-dificultad").textContent = receta.dificultad || "";

    const imagen = document.getElementById("modal-imagen");
    imagen.src = receta.imagen || "";
    imagen.alt = receta.nombre_receta || "Imagen de receta";

    const estrellasContainer = document.getElementById("modal-estrellas");
    const puntuacion = parseInt(receta.calificacion) || 0;
    estrellasContainer.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const estrella = document.createElement("span");
      estrella.textContent = i <= puntuacion ? "★" : "☆";
      estrella.style.color = i <= puntuacion ? "#ffc107" : "#ccc";
      estrella.style.fontSize = "20px";
      estrellasContainer.appendChild(estrella);
    }

    const listaIngredientes = document.getElementById("modal-ingredientes");
    listaIngredientes.innerHTML = "";
    (receta.ingredientes || []).forEach(ing => {
      const li = document.createElement("li");
      li.textContent = ing;
      listaIngredientes.appendChild(li);
    });

    const listaPasos = document.getElementById("modal-pasos");
    listaPasos.innerHTML = "";
    (receta.pasos || []).forEach((paso, index) => {
      const li = document.createElement("li");
      li.classList.add("paso-item");

      const img = document.createElement("img");
      img.src = paso.imagen || "";
      img.alt = `Paso ${index + 1}`;
      img.classList.add("imagen-paso");

      const texto = document.createElement("div");
      texto.textContent = paso.descripcion || "";
      texto.classList.add("texto-paso");

      li.appendChild(img);
      li.appendChild(texto);

      listaPasos.appendChild(li);
    });
  }

  // --- ESCUCHAR CLIC EN CUALQUIER TARJETA DINÁMICAMENTE (delegación de eventos) ---
  document.addEventListener("click", function (e) {
    const tarjeta = e.target.closest(".tarjeta-receta");
    if (tarjeta && tarjeta.hasAttribute("data-receta")) {
      const receta = JSON.parse(tarjeta.getAttribute("data-receta"));
      cargarModalReceta(receta);
      abrirModalReceta();
    }
  });

});

/* Función para cerrar el modal */
function cerrarModal() {
  const modal = document.getElementById('modal-receta');
  if (modal) {
    modal.classList.add('oculto');
    document.body.style.overflow = 'auto';

    console.log('Modal cerrado');
  }
}

 // Cierre con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarModal();
    }
  });

  // Delegación de eventos para botón cerrar (funciona aunque se cargue después)
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'cerrar-modal') {
      cerrarModal();
    }
  });