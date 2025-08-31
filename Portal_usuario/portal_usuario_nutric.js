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
        <button class="see-more">Ver más</button>
      </div>

      <div class="grid-item">
        <div class="item-title">Historia clínica</div>
        <div class="item-content">${previewLista([...(d.patologicos || []), ...(d.familiares || []), ...(d.quirurgicos || [])])}</div>
        <button class="see-more">Ver más</button>
      </div>

      <div class="grid-item">
        <div class="item-title">Afecciones personales</div>
        <div class="item-content">${previewLista([...(d.intolerancias || []), ...(d.alergias || [])])}</div>
        <button class="see-more">Ver más</button>
      </div>

      <div class="grid-item">
        <div class="item-title">Síntomas gastrointestinales</div>
        <div class="item-content">${previewLista(d.sintomas || [])}</div>
        <button class="see-more">Ver más</button>
      </div>

      <div class="grid-item grid-item-large">
        <div class="item-title">Resumen completo</div>
        <div class="item-content">Visualiza todos los datos del perfil en una sola vista.</div>
        <button class="see-more">Ver más</button>
      </div>
    </div>
  `;
}

function previewLista(lista) {
  if (!lista || lista.length === 0) return 'Sin datos registrados.';
  return lista.slice(0, 2).join(', ') + (lista.length > 2 ? '...' : '');
}
