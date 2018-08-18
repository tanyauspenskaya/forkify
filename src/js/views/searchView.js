import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};
export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`a[href*="#${id}"]`).classList.add('results__link--active');
};

const limitRecipeTitle = (title, limit = 19) => {
  if(title.length > limit) {
    let newTitle = title.substr(0, limit);
    newTitle = newTitle.substr(0, Math.min(newTitle.length, newTitle.lastIndexOf(' ')));
    return `${newTitle} …`;
  }
  return title;
};

const renderRecipe = recipe => {
  const markup = `
  <li>
    <a class="results__link" href="#${recipe.recipe_id}">
      <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
      </figure>
      <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
      </div>
    </a>
  </li>`;

  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createBtn = (curPage, type) => `
<button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? curPage - 1 : curPage + 1}">
  <span>Page ${type === 'prev' ? curPage - 1 : curPage + 1}</span>
  <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
  </svg>
</button>`;

const renderButtons = (page, numRes, resPerPage) => {
  const pages = Math.ceil(numRes / resPerPage);
  let button;

  if(page === 1 && pages > 1) {
    // only button to go to next page
    button = createBtn(page, 'next');
  } else if(page < pages && page > 1) {
    // both prev and next
    button = `
      ${createBtn(page, 'prev')}
      ${createBtn(page, 'next')}`;
  } else if(page === pages && pages > 1) {
    // only button to go to previous page  
    button = createBtn(page, 'prev');
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page=1, resPerPage=8) => {
  // render results of current page
  const start = (page - 1) * resPerPage; // 0
  const end = page * resPerPage; // 10

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);

  recipes.slice(start, end).forEach(renderRecipe);
};