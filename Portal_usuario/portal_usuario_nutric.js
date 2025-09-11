let datosUsuario = {};
let perfilNutricional = {};

document.addEventListener("DOMContentLoaded", () => {
  const editAvatarBtn = document.querySelector(".edit-avatar");
  const avatarDisplay = document.getElementById("avatar-display");

  if (editAvatarBtn) editAvatarBtn.addEventListener("click", abrirModalAvatar);

  if (avatarDisplay) {
    avatarDisplay.addEventListener("click", () => {
      const img = avatarDisplay.querySelector("img");
      if (img) mostrarAvatarGrande(img.src);
    });
  }

  fetch('cargar_datos_usuario.php')
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        console.error(data.message);
        return;
      }

      datosUsuario = data.usuario;
      perfilNutricional = data.perfil || {};

      const avatar = datosUsuario.avatar || 'predeterminado.png';
      datosUsuario.avatar = avatar;

      renderDatosPersonales();
      renderPerfilNutricional();
      document.getElementById('user-level').textContent = data.nivel || "No definido";
    })
    .catch(err => console.error('Error al cargar datos:', err));
});

/* -------- DATOS PERSONALES -------- */
function renderDatosPersonales() {
  const d = datosUsuario;
  document.getElementById('user-name').textContent = d.nombre_completo || "Nombre";
  document.getElementById('user-email').textContent = d.email || "Email";
  document.getElementById('user-birthdate').textContent = d.fecha_nacimiento || "Fecha nacimiento";
  document.getElementById('user-gender').textContent = d.genero || "Género";

  const avatarDisplay = document.getElementById("avatar-display");
  avatarDisplay.innerHTML = `<img src="../Images/Avatares/${d.avatar}" alt="Avatar usuario">`;
}

