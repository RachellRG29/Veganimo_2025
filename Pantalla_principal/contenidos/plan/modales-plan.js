console.log("✅ modales-plan.js cargado");

// Función para abrir modal
function abrirModalReceta(tipoComida) {
  console.log('🔓 Abriendo modal para:', tipoComida);
  
  const recetas = {
    desayuno: {
      titulo: "Desayuno - Bowl de Avena con Frutos Rojos",
      nombre: "Bowl de Avena con Frutos Rojos",
      descripcion: "Un desayuno nutritivo y energético perfecto para empezar el día.",
      imagen: "/Images/fondo_pu_oscuro.png",
      tiempo: "10 min",
      dificultad: "Fácil",
      calorias: "280 cal",
      tipo: "desayuno",
      ingredientes: ["1/2 taza de avena", "1 taza de leche de almendras", "1/2 taza de frutos rojos"],
      pasos: ["Calienta la leche", "Agrega la avena", "Decora con frutos"],
      estado: "disponible"
    },
    almuerzo: {
      titulo: "Almuerzo - Buddha Bowl Vegano", 
      nombre: "Buddha Bowl con Quinoa",
      descripcion: "Un almuerzo completo y balanceado.",
      imagen: "/Images/fondo_pu_oscuro.png",
      tiempo: "25 min",
      dificultad: "Intermedia", 
      calorias: "420 cal",
      tipo: "almuerzo",
      ingredientes: ["1 taza de quinoa", "1/2 aguacate", "1 zanahoria"],
      pasos: ["Cocina la quinoa", "Prepara vegetales", "Sirve en bowl"],
      estado: "pendiente"
    },
    cena: {
      titulo: "Cena - Crema de Calabacín",
      nombre: "Crema de Calabacín con Jengibre",
      descripcion: "Una cena ligera pero reconfortante.",
      imagen: "/Images/fondo_pu_oscuro.png", 
      tiempo: "20 min",
      dificultad: "Fácil",
      calorias: "180 cal",
      tipo: "cena",
      ingredientes: ["2 calabacines", "1/2 cebolla", "1 diente de ajo"],
      pasos: ["Pica calabacines", "Saltea cebolla", "Licúa y sirve"],
      estado: "pendiente"
    }
  };
  
  const receta = recetas[tipoComida];
  if (!receta) return;
  
  // Actualizar contenido del modal
  document.getElementById('modal-titulo-plan').textContent = receta.titulo;
  document.getElementById('modal-nombre-receta').textContent = receta.nombre;
  document.getElementById('modal-descripcion-plan').textContent = receta.descripcion;
  document.getElementById('modal-imagen-plan').src = receta.imagen;
  document.getElementById('modal-tiempo-plan').textContent = receta.tiempo;
  document.getElementById('modal-dificultad-plan').textContent = receta.dificultad;
  document.getElementById('modal-calorias-plan').textContent = receta.calorias;
  
  // Actualizar badge del tipo de comida
  const badgeTipo = document.getElementById('badge-tipo-comida');
  badgeTipo.className = 'badge-tipo-comida ' + receta.tipo;
  document.getElementById('letra-tipo-comida').textContent = 
    receta.tipo === 'desayuno' ? 'D' : receta.tipo === 'almuerzo' ? 'A' : 'C';
  
  // Actualizar ingredientes
  const listaIngredientes = document.getElementById('modal-ingredientes-plan');
  listaIngredientes.innerHTML = '';
  receta.ingredientes.forEach(ingrediente => {
    const li = document.createElement('li');
    li.textContent = ingrediente;
    listaIngredientes.appendChild(li);
  });
  
  // Actualizar pasos
  const listaPasos = document.getElementById('modal-pasos-plan');
  listaPasos.innerHTML = '';
  receta.pasos.forEach((paso, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${paso}`;
    listaPasos.appendChild(li);
  });
  
  // NUEVO: Actualizar estado
  const badgeEstado = document.getElementById('badge-estado-receta');
  badgeEstado.className = 'badge-estado ' + receta.estado;
  badgeEstado.innerHTML = receta.estado === 'disponible' ? 
    '<i class="ph ph-check-circle"></i><span>Disponible</span>' :
    '<i class="ph ph-clock"></i><span>Pendiente</span>';
  
  //  NUEVO: Configurar botón de empezar receta
  const btnEmpezarReceta = document.getElementById('btn-empezar-receta');
  if (receta.estado === 'disponible') {
    btnEmpezarReceta.disabled = false;
    btnEmpezarReceta.textContent = 'Empezar Receta';
    btnEmpezarReceta.onclick = () => {
      alert(`¡Empezando receta de ${receta.tipo}! Esta funcionalidad se implementará próximamente.`);
      cerrarModalPlan();
    };
  } else {
    btnEmpezarReceta.disabled = true;
    btnEmpezarReceta.textContent = 'No Disponible';
  }
  
  // Mostrar modal
  const modal = document.getElementById('modal-receta-plan');
  modal.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
}

// Función para cerrar modal
function cerrarModalPlan() {
  const modal = document.getElementById('modal-receta-plan');
  modal.classList.add('oculto');
  document.body.style.overflow = 'auto';
}

// Inicializar event listeners
function inicializarModalesPlan() {
  console.log("🚀 Inicializando modales del plan...");
  
  const btnDesayuno = document.getElementById('btn-desayuno');
  const btnAlmuerzo = document.getElementById('btn-almuerzo'); 
  const btnCena = document.getElementById('btn-cena');
  const btnCerrar = document.getElementById('cerrar-modal-plan');
  
  console.log('Botones encontrados:', {btnDesayuno, btnAlmuerzo, btnCena, btnCerrar});
  
  if (btnDesayuno) {
    btnDesayuno.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalReceta('desayuno');
    });
  }
  
  if (btnAlmuerzo) {
    btnAlmuerzo.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalReceta('almuerzo');
    });
  }
  
  if (btnCena) {
    btnCena.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalReceta('cena');
    });
  }
  
  if (btnCerrar) {
    btnCerrar.addEventListener('click', cerrarModalPlan);
  }
  
  // Cerrar modal al hacer clic fuera
  const modal = document.getElementById('modal-receta-plan');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) cerrarModalPlan();
    });
  }
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('modal-receta-plan');
      if (modal && !modal.classList.contains('oculto')) {
        cerrarModalPlan();
      }
    }
  });
}

// Hacer funciones disponibles globalmente
window.abrirModalReceta = abrirModalReceta;
window.cerrarModalPlan = cerrarModalPlan;
window.inicializarModalesPlan = inicializarModalesPlan;

/*console.log("✅ modales-plan.js inicializado correctamente");*/