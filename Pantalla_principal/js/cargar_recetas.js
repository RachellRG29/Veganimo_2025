/* Estilos para la carga de recetas */
async function cargarRecetas() {
  const contenedor = document.getElementById('contenedor-recetas');
  if (!contenedor) {
    console.error('❌ No se encontró el contenedor de recetas (#contenedor-recetas).');
    return;
  }

  const categorias = {
    cat_vegan: "Vegano",
    cat_veget: "Vegetariano",
    cat_transc: "Transicionista"
  };

  /* Función para renderizar las estrellas de la calificación */
  function renderEstrellas(calificacion) {
    const totalEstrellas = 5;
    const estrellasLlenas = Math.round(calificacion);
    let estrellasHTML = '';

    for (let i = 1; i <= totalEstrellas; i++) {
      const filled = i <= estrellasLlenas;

      estrellasHTML += `
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="28" height="28"
            style="
              margin: 0 4px;
              fill: ${filled ? '#ffc73a' : 'transparent'};
              stroke: ${filled ? '#ffc73a' : '#ccc'};
              stroke-width: 2px;
              stroke-linejoin: round;
              transform: rotate(45deg);
              display: inline-block;
            ">
          <path d="M12,17.27L18.18,21L16.54,13.97
                  L22,9.24L14.81,8.62L12,2L9.19,8.62
                  L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
        </svg>`;
    }

    return `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        margin-top: 8px;
      ">
        ${estrellasHTML}
      </div>`;
  }

  /* Acortar la descripción */
  function recortarDescripcion(texto, limitePalabras = 20) {
    const palabras = texto.trim().split(/\s+/);
    if (palabras.length <= limitePalabras) return texto;
    return palabras.slice(0, limitePalabras).join(" ") + "...";
  }

  try {
    const response = await fetch('../Pantalla_principal/obtener_recetas.php');
    const data = await response.json();

    if (!data.success || !Array.isArray(data.data)) {
      contenedor.innerHTML = '<p>Error al cargar recetas.</p>';
      return;
    }

    const recetas = data.data;
    if (recetas.length === 0) {
      contenedor.innerHTML = '<p>No hay recetas disponibles.</p>';
      return;
    }

    contenedor.innerHTML = ''; // Limpiar antes de renderizar

    recetas.forEach(receta => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'tarjeta-receta';

      // Detectar color de dificultad
      let colorDificultad = '#22B55B';
      if (receta.dificultad === 'Media') colorDificultad = 'orange';
      else if (receta.dificultad === 'Alta') colorDificultad = 'red';

      // Agregar unidad de tiempo
      const tiempoPrep = receta.tiempo_preparacion;
      let unidad = 'minutos';
      if (tiempoPrep.toLowerCase().includes('hora')) {
        unidad = '';
      } else if (parseInt(tiempoPrep) >= 60) {
        unidad = 'minutos';
      }

      // Detectar el tipo de receta (Desayuno, Almuerzo, Cena)
      let claseTipo = '';
      switch (receta.tipo_receta?.toLowerCase()) {
        case 'desayuno':
          claseTipo = 'etiqueta-desayuno';
          break;
        case 'almuerzo':
          claseTipo = 'etiqueta-almuerzo';
          break;
        case 'cena':
          claseTipo = 'etiqueta-cena';
          break;
        default:
          claseTipo = 'etiqueta-default';
      }

      tarjeta.innerHTML = `
        <div class="circulo-img">
          <img src="${receta.imagen}" alt="Imagen del plato" class="img-plato">
        </div>
        <div class="body-tarjeta">
          <h2 class="title-tarjeta">${receta.nombre_receta}</h2>
          <p class="descripcion-tarjeta">${recortarDescripcion(receta.descripcion)}</p>
          <p class="categoria-tarjeta" 
            style="color: #F6FFFE; font-weight: bold; text-align: center;
            background-color: #154734; display: inline-block;
            padding: 6px 12px; border-radius: 20px;">
            Categoría: ${categorias[receta.categoria] || 'Sin categoría'}
          </p>

          <div class="rating-estatica">
            ${renderEstrellas(receta.calificacion)}
          </div>

          <div class="datos-receta">
            <div class="tiempo-receta">
              <p style="font-weight: bold;">Tiempo de preparación</p>
              <div class="grupo_tiempo">
                <i class="ph ph-timer" style="font-size: 24px;"></i>
                <p class="lbl_tiempo_receta">${tiempoPrep} ${unidad}</p>
              </div>
            </div>

            <div class="linea-datos"></div>

            <div class="dificultad-receta">
              <p style="font-weight: bold;">Dificultad</p>
              <div class="grupo_dif">
                <i class="ph ph-square-fill" 
                  style="font-size: 24px; color: ${colorDificultad};
                  background-color: white; border: 1px; border-radius: 3px;"></i>
                <p class="lbl_dificultad">${receta.dificultad}</p>
              </div>
            </div>
          </div>

          <span class="etiqueta-tipo ${claseTipo}">
            ${receta.tipo_receta || 'Sin tipo'}
          </span>
        </div>
      `;

      tarjeta.setAttribute('data-receta', JSON.stringify(receta));
      contenedor.appendChild(tarjeta);
    });

    if (typeof initializeRecipeSearch === 'function') {
      initializeRecipeSearch();
    }

  } catch (error) {
    console.error('❌ Error de red:', error);
    contenedor.innerHTML = '<p>Error al conectar con el servidor.</p>';
  }

  // Estilo básico adicional
  const style_carg = document.createElement('style');
  style_carg.textContent = `
    .tarjeta-receta { cursor: pointer; }

    .etiqueta-tipo {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 0.9rem;
      border: 2px dashed #ccc;
      margin-top: 10px;
    }

    .etiqueta-desayuno {
      background-color: #ffecb3;
      border-color: #f7c948;
      color: #a67c00;
    }

    .etiqueta-almuerzo {
      background-color: #c8f7c5;
      border-color: #7ed957;
      color: #256d1b;
    }

    .etiqueta-cena {
      background-color: #b3e5fc;
      border-color: #4fc3f7;
      color: #01579b;
    }

    .etiqueta-default {
      background-color: #e0e0e0;
      border-color: #bdbdbd;
      color: #424242;
    }
  `;
  document.head.appendChild(style_carg);
}

/* Ejecutar al cargar la página */
document.addEventListener('DOMContentLoaded', () => {
  cargarRecetas();
});