/* -------- PERFIL NUTRICIONAL -------- */
function renderPerfilNutricional() {
  const d = perfilNutricional;
  const container = document.getElementById('nutritional-content');

  if (!d || Object.keys(d).length === 0) {
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
          <i class="ph ph-arrow-circle-right"></i>
        </a>
        <div class="illus_sperf">
          <div class="profile-illustration"><img src="/Images/Avatares/predeterminado.png" alt="" class="illustration-image"></div>
          <div class="profile-illustration"><img src="/Images/menu_veg.png" alt="" class="illustration-menu"></div>
        </div>
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
        <button class="see see-more" onclick="mostrarModal('nutricionales')">Ver más</button>
      </div>

      <div class="grid-item">
        <div class="item-title">Historia clínica</div>
        <div class="item-content">${previewLista([...(d.patologicos || []), ...(d.familiares || []), ...(d.quirurgicos || [])])}</div>
        <button class="see see-more" onclick="mostrarModal('clinica')">Ver más</button>
      </div>

      <div class="grid-item">
        <div class="item-title">Afecciones personales</div>
        <div class="item-content">${previewLista([...(d.intolerancias || []), ...(d.alergias || [])])}</div>
        <button class="see see-more" onclick="mostrarModal('afecciones')">Ver más</button>
      </div>

      <div class="grid-item">
        <div class="item-title">Síntomas gastrointestinales</div>
        <div class="item-content">${previewLista(d.sintomas || [])}</div>
        <button class="see see-more" onclick="mostrarModal('sintomas')">Ver más</button>
      </div>

      <div class="grid-item grid-item-large">
        <div class="item-title">Resumen completo</div>
        <div class="item-content">Visualiza todos los datos del perfil en una sola vista.</div>
        <button class="see see-more" onclick="mostrarModal('completo')">Ver más</button>
      </div>
    </div>
  `;
}

function previewLista(lista) {
  if (!lista || lista.length === 0) return 'Sin datos registrados.';
  return lista.slice(0, 2).join(', ') + (lista.length > 2 ? '...' : '');
}

/* -------- AVATARES -------- */
function abrirModalAvatar() {
  const modal = document.getElementById("modal-avatar");
  const gridContainer = document.getElementById("avatar-grid");

  const avataresMasculinos = [
    {file: "mr_mango.png", name: "Mr. Mango"},
    {file: "mr_uva.png", name: "Mr. Uva"},
    {file: "mr_coco.png", name: "Mr. Coco"},
    {file: "mr_brocoli.png", name: "Mr. Brocoli"},
    {file: "mr_chile.png", name: "Mr. Chile"}
  ];

  const avataresFemeninos = [
    {file: "miss_pera.png", name: "Miss Pera"},
    {file: "miss_fresa.png", name: "Miss Fresa"},
    {file: "miss_berenjena.png", name: "Miss Berenjena"},
    {file: "miss_izote.png", name: "Miss Izote"},
    {file: "miss_piña.png", name: "Miss Piña"}
  ];

  const avatarPredeterminado = {file: "predeterminado.png", name: "Predeterminado"};
  const rutaAvatares = "../Images/Avatares/";

  gridContainer.innerHTML = `
    <div class="avatar-grid-container">
      <div class="avatar-predeterminado">
        <div class="avatar-item">
          <img src="${rutaAvatares}${avatarPredeterminado.file}" alt="${avatarPredeterminado.name}" onclick="seleccionarAvatar('${avatarPredeterminado.file}')">
          <div class="avatar-name">${avatarPredeterminado.name}</div>
        </div>
      </div>
      
      <div class="avatar-masculinos">
        <div class="avatar-section-title">Avatares Masculinos</div>
        <div class="avatar-grid">
          ${avataresMasculinos.map(a => `
            <div class="avatar-item">
              <img src="${rutaAvatares}${a.file}" alt="${a.name}" onclick="seleccionarAvatar('${a.file}')">
              <div class="avatar-name">${a.name}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="avatar-femeninos">
        <div class="avatar-section-title">Avatares Femeninos</div>
        <div class="avatar-grid">
          ${avataresFemeninos.map(a => `
            <div class="avatar-item">
              <img src="${rutaAvatares}${a.file}" alt="${a.name}" onclick="seleccionarAvatar('${a.file}')">
              <div class="avatar-name">${a.name}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  modal.style.display = "flex";
  requestAnimationFrame(() => modal.classList.add("show"));
}

function cerrarModalAvatar() {
  const modal = document.getElementById("modal-avatar");
  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 300);
}

function seleccionarAvatar(file) {
  const avatarDisplay = document.getElementById("avatar-display");
  const rutaAvatares = "../Images/Avatares/";

  avatarDisplay.innerHTML = `<img src="${rutaAvatares}${file}" alt="Avatar seleccionado">`;
  datosUsuario.avatar = file;

  cerrarModalAvatar();

  fetch('update_avatar.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `avatar=${encodeURIComponent(file)}`
  })
  .then(res => res.json())
  .then(data => {
    if (!data.success) console.error('Error guardando avatar:', data.message);
  })
  .catch(err => console.error('Error de conexión al guardar avatar:', err));
}

function mostrarAvatarGrande(src) {
  const modal = document.getElementById("avatar-large-modal");
  const img = document.getElementById("avatar-large-img");
  img.src = src;
  modal.style.display = "flex";
  requestAnimationFrame(() => modal.classList.add("show"));
}

function cerrarAvatarGrande() {
  const modal = document.getElementById("avatar-large-modal");
  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 300);
}

