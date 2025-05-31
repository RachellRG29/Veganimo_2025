async function cargarRecetas() {
  const contenedor = document.getElementById('contenedor-recetas');
  if (!contenedor) {
    console.error('❌ No se encontró el contenedor de recetas (#contenedor-recetas).');
    return;
  }

  fetch('../Pantalla_principal/obtener_recetas.php')
    .then(response => response.json())
    .then(data => {
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

        tarjeta.innerHTML = `
          <div class="circulo-img">
            <img src="${receta.imagen}" alt="Imagen del plato" class="img-plato">
          </div>
          <div class="body-tarjeta">
            <h2 class="title-tarjeta">${receta.nombre_receta}</h2>
            <p class="descripcion-tarjeta">${receta.descripcion}</p>
            <div class="estrellas_vot">
              ${'<i class="ph ph-star" style="font-size: 24px;"></i>'.repeat(5)}
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
    })
    .catch(error => {
      console.error('❌ Error de red:', error);
      contenedor.innerHTML = '<p>Error al conectar con el servidor.</p>';
    });
}
