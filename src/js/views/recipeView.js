import {elements} from './base';

export const clearResults = () => {
  elements.recipeViewBox.innerHTML = '';
};

export const renderRecipe = (title, image) => {
  const markup = `
  <figure class="recipe__fig">
    <img src="${image}" alt="Tomato" class="recipe__img">
    <h1 class="recipe__title">
        <span>${title}</span>
    </h1>
  </figure>`;

  elements.recipeViewBox.insertAdjacentHTML('beforeend', markup);
};