/* --------//////////////////// MODALES DE PERFIL //////////////////////-------- */
function mostrarModal(tipo) {
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const modal = document.getElementById('modal');
  const editBtn = document.getElementById('edit-modal-btn');

  body.innerHTML = '';
  title.textContent = '';
  editBtn.style.display = 'none';
  editBtn.onclick = null;

  const d = perfilNutricional;
  const titulos = {
    nutricionales: 'Datos nutricionales',
    clinica: 'Historia clínica',
    afecciones: 'Afecciones personales',
    sintomas: 'Síntomas gastrointestinales',
    completo: 'Resumen completo del perfil',
    resumen: 'Resumen completo del perfil'
  };

  title.textContent = titulos[tipo] || 'Detalle';

  if (tipo === 'nutricionales') {
   body.innerHTML = `
    <section class="modal-section">
      <p>Dieta actual: ${d.dieta_actual}</p>
      <p>Peso: ${d.peso} kg</p>
      <p><strong>Altura:</strong> ${d.altura} cm</p>
      <p><strong>Objetivo:</strong> ${d.objetivo}</p>
      <p><strong>Meta:</strong> ${d.nivel_meta}</p>
    </section>
  `;
    } else if (tipo === 'clinica') {
    body.innerHTML = `
      <section class="modal-section">
        <h4>Antecedentes patológicos</h4>
        ${crearListaHTML(d.patologicos)}
      </section>
      <section class="modal-section">
        <h4>Antecedentes familiares</h4>
        ${crearListaHTML(d.familiares)}
      </section>
      <section class="modal-section">
        <h4>Antecedentes quirúrgicos</h4>
        ${crearListaHTML(d.quirurgicos)}
      </section>
    `;
} else if (tipo === 'afecciones') {
  body.innerHTML = `
    <section class="modal-section">
      <h4>Intolerancias</h4>
      ${crearListaHTML(d.intolerancias)}
    </section>
    <section class="modal-section">
      <h4>Alergias</h4>
      ${crearListaHTML(d.alergias)}
    </section>
  `;
  } else if (tipo === 'sintomas') {
  body.innerHTML = `
    <section class="modal-section">
      ${crearListaHTML(d.sintomas)}
    </section>
  `;
  } else if (tipo === 'completo' || tipo === 'resumen') {
    const dato = (v, suf = '') => (v !== undefined && v !== null && v !== '') ? `${v}${suf}` : '—';
    const bloque = (t, contenido) => `<section class="modal-section"><h4>${t}</h4>${contenido}</section>`;

    const top = `
      <p><strong>Dieta actual:</strong> ${dato(d.dieta_actual)}</p>
      <p><strong>Peso:</strong> ${dato(d.peso, ' kg')}</p>
      <p><strong>Altura:</strong> ${dato(d.altura, ' cm')}</p>
      <p><strong>Objetivo:</strong> ${dato(d.objetivo)}</p>
      <p><strong>Meta:</strong> ${dato(d.nivel_meta)}</p>
    `;

    const html =
      bloque('Datos generales', top) +
      bloque('Antecedentes patológicos', crearListaHTML(d.patologicos)) +
      bloque('Antecedentes familiares', crearListaHTML(d.familiares)) +
      bloque('Antecedentes quirúrgicos', crearListaHTML(d.quirurgicos)) +
      bloque('Intolerancias', crearListaHTML(d.intolerancias)) +
      bloque('Alergias', crearListaHTML(d.alergias)) +
      bloque('Síntomas gastrointestinales', crearListaHTML(d.sintomas));

    body.innerHTML = html;
  }

  if (['clinica', 'afecciones', 'sintomas'].includes(tipo)) {
    editBtn.style.display = 'inline-block';
    editBtn.onclick = () => abrirModalEdicion(tipo);
  }

  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
}

