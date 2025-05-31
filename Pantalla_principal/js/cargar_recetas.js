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
          unidad = 'minutos'; // por si acaso
        }

        tarjeta.innerHTML = `
          <div class="circulo-img">
            <img src="${receta.imagen}" alt="Imagen del plato" class="img-plato">
          </div>
          <div class="body-tarjeta">
            <h2 class="title-tarjeta">${receta.nombre_receta}</h2>
            <p class="descripcion-tarjeta">${receta.descripcion}</p>
            <p class="categoria-tarjeta" 
            style=" color: #F6FFFE; 
            font-weight: bold; 
            text-align: center;
            background-color: #154734;
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;">
            Categoría: ${categorias[receta.categoria] || 'Sin categoría'}</p>

            <div class="estrellas_vot">
              ${'<i class="ph ph-star" style="font-size: 24px;"></i>'.repeat(5)}
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
                  <i class="ph ph-square-fill" style="font-size: 24px; color: ${colorDificultad};background-color: white; border: 1px; border-radius: 3px;"></i>
                  <p class="lbl_dificultad">${receta.dificultad}</p>
                </div>
              </div>
            </div>
          </div>
        `;

        contenedor.appendChild(tarjeta);
      });

      // 🔁 Ejecutar filtrado después de cargar las tarjetas
      if (typeof initializeRecipeSearch === 'function') {
        initializeRecipeSearch();
      }

    })
    .catch(error => {
      console.error('❌ Error de red:', error);
      contenedor.innerHTML = '<p>Error al conectar con el servidor.</p>';
    });
}
