/* * Filtrado de tarjetas de recetas por búsqueda y categoría*/

function initializeRecipeSearch() {
  const container = document.querySelector('.grid-container-recetas');
  const searchInput = document.querySelector('.input_busqueda');
  const categorySelect = document.querySelector('#categoria-recetas');

  if (!container || !searchInput || !categorySelect) return;

  const categoriaMapeo = {
    vegano: "vegano",
    vegetariano: "vegetariano",
    transicionista: "transicionista"
  };

  let searchQuery = '';
  let selectedCategory = 'todos';

  function getAllRecipes() {
    return Array.from(document.querySelectorAll('.tarjeta-receta')).map(card => ({
      element: card,
      title: card.querySelector('.title-tarjeta')?.textContent.trim().toLowerCase() || '',
      description: card.querySelector('.descripcion-tarjeta')?.textContent.trim().toLowerCase() || '',
      time: card.querySelector('.lbl_tiempo_receta')?.textContent.trim().toLowerCase() || '',
      difficulty: card.querySelector('.lbl_dificultad')?.textContent.trim().toLowerCase() || '',
      category: (card.querySelector('.categoria-tarjeta')?.textContent.replace('Categoría: ', '') || '').trim().toLowerCase()
    }));
  }

  function filterRecipes() {
    const query = searchQuery.trim().toLowerCase();
    const category = selectedCategory.trim().toLowerCase();

    const allRecipes = getAllRecipes();
    let order = 0;

    allRecipes.forEach(recipe => {
      const isTextMatch = (
        recipe.title.includes(query) ||
        recipe.description.includes(query) ||
        recipe.time.includes(query) ||
        recipe.difficulty.includes(query)
      );

      const isCategoryMatch = (
        category === 'todos' || recipe.category === categoriaMapeo[category]
      );

      const shouldShow = category === 'todos'
        ? (query === '' || isTextMatch)
        : (recipe.category === categoriaMapeo[category] && (query === '' || isTextMatch));

      if (shouldShow) {
        recipe.element.style.display = '';

        // Solo destacar si hay búsqueda activa
        const shouldHighlight = query !== '' && isTextMatch;

        recipe.element.classList.toggle('receta-destacada', shouldHighlight);
        recipe.element.style.order = shouldHighlight ? order++ : 100;
      } else {
        recipe.element.style.display = 'none';
        recipe.element.classList.remove('receta-destacada');
      }
    });
  }

  // Listeners
  if (!searchInput.dataset.listenerAttached) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterRecipes();
    });
    searchInput.dataset.listenerAttached = 'true';
  }

  if (!categorySelect.dataset.listenerAttached) {
    categorySelect.addEventListener('change', (e) => {
      selectedCategory = e.target.value || 'todos';
      filterRecipes();
    });
    categorySelect.dataset.listenerAttached = 'true';
  }

  filterRecipes(); // Ejecutar al inicio
}
