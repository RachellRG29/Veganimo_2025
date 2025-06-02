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
    return Array.from(document.querySelectorAll('.tarjeta-receta:not(#modal-receta .tarjeta-receta)')).map(card => ({
      element: card,
      title: card.querySelector('.title-tarjeta')?.textContent.trim().toLowerCase() || '',
      description: card.querySelector('.descripcion-tarjeta')?.textContent.trim().toLowerCase() || '',
      difficulty: card.querySelector('.lbl_dificultad')?.textContent.trim().toLowerCase() || '',
      category: (card.querySelector('.categoria-tarjeta')?.textContent.replace('Categoría: ', '').trim().toLowerCase() || '')
    }));
  }

  function createDivider() {
    const divider = document.createElement('div');
    divider.className = 'divisor-busqueda';
    divider.innerHTML = `
      <div class="linea-divisora"></div>
      <div class="texto-divisor">Resultados</div>
      <div class="linea-divisora"></div>
    `;
    return divider;
  }

  function showNotFoundCard() {
    const notFoundCard = document.createElement('div');
    notFoundCard.className = 'tarjeta-recip';
    notFoundCard.innerHTML = `
      <div class="imagen-superior">
        <img src="../Images/card_not_found0.jpg" alt="Imagen receta no disponible">
        <div class="icono-error">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2"/>
            <line x1="12" y1="7" x2="12" y2="13" stroke="#fff" stroke-width="2"/>
            <circle cx="12" cy="17" r="1.5" fill="#fff"/>
          </svg>
        </div>
      </div>
      <div class="contenido-recip">
        <h2 class="titulo-recip">Receta no encontrada</h2>
        <p class="desc-recip">
          No pudimos encontrar la receta que estás buscando.<br><br>Intenta nuevamente.
        </p>
      </div>
    `;
    container.appendChild(notFoundCard);
  }

  function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function filterRecipes() {
    const query = searchQuery.trim().toLowerCase();
    const category = selectedCategory.trim().toLowerCase();

    document.querySelector('.divisor-busqueda')?.remove();
    document.querySelector('.tarjeta-recip')?.remove();

    let allRecipes = getAllRecipes();
    const queryNorm = normalizeText(query);
    const searchWords = queryNorm.split(' ').filter(word => word.length > 0);

    let matchedRecipes = [];
    let unmatchedRecipes = [];

    // Ocultar todas
    allRecipes.forEach(recipe => {
      recipe.element.style.display = 'none';
      recipe.element.classList.remove('receta-destacada');
    });

    // Caso sin filtros
    if (query === '' && category === 'todos') {
      // Ordenar alfabéticamente por título
      allRecipes.sort((a, b) => a.title.localeCompare(b.title));
      allRecipes.forEach(recipe => {
        recipe.element.style.display = '';
        container.appendChild(recipe.element);
      });
      return;
    }

    allRecipes.forEach(recipe => {
      const isCategoryMatch = category === 'todos' || recipe.category === categoriaMapeo[category];

      if (!isCategoryMatch) return;

      if (query !== '') {
        const titleNorm = normalizeText(recipe.title);
        const descNorm = normalizeText(recipe.description);
        const diffNorm = normalizeText(recipe.difficulty);

        const isTextMatch = searchWords.some(word =>
          titleNorm.includes(word) || descNorm.includes(word) || diffNorm.includes(word)
        );

        if (isTextMatch) {
          matchedRecipes.push(recipe);
        } else {
          unmatchedRecipes.push(recipe);
        }
      } else {
        matchedRecipes.push(recipe);
      }
    });

    if (matchedRecipes.length > 0) {
      matchedRecipes.forEach(recipe => {
        recipe.element.style.display = '';
        if (query !== '') {
          recipe.element.classList.add('receta-destacada');
        }
        container.appendChild(recipe.element);
      });

      if (unmatchedRecipes.length > 0) {
        const divider = createDivider();
        container.appendChild(divider);

        unmatchedRecipes.forEach(recipe => {
          recipe.element.style.display = '';
          container.appendChild(recipe.element);
        });
      }
    } else {
      showNotFoundCard();

      const divider = createDivider();
      container.appendChild(divider);

      allRecipes.forEach(recipe => {
        const isCategoryMatch = category === 'todos' || recipe.category === categoriaMapeo[category];
        if (isCategoryMatch) {
          recipe.element.style.display = '';
          container.appendChild(recipe.element);
        }
      });
    }
  }

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

  filterRecipes();
}

// CSS adicional para estilos dinámicos
const style = document.createElement('style');
style.textContent = `
  .divisor-busqueda {
    width: 100%;
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    margin: 20px 0;
  }

  .linea-divisora {
    flex-grow: 1;
    height: 2px;
    background-color: #E99A3C;
  }

  .texto-divisor {
    margin: 0 15px;
    color: #E99A3C;
    font-weight: bold;
    white-space: nowrap;
  }

  .receta-destacada {
    animation: destacar 0.5s ease-out;
    box-shadow: 0 0 15px rgba(233, 154, 60, 0.5);
  }

  @keyframes destacar {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .tarjeta-recip {
    width: 100%;
    max-width: 300px;
    margin: 20px auto;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background: white;
    grid-column: 1 / -1;
  }

  /**/
  .tarjeta-recip {
  width: 100%;
  max-width: 360px;
  height: auto;
  background: linear-gradient(135deg, #154734, #007848); 
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  font-family: 'Comfortaa', sans-serif;
  margin: 40px auto;
  color: white;
}

.imagen-superior {
  position: relative;
  width: 100%;
}

.imagen-superior img {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: block;
}

.icono-error {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 6px;
  border-radius: 50%;
}

.contenido-recip {
  padding: 20px;
  text-align: center;
}

.titulo-recip {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
}

.desc-recip {
  font-size: 15px;
  color: #f3f3f3d5;
  line-height: 1.4;
}

`;
document.head.appendChild(style);