function crearListaHTML(lista) {
  if (!lista || lista.length === 0) return '<p>Sin información.</p>';
  return `<ul>${lista.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 300);
}



/* -------- VARIABLES GLOBALES -------- */
let datosIniciales = {}; // guardamos el estado original del formulario

/* -------- MODAL DE EDICIÓN -------- */
function abrirModalEdicion(tipo) {
  const tiposPermitidos = ['clinica', 'afecciones', 'sintomas'];
  if (!tiposPermitidos.includes(tipo)) return;

  const form = document.getElementById('modal-edit-form');
  const title = document.getElementById('modal-edit-title');
  form.innerHTML = ''; 
  let d = perfilNutricional;

  // === historia clínica ===
  if (tipo === 'clinica') {
    title.textContent = 'Editar historia clínica';
    const patologicos = [
      "Hipertensión arterial","Diabetes mellitus","Asma bronquial","Alergia a medicamentos",
      "Alergia a picaduras","Colesterol alto","Triglicéridos altos","Obesidad",
      "Sobrepeso","Hipotiroidismo","Hipertiroidismo","Infarto","Insuficiencia cardíaca",
      "EPOC","Tuberculosis","Epilepsia","Migraña","ACV","Depresión","Ansiedad",
      "Esquizofrenia","VIH","Hepatitis B","Hepatitis C","Gastritis","Úlcera","Colitis"
    ];
    const familiares = [
      "Diabetes mellitus","Hipertensión arterial","Cáncer de mama","Cáncer de colon",
      "Cáncer de próstata","Cáncer de pulmón","Infarto","Angina","Muerte súbita",
      "ACV","Asma","Enfermedades alérgicas","Hemofilia","Fibrosis quística",
      "Otra enfermedad genética","Depresión","Ansiedad","Esquizofrenia","Artritis reumatoide","Lupus"
    ];
    const quirurgicos = [
      "Apendicectomía","Colecistectomía","Cesárea","Herniorrafia inguinal",
      "Herniorrafia umbilical","Amigdalectomía","Cirugía de rodilla","Cirugía de columna",
      "Histerectomía","Cirugía oftálmica","Cirugías por fracturas","Cirugías con prótesis",
      "Cirugías cardiovasculares"
    ];

    const crearCheckboxes = (arr, nombreCampo, seleccionados = []) => {
      return arr.map(item => {
        const checked = seleccionados.includes(item) ? 'checked' : '';
        return `<label><input type="checkbox" name="${nombreCampo}[]" value="${item}" ${checked}> ${item}</label>`;
      }).join('');
    };

    form.innerHTML = `
      <h3>Antecedentes patológicos</h3>
      <div class="custom-select-options">${crearCheckboxes(patologicos, 'patologicos', d.patologicos || [])}</div>
      <h3>Antecedentes familiares</h3>
      <div class="custom-select-options">${crearCheckboxes(familiares, 'familiares', d.familiares || [])}</div>
      <h3>Antecedentes quirúrgicos</h3>
      <div class="custom-select-options">${crearCheckboxes(quirurgicos, 'quirurgicos', d.quirurgicos || [])}</div>
    `;
  }

  // === afecciones personales ===
  if (tipo === 'afecciones') {
    title.textContent = 'Editar afecciones personales';
    const intolerancias = [
      "Lactosa","Gluten (no celíaca)","Fructosa","Sorbitol","Caseína","Suero de leche",
      "FODMAPs","Huevos","Pescado o mariscos","Trigo","Maíz","Soya","Ajo","Cebolla",
      "Tomate","Chocolate","Cafeína","Alcohol","Maní o nueces","GMS","Vinagre",
      "Colorantes artificiales","Edulcorantes artificiales","Legumbres","Miel"
    ];
    const alergias = [
      "Maní","Nueces","Huevo","Leche de vaca","Pescado","Mariscos","Trigo","Soya",
      "Sésamo","Mostaza","Frutas frescas","Latex-frutas","Gelatina","Colorantes artificiales","Preservantes"
    ];
    const crearCheckboxes = (arr, nombreCampo, seleccionados = []) => {
      return arr.map(item => {
        const checked = seleccionados.includes(item) ? 'checked' : '';
        return `<label><input type="checkbox" name="${nombreCampo}[]" value="${item}" ${checked}> ${item}</label>`;
      }).join('');
    };

    form.innerHTML = `
      <h3>Intolerancias</h3>
      <div class="custom-select-options">${crearCheckboxes(intolerancias, 'intolerancias', d.intolerancias || [])}</div>
      <h3>Alergias</h3>
      <div class="custom-select-options">${crearCheckboxes(alergias, 'alergias', d.alergias || [])}</div>
    `;
  }

  // === síntomas gastrointestinales ===
  if (tipo === 'sintomas') {
    title.textContent = 'Editar síntomas gastrointestinales';
    const sintomas = [
      "Dolor abdominal","Distensión abdominal","Gases o flatulencias","Náuseas","Vómitos",
      "Diarrea","Estreñimiento","Reflujo gastroesofágico","Acidez estomacal","Eructos frecuentes",
      "Pérdida de apetito","Sensación de llenura precoz","Cambio en el color de las heces","Heces con moco o sangre",
      "Tenesmo rectal","Incontinencia fecal","Dolor rectal o anal","Ictericia","Sabor amargo en la boca"
    ];
    const crearCheckboxes = (arr, nombreCampo, seleccionados = []) => {
      return arr.map(item => {
        const checked = seleccionados.includes(item) ? 'checked' : '';
        return `<label><input type="checkbox" name="${nombreCampo}[]" value="${item}" ${checked}> ${item}</label>`;
      }).join('');
    };

    form.innerHTML = `
      <h3>Síntomas</h3>
      <div class="custom-select-options">${crearCheckboxes(sintomas, 'sintomas', d.sintomas || [])}</div>
    `;
  }

  // Guardar estado inicial
  datosIniciales = new FormData(form);

  // Deshabilitar botón actualizar hasta que haya cambios
  const btnActualizar = document.querySelector('.btn-guar');
  btnActualizar.disabled = true;

  // Escuchar cambios
  form.addEventListener('input', () => {
    btnActualizar.disabled = !hayCambios(form);
  });

  form.dataset.tipo = tipo;
  const modal = document.getElementById('modal-edit');
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
}

/* -------- COMPROBAR CAMBIOS -------- */
function hayCambios(form) {
  const datosActuales = new FormData(form);
  for (let [clave, valor] of datosActuales.entries()) {
    if (!datosIniciales.has(clave) || datosIniciales.getAll(clave).toString() !== datosActuales.getAll(clave).toString()) {
      return true;
    }
  }
  return false;
}

/* -------- CANCELAR / CERRAR -------- */
function cancelarEdicion() {
  const form = document.getElementById('modal-edit-form');
  if (hayCambios(form)) {
    Swal.fire({
      title: '¿Salir sin guardar?',
      text: "Si sales de esta ventana se perderán todos los datos modificados ¿Estás seguro de salir?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        cerrarModalEdit();
        document.getElementById('modal').style.display = 'flex'; 
      }
    });
  } else {
    cerrarModalEdit();
    document.getElementById('modal').style.display = 'flex'; 
  }
}

/* -------- GUARDAR EDICIÓN -------- */
function guardarEdicion() {
  const form = document.getElementById('modal-edit-form');

  if (!hayCambios(form)) return; // botón está deshabilitado si no hay cambios

  Swal.fire({
    title: '¿Confirmar actualización?',
    text: "Los cambios que hagas modificarán tus dietas recomendadas. ¿Deseas continuar?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const tipo = form.dataset.tipo;
      const data = new FormData(form);
      data.append('tipo', tipo);

      fetch('update_perfil.php', {
        method: 'POST',
        body: data
      })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          perfilNutricional = {...perfilNutricional, ...resp.actualizado};
          renderPerfilNutricional();
          cerrarModalEdit();
          cerrarModal();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: resp.message,
            confirmButtonText: 'Entendido'
          });
        }
      })
      .catch(err => console.error('Error en la conexión:', err));
    }
  });
}

/* -------- CERRAR MODAL -------- */
function cerrarModalEdit() {
  const modal = document.getElementById('modal-edit');
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 300);
}



/* -------- EVENTOS GLOBALES -------- */
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cerrarModal();
    cerrarModalAvatar();
    cerrarAvatarGrande();
    cerrarModalEdit();
  }
});

window.addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) cerrarModal();
  if (e.target === document.getElementById('modal-avatar')) cerrarModalAvatar();
  if (e.target === document.getElementById('avatar-large-modal')) cerrarAvatarGrande();
  if (e.target === document.getElementById('modal-edit')) cerrarModalEdit();
});

