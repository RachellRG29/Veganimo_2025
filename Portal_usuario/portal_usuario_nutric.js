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
          Aquí podrás registrar tus objetivos, preferencias y necesidades alimenticias para recibir recomendaciones que se adapten a tu estilo de vida. <br>
          ¡Empieza ahora y desbloquea tu experiencia completa con tu <strong>suscripción nutricional vegana!</strong>
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

  // Limpiar modal
  body.innerHTML = '';
  title.textContent = '';
  editBtn.style.display = 'none';
  editBtn.onclick = null;

  // Eliminar cualquier botón de imprimir previo
  const btnExistente = document.querySelector('.imprimir-btn');
  if (btnExistente) btnExistente.remove();

  const d = perfilNutricional || {};
  const dato = v => (v !== undefined && v !== null && v !== '' ? v : 'Sin datos registrados');

  const titulos = {
    nutricionales: 'Datos nutricionales',
    clinica: 'Historia clínica',
    afecciones: 'Afecciones personales',
    sintomas: 'Síntomas gastrointestinales',
    completo: 'Resumen completo del perfil',
    resumen: 'Resumen completo del perfil'
  };

  title.textContent = titulos[tipo] || 'Detalle';

  function bloqueHTML(titulo, contenido) {
    return `<section class="modal-section"><h4>${titulo}</h4>${contenido}</section>`;
  }

  function listaHTML(lista) {
    return (!lista || lista.length === 0)
      ? '<p>Sin datos registrados</p>'
      : `<ul>${lista.map(i => `<li>${i}</li>`).join('')}</ul>`;
  }

  // Construir contenido según tipo
  if (tipo === 'nutricionales') {
    body.innerHTML = bloqueHTML('Datos generales', `
      <p><strong>Dieta actual:</strong> ${dato(d.dieta_actual)}</p>
      <p><strong>Peso:</strong> ${dato(d.peso)} kg</p>
      <p><strong>Altura:</strong> ${dato(d.altura)} cm</p>
      <p><strong>Objetivo:</strong> ${dato(d.objetivo)}</p>
      <p><strong>Meta:</strong> ${dato(d.nivel_meta)}</p>
    `);
  } else if (tipo === 'clinica') {
    body.innerHTML = 
      bloqueHTML('Antecedentes patológicos', listaHTML(d.patologicos)) +
      bloqueHTML('Antecedentes familiares', listaHTML(d.familiares)) +
      bloqueHTML('Antecedentes quirúrgicos', listaHTML(d.quirurgicos));
  } else if (tipo === 'afecciones') {
    body.innerHTML = 
      bloqueHTML('Intolerancias', listaHTML(d.intolerancias)) +
      bloqueHTML('Alergias', listaHTML(d.alergias));
  } else if (tipo === 'sintomas') {
    body.innerHTML = bloqueHTML('Síntomas gastrointestinales', listaHTML(d.sintomas));
  } else if (tipo === 'completo' || tipo === 'resumen') {
    body.innerHTML =
      bloqueHTML('Datos generales', `
        <p><strong>Dieta actual:</strong> ${dato(d.dieta_actual)}</p>
        <p><strong>Peso:</strong> ${dato(d.peso)} kg</p>
        <p><strong>Altura:</strong> ${dato(d.altura)} cm</p>
        <p><strong>Objetivo:</strong> ${dato(d.objetivo)}</p>
        <p><strong>Meta:</strong> ${dato(d.nivel_meta)}</p>
      `) +
      bloqueHTML('Antecedentes patológicos', listaHTML(d.patologicos)) +
      bloqueHTML('Antecedentes familiares', listaHTML(d.familiares)) +
      bloqueHTML('Antecedentes quirúrgicos', listaHTML(d.quirurgicos)) +
      bloqueHTML('Intolerancias', listaHTML(d.intolerancias)) +
      bloqueHTML('Alergias', listaHTML(d.alergias)) +
      bloqueHTML('Síntomas gastrointestinales', listaHTML(d.sintomas));

    // --- BOTÓN IMPRIMIR SOLO EN RESUMEN COMPLETO ---
    const header = document.querySelector('.modal-content h3');
    const imprimirBtn = document.createElement('button');
    imprimirBtn.className = 'imprimir-btn';
    imprimirBtn.innerHTML = '🖨 Imprimir / PDF';
    imprimirBtn.onclick = () => imprimirResumen(d, body.innerHTML);
    header.parentNode.insertBefore(imprimirBtn, header);
  }

  // Mostrar modal
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));

  // Botón editar para otras secciones
  if (['clinica', 'afecciones', 'sintomas', 'nutricionales'].includes(tipo)) {
    editBtn.style.display = 'inline-block';
    editBtn.onclick = () => abrirModalEdicion(tipo);
  }
}


