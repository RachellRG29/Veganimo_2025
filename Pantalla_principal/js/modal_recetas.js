document.addEventListener("DOMContentLoaded", function () {
  // --- FUNCIONES PARA ABRIR Y CERRAR EL MODAL ---
  function abrirModalReceta() {
    const modal = document.getElementById("modal-receta");
    modal.classList.remove("oculto");
    document.body.style.overflow = "hidden";
  }

  function cerrarModalReceta() {
    const modal = document.getElementById("modal-receta");
    modal.classList.add("oculto");
    document.body.style.overflow = "auto";
  }

  // --- DICCIONARIO DE CATEGORÍAS ---
  const categorias = {
    cat_vegan: "Vegano",
    cat_veget: "Vegetariano",
    cat_transc: "Transicionista",
  };

  // --- FUNCIÓN PARA RENDERIZAR ESTRELLAS SVG ---
  function renderizarEstrellas(calificacion) {
    const estrellasContainer = document.getElementById("modal-estrellas");
    estrellasContainer.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
      const filled = i <= calificacion;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "22");
      svg.setAttribute("height", "22");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("style", `
        margin: 0 2px;
        fill: ${filled ? '#ffc73a' : 'transparent'};
        stroke: ${filled ? '#ffc73a' : '#ccc'};
        stroke-width: 2px;
        stroke-linejoin: round;
        transform: rotate(45deg);
      `);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z");

      svg.appendChild(path);
      estrellasContainer.appendChild(svg);
    }
  }

  // --- FUNCIÓN PARA CARGAR DATOS EN EL MODAL ---
  function cargarModalReceta(receta) {
    document.getElementById("modal-titulo").textContent = receta.nombre_receta || "";
    document.getElementById("modal-descripcion").textContent = receta.descripcion || "";

    const catTexto = categorias[receta.categoria] || receta.categoria || "Sin categoría";
    document.getElementById("modal-categoria").textContent = catTexto;

    const tiempo = receta.tiempo_preparacion || "";
    let numero = tiempo.replace(/[^\d]/g, '');
    let unidad = "";
    if (tiempo.toLowerCase().includes("hora")) unidad = "hora(s)";
    else if (tiempo.toLowerCase().includes("minuto")) unidad = "minuto(s)";
    else unidad = "";

    document.getElementById("modal-tiempo").textContent = numero || tiempo;
    document.getElementById("modal-tiempo-unidad").textContent = unidad;

    document.getElementById("modal-dificultad").textContent = receta.dificultad || "";

    const imagen = document.getElementById("modal-imagen");
    imagen.src = receta.imagen || "";
    imagen.alt = receta.nombre_receta || "Imagen de receta";

    renderizarEstrellas(parseInt(receta.calificacion) || 0);

    const listaIngredientes = document.getElementById("modal-ingredientes");
    listaIngredientes.innerHTML = "";
    (receta.ingredientes || []).forEach(ing => {
      const li = document.createElement("li");
      li.textContent = ing;
      listaIngredientes.appendChild(li);
    });

    const olPasos = document.getElementById('modal-pasos');
    olPasos.innerHTML = '';
    if (Array.isArray(receta.pasos)) {
      receta.pasos.forEach((paso, index) => {
        const divPaso = document.createElement('div');
        divPaso.classList.add('modal-paso');

        const imgPaso = document.createElement('img');
        imgPaso.src = paso.imagen || "";
        imgPaso.alt = `Paso ${index + 1}`;
        divPaso.appendChild(imgPaso);

        const textoPaso = document.createElement('div');
        textoPaso.innerHTML = `<h4>Paso ${index + 1}</h4><p>${paso.texto || paso.descripcion || ""}</p>`;
        divPaso.appendChild(textoPaso);

        olPasos.appendChild(divPaso);
      });
    }

    const dificultad = receta.dificultad?.toLowerCase() || "";
    const icono = document.getElementById("icono-dificultad");
    icono.classList.remove("dif-alta", "dif-media", "dif-baja");
    if (dificultad.includes("alta")) {
      icono.classList.add("dif-alta");
    } else if (dificultad.includes("media")) {
      icono.classList.add("dif-media");
    } else if (dificultad.includes("baja")) {
      icono.classList.add("dif-baja");
    }
  }

  // Delegación de eventos para detectar clics en las tarjetas
  document.addEventListener("click", function (e) {
    // Verificar si el clic fue en elementos del popup de perfil
    const esClickEnPerfil = e.target.closest('.tarjeta-perfil') || 
                          e.target.closest('.tarjeta_menu') || 
                          e.target.closest('#tarj_perfil_user') ||
                          e.target.closest('#menu_popup');
    
    // Si es un clic en el perfil o su popup, no hacer nada
    if (esClickEnPerfil) {
      return;
    }
    
    // Solo procesar clics en tarjetas de receta
    const tarjeta = e.target.closest(".tarjeta-receta");
    if (tarjeta && tarjeta.hasAttribute("data-receta")) {
      const receta = JSON.parse(tarjeta.getAttribute("data-receta"));
      cargarModalReceta(receta);
      abrirModalReceta();
    }
  }, false); // Usamos bubble phase para dar prioridad al popup
});

// Función global para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById('modal-receta');
  if (modal) {
    modal.classList.add('oculto');
    document.body.style.overflow = 'auto';
  }
}

// Cerrar con tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarModal();
  }
});

// Botón de cerrar
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'cerrar-modal') {
    cerrarModal();
  }
});

// CSS dinámico
/*
const style_modal_receta = document.createElement('style');
style_modal_receta.textContent = `

`;
document.head.appendChild(style_modal_receta);
*/