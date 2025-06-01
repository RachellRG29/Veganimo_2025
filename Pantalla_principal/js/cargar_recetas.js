// Función para renderizar estrellas de calificación
function renderEstrellas(calificacion, tamaño = 24) {
  const estrellasContainer = document.createElement('div');
  estrellasContainer.className = 'estrellas-container';
  estrellasContainer.style.display = 'flex';
  estrellasContainer.style.gap = '4px';
  estrellasContainer.style.margin = '8px 0';
  
  const calificacionNum = parseFloat(calificacion) || 0;
  const estrellasLlenas = Math.floor(calificacionNum);
  const tieneMediaEstrella = calificacionNum - estrellasLlenas >= 0.5;

  for (let i = 1; i <= 5; i++) {
    const estrella = document.createElement('i');
    
    if (i <= estrellasLlenas) {
      estrella.className = 'ph ph-star-fill';
      estrella.style.color = '#FFD700'; // Dorado para estrellas llenas
    } else if (i === estrellasLlenas + 1 && tieneMediaEstrella) {
      estrella.className = 'ph ph-star-half';
      estrella.style.color = '#FFD700'; // Dorado para media estrella
    } else {
      estrella.className = 'ph ph-star';
      estrella.style.color = '#C0C0C0'; // Plata para estrellas vacías
    }
    
    estrella.style.fontSize = `${tamaño}px`;
    estrellasContainer.appendChild(estrella);
  }

  return estrellasContainer;
}

// Función principal para cargar recetas
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

    contenedor.innerHTML = ''; // Limpiar contenedor

    recetas.forEach(receta => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'tarjeta-receta';
      tarjeta.style.cursor = 'pointer';

      let colorDificultad = '#22B55B';
      if (receta.dificultad === 'Media') colorDificultad = 'orange';
      else if (receta.dificultad === 'Alta') colorDificultad = 'red';

      const tiempoPrep = receta.tiempo_preparacion;
      let unidad = 'minutos';
      if (tiempoPrep.toLowerCase().includes('hora')) unidad = '';

      const estrellasTarjeta = renderEstrellas(receta.calificacion, 20);

      tarjeta.innerHTML = `
        <div class="circulo-img">
          <img src="${receta.imagen}" alt="Imagen del plato" class="img-plato">
        </div>
        <div class="body-tarjeta">
          <h2 class="title-tarjeta">${receta.nombre_receta}</h2>
          <p class="descripcion-tarjeta">${receta.descripcion}</p>
          <p class="categoria-tarjeta" 
            style="color:#F6FFFE; font-weight:bold; text-align:center; background-color:#154734; display:inline-block; padding:6px 12px; border-radius:20px;">
            Categoría: ${categorias[receta.categoria] || 'Sin categoría'}</p>
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
                <i class="ph ph-square-fill" style="font-size: 24px; color: ${colorDificultad}; background-color: white; border-radius: 3px;"></i>
                <p class="lbl_dificultad">${receta.dificultad}</p>
              </div>
            </div>
          </div>
        </div>
      `;

      const categoriaElement = tarjeta.querySelector('.categoria-tarjeta');
      categoriaElement.insertAdjacentElement('afterend', estrellasTarjeta);

      contenedor.appendChild(tarjeta);

      tarjeta.addEventListener('click', () => mostrarModalReceta(receta, categorias));
    });

  } catch (error) {
    console.error('❌ Error de red:', error);
    contenedor.innerHTML = '<p>Error al conectar con el servidor.</p>';
  }
}

// Función para mostrar el modal con los datos de la receta
function mostrarModalReceta(receta, categorias) {
  const modal = document.getElementById('modal-receta');
  if (!modal) return;

  document.getElementById('modal-titulo').textContent = receta.nombre_receta;
  document.getElementById('modal-imagen').src = receta.imagen;
  document.getElementById('modal-descripcion').textContent = receta.descripcion;
  document.getElementById('modal-tiempo').textContent = receta.tiempo_preparacion;
  document.getElementById('modal-dificultad').textContent = receta.dificultad;
  document.getElementById('modal-categoria').textContent = categorias[receta.categoria] || 'Sin categoría';

  const estrellasContainer = document.getElementById('modal-estrellas');
  estrellasContainer.innerHTML = '';
  const estrellasModal = renderEstrellas(receta.calificacion, 28);
  estrellasContainer.appendChild(estrellasModal);

  const ulIng = document.getElementById('modal-ingredientes');
  ulIng.innerHTML = '';
  if (Array.isArray(receta.ingredientes)) {
    receta.ingredientes.forEach(ing => {
      const li = document.createElement('li');
      li.textContent = ing;
      ulIng.appendChild(li);
    });
  }

  const olPasos = document.getElementById('modal-pasos');
  olPasos.innerHTML = '';
  if (Array.isArray(receta.pasos)) {
    receta.pasos.forEach(paso => {
      const li = document.createElement('li');
      const textoPaso = document.createElement('p');
      textoPaso.textContent = paso.texto;
      li.appendChild(textoPaso);

      if (paso.imagen) {
        const imagenPaso = document.createElement('img');
        imagenPaso.src = paso.imagen;
        imagenPaso.alt = "Imagen del paso";
        imagenPaso.style.maxWidth = '100%';
        imagenPaso.style.borderRadius = '8px';
        imagenPaso.style.marginTop = '8px';
        li.appendChild(imagenPaso);
      }

      olPasos.appendChild(li);
    });
  }

  modal.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById('modal-receta');
  if (modal) {
    modal.classList.add('oculto');
    document.body.style.overflow = 'auto';
  }
}

// Configurar eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  cargarRecetas();

  const cerrarModalBtn = document.getElementById('cerrar-modal');
  if (cerrarModalBtn) {
    cerrarModalBtn.addEventListener('click', cerrarModal);
  }

  const modal = document.getElementById('modal-receta');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarModal();
    }
  });
});