// Función de imprimir / PDF
function imprimirResumen(data, contenidoHTML) {
  Swal.fire({
    title: 'Selecciona acción',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Imprimir',
    denyButtonText: 'Guardar como PDF',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const win = window.open('', '', 'width=800,height=600');
      win.document.write('<html><head><title>Imprimir</title>');
      win.document.write(`<link rel="stylesheet" href="modal.css">`);
      win.document.write('</head><body>');
      win.document.write(`<div style="text-align:center;"><img src="../images/logo_veganimoo.png" class="logo-pdf"></div>`);
      win.document.write(`<h3 class="pdf-title">Resumen completo del perfil nutricional</h3>`);
      win.document.write(contenidoHTML);
      win.document.write('</body></html>');
      win.document.close();
      win.focus();
      win.print();
    } else if (result.isDenied) {
      if (!window.jspdf) {
        Swal.fire('Error', 'No se encontró jsPDF. Asegúrate de incluirlo en tu HTML.', 'error');
        return;
      }
      generarPDF(data);
    }
  });
}

// Función generar PDF con jsPDF
function generarPDF(d) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const lineHeight = 8;
  let y = 25;

  // Logo centrado
  const logo = new Image();
  logo.src = '../images/logo_veganimoo.png';
  logo.onload = function() {
    const imgProps = doc.getImageProperties(logo);
    const logoWidth = 40;
    const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
    doc.addImage(logo, 'PNG', (pageWidth - logoWidth)/2, 10, logoWidth, logoHeight);
    y += logoHeight + 10;

    // Título PDF
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 72);
    doc.text('Resumen completo del perfil nutricional', pageWidth/2, y, { align: 'center' });
    y += 12;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Secciones
    const secciones = [
      { titulo: 'Datos generales', contenido: [
          `Dieta actual: ${d.dieta_actual || 'Sin datos registrados'}`,
          `Peso: ${d.peso || 'Sin datos registrados'} kg`,
          `Altura: ${d.altura || 'Sin datos registrados'} cm`,
          `Objetivo: ${d.objetivo || 'Sin datos registrados'}`,
          `Meta: ${d.nivel_meta || 'Sin datos registrados'}`
        ]
      },
      { titulo: 'Antecedentes patológicos', contenido: d.patologicos && d.patologicos.length ? d.patologicos : ['Sin datos registrados'] },
      { titulo: 'Antecedentes familiares', contenido: d.familiares && d.familiares.length ? d.familiares : ['Sin datos registrados'] },
      { titulo: 'Antecedentes quirúrgicos', contenido: d.quirurgicos && d.quirurgicos.length ? d.quirurgicos : ['Sin datos registrados'] },
      { titulo: 'Intolerancias', contenido: d.intolerancias && d.intolerancias.length ? d.intolerancias : ['Sin datos registrados'] },
      { titulo: 'Alergias', contenido: d.alergias && d.alergias.length ? d.alergias : ['Sin datos registrados'] },
      { titulo: 'Síntomas gastrointestinales', contenido: d.sintomas && d.sintomas.length ? d.sintomas : ['Sin datos registrados'] },
    ];

    secciones.forEach(sec => {
      y += 6;
      doc.setFontSize(14);
      doc.setTextColor(0, 85, 0);
      doc.text(sec.titulo, 10, y);
      y += lineHeight;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      sec.contenido.forEach(item => {
        const lines = doc.splitTextToSize(item, pageWidth - 20);
        lines.forEach(l => {
          if (y > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            y = 25;
          }
          doc.text(l, 10, y);
          y += lineHeight;
        });
      });

      y += 4;
      doc.setDrawColor(0, 128, 72);
      doc.setLineWidth(0.5);
      doc.line(10, y, pageWidth - 10, y);
      y += lineHeight / 2;
    });

    doc.save('perfil_nutricional Veganimo.pdf');
  };
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 300);
}

