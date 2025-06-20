let datosUsuario = {};

  fetch('cargar_perfil.php')
    .then(res => res.json())
    .then(data => {
      datosUsuario = data.datos;
      renderTarjetas();
    })
    .catch(err => {
      console.error('Error al cargar perfil:', err);
      alert('Hubo un error al cargar el perfil.');
    });

  function renderTarjetas() {
    const d = datosUsuario;
    const container = document.getElementById('contenedor-tarjetas');

    container.innerHTML = `
      <div class="card">
        <h3>Datos generales</h3>
        <p><strong>Nombre:</strong> ${d.nombre_completo}</p>
        <p><strong>Fecha de nacimiento:</strong> ${d.fecha_nacimiento}</p>
        <p><strong>Género:</strong> ${d.genero}</p>
      </div>

      <div class="card">
        <h3>Datos nutricionales</h3>
        <p><strong>Dieta:</strong> ${d.dieta_actual}</p>
        <p><strong>Peso:</strong> ${d.peso} kg</p>
        <p><strong>Altura:</strong> ${d.altura} cm</p>
        <button class="ver-mas" onclick="mostrarModal('nutricionales')">Ver más</button>
      </div>

      <div class="card">
        <h3>Historia clínica</h3>
        <p>${previewLista([...(d.patologicos || []), ...(d.familiares || []), ...(d.quirurgicos || [])])}</p>
        <button class="ver-mas" onclick="mostrarModal('clinica')">Ver más</button>
      </div>

      <div class="card">
        <h3>Afecciones personales</h3>
        <p>${previewLista([...(d.intolerancias || []), ...(d.alergias || [])])}</p>
        <button class="ver-mas" onclick="mostrarModal('afecciones')">Ver más</button>
      </div>

      <div class="card">
        <h3>Síntomas gastrointestinales</h3>
        <p>${previewLista(d.sintomas || [])}</p>
        <button class="ver-mas" onclick="mostrarModal('sintomas')">Ver más</button>
      </div>

      <div class="card">
  <h3>Resumen completo</h3>
  <p>Visualiza todos los datos del perfil en una sola vista.</p>
  <button class="ver-mas" onclick="mostrarModal('completo')">Ver todo</button>
</div>

    `;
  }

  function previewLista(lista) {
    if (!lista || lista.length === 0) return 'Sin datos registrados.';
    return lista.slice(0, 2).join(', ') + (lista.length > 2 ? '...' : '');
  }

function mostrarModal(tipo) {
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const modal = document.getElementById('modal');
  body.innerHTML = '';

  const d = datosUsuario;

  const titulos = {
    generales: 'Datos generales',
    nutricionales: 'Datos nutricionales',
    clinica: 'Historia clínica',
    afecciones: 'Afecciones personales',
    sintomas: 'Síntomas gastrointestinales',
    completo: 'Resumen completo del perfil'
  };

  title.textContent = titulos[tipo] || 'Detalle';

  if (tipo === 'generales') {
    body.innerHTML = `
      <p><strong>Nombre:</strong> ${d.nombre_completo}</p>
      <p><strong>Fecha de nacimiento:</strong> ${d.fecha_nacimiento}</p>
      <p><strong>Género:</strong> ${d.genero}</p>
    `;
  } else if (tipo === 'nutricionales') {
    body.innerHTML = `
      <p><strong>Dieta actual:</strong> ${d.dieta_actual}</p>
      <p><strong>Peso:</strong> ${d.peso} kg</p>
      <p><strong>Altura:</strong> ${d.altura} cm</p>
      <p><strong>Objetivo:</strong> ${d.objetivo}</p>
      <p><strong>Meta:</strong> ${d.nivel_meta}</p>
      <p><strong>Descripción:</strong> ${d.descripcion_dieta || 'N/A'}</p>
    `;
  } else if (tipo === 'clinica') {
    const lista = [...(d.patologicos || []), ...(d.familiares || []), ...(d.quirurgicos || [])];
    mostrarLista(body, lista);
  } else if (tipo === 'afecciones') {
    const lista = [...(d.intolerancias || []), ...(d.alergias || [])];
    mostrarLista(body, lista);
  } else if (tipo === 'sintomas') {
    mostrarLista(body, d.sintomas || []);
  } else if (tipo === 'completo') {
    body.innerHTML = `
      <h4>Datos generales</h4>
      <p><strong>Nombre:</strong> ${d.nombre_completo}</p>
      <p><strong>Fecha de nacimiento:</strong> ${d.fecha_nacimiento}</p>
      <p><strong>Género:</strong> ${d.genero}</p>

      <h4>Datos nutricionales</h4>
      <p><strong>Dieta:</strong> ${d.dieta_actual}</p>
      <p><strong>Peso:</strong> ${d.peso} kg</p>
      <p><strong>Altura:</strong> ${d.altura} cm</p>
      <p><strong>Objetivo:</strong> ${d.objetivo}</p>
      <p><strong>Meta:</strong> ${d.nivel_meta}</p>
      <p><strong>Descripción:</strong> ${d.descripcion_dieta || 'N/A'}</p>

      <h4>Historia clínica</h4>
      ${crearListaHTML([...(d.patologicos || []), ...(d.familiares || []), ...(d.quirurgicos || [])])}

      <h4>Afecciones personales</h4>
      ${crearListaHTML([...(d.intolerancias || []), ...(d.alergias || [])])}

      <h4>Síntomas gastrointestinales</h4>
      ${crearListaHTML(d.sintomas || [])}
    `;
  }


// Mostrar modal con animación
modal.style.display = 'flex';
const modalContent = modal.querySelector('.modal-content');
modalContent.classList.toggle('resumen-completo', tipo === 'completo');
requestAnimationFrame(() => {
  modal.classList.add('show');
});

    

    // Mostrar modal con animación
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });
  }

  function mostrarLista(container, lista) {
    if (!lista || lista.length === 0) {
      container.innerHTML = '<p>Sin información.</p>';
      return;
    }
    const ul = document.createElement('ul');
    lista.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function cerrarModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300); // Esperar que termine la animación
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
  });

  window.addEventListener('click', e => {
    if (e.target === document.getElementById('modal')) cerrarModal();
  });

  function crearListaHTML(lista) {
  if (!lista || lista.length === 0) return '<p>Sin información.</p>';
  return `<ul>${lista.map(item => `<li>${item}</li>`).join('')}</ul>`;
}


  // Cerrar con la X
  document.querySelector('.close').addEventListener('click', cerrarModal);