let datosUsuario = {};
let perfilNutricional = {};

fetch('cargar_datos_usuario.php')
  .then(res => res.json())
  .then(data => {
    if (!data.success) {
      console.error(data.message);
      return;
    }

    datosUsuario = data.usuario;
    perfilNutricional = data.perfil;

    renderDatosPersonales();
    renderPerfilNutricional();

    document.getElementById('user-level').textContent = data.nivel || "No definido";
  })
  .catch(err => {
    console.error('Error al cargar datos:', err);
  });

/* -------- DATOS PERSONALES -------- */
function renderDatosPersonales() {
  const d = datosUsuario;
  document.getElementById('user-name').textContent = d.nombre_completo || "Nombre";
  document.getElementById('user-email').textContent = d.email || "Email";
  document.getElementById('user-birthdate').textContent = d.fecha_nacimiento || "Fecha nacimiento";
  document.getElementById('user-gender').textContent = d.genero || "Género";
}

/* -------- PERFIL NUTRICIONAL -------- */
function renderPerfilNutricional() {
  const d = perfilNutricional;
  const container = document.getElementById('nutritional-content');

  if (!d) {
    container.innerHTML = `
      <div class="profile-content">
        <h3 class="profile-subtitle">🌱 Crea tu Perfil Nutricional</h3>
        <p class="profile-description">
          Personaliza tu experiencia vegana creando tu perfil nutricional.<br><br>
          Aquí podrás registrar tus objetivos, preferencias y necesidades alimenticias para recibir recomendaciones que se adapten a tu estilo de vida.
          ¡Empieza ahora y descubre una forma más fácil y saludable de mantener tu alimentación vegana!
        </p>
        <a href="../Perfil_nutricional/crear_perfil_nutric.html" class="create-button">
          Crear perfil nutricional
          <span class="arrow-icon"></span>
        </a>
        <div class="profile-illustration"></div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="profile-grid">
      <div class="grid-item">
        <div class="item-title">Datos nutricionales</div>
        <div class="item-content">
          <strong>Dieta:</strong> ${d.dieta_actual}<br>
          <strong>Peso:</strong> ${d.peso} kg<br>
          <strong>Altura:</strong> ${d.altura} cm
        </div>
        <button class="see-more" onclick="mostrarModal('nutricionales')">Ver más</button>
      </div>

      <div class="grid-item">
        <div class="item-title">Historia clínica</div>
        <div class="item-content">${previewLista([...(d.patologicos || []), ...(d.familiares || []), ...(d.quirurgicos || [])])}</div>
        <button class="see-more" onclick="mostrarModal('clinica')">Ver más</button>
      </div>

      <div class="grid-item">
        <div class="item-title">Afecciones personales</div>
        <div class="item-content">${previewLista([...(d.intolerancias || []), ...(d.alergias || [])])}</div>
        <button class="see-more" onclick="mostrarModal('afecciones')">Ver más</button>
      </div>

      <div class="grid-item">
        <div class="item-title">Síntomas gastrointestinales</div>
        <div class="item-content">${previewLista(d.sintomas || [])}</div>
        <button class="see-more" onclick="mostrarModal('sintomas')">Ver más</button>
      </div>

      <div class="grid-item grid-item-large">
        <div class="item-title">Resumen completo</div>
        <div class="item-content">Visualiza todos los datos del perfil en una sola vista.</div>
        <button class="see-more" onclick="mostrarModal('completo')">Ver más</button>
      </div>
    </div>
  `;
}

function previewLista(lista) {
  if (!lista || lista.length === 0) return 'Sin datos registrados.';
  return lista.slice(0, 2).join(', ') + (lista.length > 2 ? '...' : '');
}



/* -------- MODAL DE VER MAS DEL PORTAL DEL USUARIO  -------- */
function mostrarModal(tipo) {
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const modal = document.getElementById('modal');
  body.innerHTML = '';

  const d = perfilNutricional;

  const titulos = {
    nutricionales: 'Datos nutricionales',
    clinica: 'Historia clínica',
    afecciones: 'Afecciones personales',
    sintomas: 'Síntomas gastrointestinales',
    completo: 'Resumen completo del perfil'
  };

  title.textContent = titulos[tipo] || 'Detalle';

  if (tipo === 'nutricionales') {
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
    body.innerHTML = crearListaHTML(lista);
  } else if (tipo === 'afecciones') {
    const lista = [...(d.intolerancias || []), ...(d.alergias || [])];
    body.innerHTML = crearListaHTML(lista);
  } else if (tipo === 'sintomas') {
    body.innerHTML = crearListaHTML(d.sintomas || []);
  } else if (tipo === 'completo') {
    body.innerHTML = `
      <h4>Datos personales</h4>
      <p><strong>Nombre:</strong> ${datosUsuario.nombre_completo}</p>
      <p><strong>Email:</strong> ${datosUsuario.email}</p>
      <p><strong>Fecha de nacimiento:</strong> ${datosUsuario.fecha_nacimiento}</p>
      <p><strong>Género:</strong> ${datosUsuario.genero}</p>

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

  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    modal.classList.add('show');
  });
}

function crearListaHTML(lista) {
  if (!lista || lista.length === 0) return '<p>Sin información.</p>';
  return `<ul>${lista.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrarModal();
});

window.addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) cerrarModal();
});

document.querySelector('.close').addEventListener('click', cerrarModal);