/* -------- VARIABLES GLOBALES -------- */
let datosIniciales = {}; // guardamos el estado original del formulario

/* -------- MODAL DE EDICIÓN -------- */
//este codigo es para los que estan permitidos editar 
function abrirModalEdicion(tipo) {
  const tiposPermitidos = ['clinica', 'afecciones', 'sintomas', 'nutricionales'];
  if (!tiposPermitidos.includes(tipo)) return;

  const form = document.getElementById('modal-edit-form');
  const title = document.getElementById('modal-edit-title');
  form.innerHTML = ''; 
  let d = perfilNutricional;

  // === DATOS NUTRICIONALES ===
  if (tipo === 'nutricionales') {
    title.textContent = 'Editar datos nutricionales';
    form.innerHTML = `
      <h3 class="section-title" style="margin-bottom: 25px;">Datos nutricionales</h3>

      <div class="form-row justify-content-center w-85 mx-auto">
        <div class="form-group">
          <label class="form-label required" for="peso">Peso (kg):</label>
          <input type="number" id="peso" name="peso" class="form-input half-width" step="0.1" 
                 value="${d.peso || ''}" required style="border: 2px solid #817c7c !important;">
        </div>

        <div class="form-group">
          <label class="form-label required" for="altura">Altura (cm):</label>
          <input type="number" id="altura" name="altura" class="form-input half-width" step="0.1"
                 value="${d.altura || ''}" required style="border: 2px solid #817c7c !important;">
        </div>
      </div>

    `;
  }

  // === HISTORIA CLÍNICA ===
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

    const crearCheckboxes = (arr, nombreCampo, seleccionados = []) =>
      arr.map(item => {
        const checked = seleccionados.includes(item) ? 'checked' : '';
        return `<label><input type="checkbox" name="${nombreCampo}[]" value="${item}" ${checked}> ${item}</label>`;
      }).join('');

    form.innerHTML = `
      <h3>Antecedentes patológicos</h3>
      <div class="custom-select-options">${crearCheckboxes(patologicos, 'patologicos', d.patologicos || [])}</div>
      <h3>Antecedentes familiares</h3>
      <div class="custom-select-options">${crearCheckboxes(familiares, 'familiares', d.familiares || [])}</div>
      <h3>Antecedentes quirúrgicos</h3>
      <div class="custom-select-options">${crearCheckboxes(quirurgicos, 'quirurgicos', d.quirurgicos || [])}</div>
    `;
  }

  // === AFECCIONES PERSONALES ===
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
    const crearCheckboxes = (arr, nombreCampo, seleccionados = []) =>
      arr.map(item => {
        const checked = seleccionados.includes(item) ? 'checked' : '';
        return `<label><input type="checkbox" name="${nombreCampo}[]" value="${item}" ${checked}> ${item}</label>`;
      }).join('');

    form.innerHTML = `
      <h3>Intolerancias</h3>
      <div class="custom-select-options">${crearCheckboxes(intolerancias, 'intolerancias', d.intolerancias || [])}</div>
      <h3>Alergias</h3>
      <div class="custom-select-options">${crearCheckboxes(alergias, 'alergias', d.alergias || [])}</div>
    `;
  }

  // === SÍNTOMAS GASTROINTESTINALES ===
  if (tipo === 'sintomas') {
    title.textContent = 'Editar síntomas gastrointestinales';
    const sintomas = [
      "Dolor abdominal","Distensión abdominal","Gases o flatulencias","Náuseas","Vómitos",
      "Diarrea","Estreñimiento","Reflujo gastroesofágico","Acidez estomacal","Eructos frecuentes",
      "Pérdida de apetito","Sensación de llenura precoz","Cambio en el color de las heces","Heces con moco o sangre",
      "Tenesmo rectal","Incontinencia fecal","Dolor rectal o anal","Ictericia","Sabor amargo en la boca"
    ];
    const crearCheckboxes = (arr, nombreCampo, seleccionados = []) =>
      arr.map(item => {
        const checked = seleccionados.includes(item) ? 'checked' : '';
        return `<label><input type="checkbox" name="${nombreCampo}[]" value="${item}" ${checked}> ${item}</label>`;
      }).join('');

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
});
