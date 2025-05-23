function initializeRecipeSearch() {
  let searchQuery = '';
  let allRecipes = [];

  const container = document.querySelector('.grid-container-recetas');
  const searchInput = document.querySelector('.input_busqueda');
  const recipeCards = Array.from(document.querySelectorAll('.tarjeta-receta'));

  if (!container || !searchInput || recipeCards.length === 0) {
    //console.warn('Elementos necesarios no encontrados');
    return false;
  }

  // Guardar los datos originales de cada receta
  allRecipes = recipeCards.map(card => ({
    element: card,
    title: card.querySelector('.title-tarjeta')?.textContent.trim() || '',
    description: card.querySelector('.descripcion-tarjeta')?.textContent.trim() || '',
    time: card.querySelector('.lbl_tiempo_receta')?.textContent.trim() || '',
    difficulty: card.querySelector('.lbl_dificultad')?.textContent.trim() || '',
    originalClass: card.className
  }));

  // Función de filtro
  function filterRecipes() {
    allRecipes.forEach(recipe => {
      // Restaurar clases originales
      recipe.element.className = recipe.originalClass;
      recipe.element.style.order = '';
    });

    if (!searchQuery.trim()) return;

    allRecipes.forEach(recipe => {
      const matches = (
        recipe.title.toLowerCase().includes(searchQuery) ||
        recipe.description.toLowerCase().includes(searchQuery) ||
        recipe.time.toLowerCase().includes(searchQuery) ||
        recipe.difficulty.toLowerCase().includes(searchQuery)
      );

      if (matches) {
        recipe.element.classList.add('receta-destacada');
        recipe.element.style.order = '-1';
      }
    });
  }

  // Escuchar el input de búsqueda
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    filterRecipes();
  });

  return true;
}

// Observador para contenido dinámico
function setupContentObserver() {
  const targetNode = document.getElementById('contenido-principal');
  if (!targetNode) return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        if (document.querySelector('.section_recetas_pp')) {
          initializeRecipeSearch();
          observer.disconnect();
          break;
        }
      }
    }
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.section_recetas_pp')) {
    initializeRecipeSearch();
  } else {
    setupContentObserver();
  }
});
