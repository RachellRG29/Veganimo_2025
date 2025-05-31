document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedor-recetas');
  const inputBusqueda = document.querySelector('.input_busqueda');
  const selectCategoria = document.getElementById('categoria-recetas');

   if (!contenedor) {
    console.error('❌ No se encontró el contenedor de recetas (#contenedor-recetas).');
    return;
  }

  let recetasOriginales = [];

  function renderizarRecetas(filtradas) {
    contenedor.innerHTML = '';

    if (filtradas.length === 0) {
      contenedor.innerHTML = '<p>No se encontraron recetas.</p>';
      return;
    }

    filtradas.forEach(receta => {
      const tarjeta = document.createElement('div');
      tarjeta.classList.add('tarjeta-receta');
      tarjeta.innerHTML = `
        <div class="circulo-img">
          <img src="${receta.imagen}" alt="Imagen del plato" class="img-plato">
        </div>
        <div class="body-tarjeta">
          <h2 class="title-tarjeta">${receta.nombre_receta}</h2>
          <p class="descripcion-tarjeta">${receta.descripcion}</p>
          <div class="estrellas_vot">
            <i class="ph ph-star" style="font-size: 24px;"></i>
            <i class="ph ph-star" style="font-size: 24px;"></i>
            <i class="ph ph-star" style="font-size: 24px;"></i>
            <i class="ph ph-star" style="font-size: 24px;"></i>
            <i class="ph ph-star" style="font-size: 24px;"></i>
          </div>
          <div class="datos-receta">
            <div class="tiempo-receta">
              <p>Tiempo de preparación</p>
              <div class="grupo_tiempo">
                <i class="ph ph-timer" style="font-size: 24px;"></i>
                <p class="lbl_tiempo_receta">${receta.tiempo_preparacion}</p>
              </div>
            </div>
            <div class="linea-datos"></div>
            <div class="dificultad-receta">
              <p>Dificultad</p>
              <div class="grupo_dif">
                <i class="ph ph-square-fill" style="font-size: 24px;"></i>
                <p class="lbl_dificultad">${receta.dificultad}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      contenedor.appendChild(tarjeta);
    });
  }

  function aplicarFiltros() {
    const texto = inputBusqueda.value.toLowerCase();
    const categoria = selectCategoria.value;

    const filtradas = recetasOriginales.filter(r => {
      const coincideTexto = r.nombre_receta.toLowerCase().includes(texto);
      const coincideCategoria = categoria ? r.dificultad.toLowerCase() === categoria : true;
      return coincideTexto && coincideCategoria;
    });

    renderizarRecetas(filtradas);
  }

  fetch('../Pantalla_principal/obtener_recetas.php')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        recetasOriginales = data.data;
        renderizarRecetas(recetasOriginales);
      } else {
        contenedor.innerHTML = '<p>Error al cargar recetas.</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      contenedor.innerHTML = '<p>Error de red al cargar recetas.</p>';
    });

  
});
