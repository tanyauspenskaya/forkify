import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';

/** The Global state of the app
 * - Search object
 * - Current Recipe
 * - Shopping List object
 * - Liked recipes
 */

const state = {};


/* SEARCH CONTROLLER */ 
const controlSearch = async () => {
  // 1) get query from view
  const query = searchView.getInput(); 
  //console.log(query);
  
  if(query) {
    // 2) new search object and add to state
    state.search = new Search(query);

    // 3) prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) search for recipes
      await state.search.getResults();
      // 5) render results on UI
      //console.log(state.search.result);
      clearLoader();
      searchView.renderResults(state.search.result);

    } catch (err) {
      alert(`Error processing search results`);
      clearLoader();
    }
    
  } 

};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  e.preventDefault();
  const btn = e.target.closest('.btn-inline');
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});



/* RECIPE CONTROLLER */ 
const controlRecipe = async () => {
  // get ID from url
  const recipeID = window.location.hash.replace('#','');

  if(recipeID) {
    // Render loader
    recipeView.clearResults();
    renderLoader(elements.recipeViewBox);

    // Highlight Selected Recipe
    if(state.search) searchView.highlightSelected(recipeID);

    // Create new recipe object
    state.recipe = new Recipe(recipeID);

    try {
      // Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      
      // Render recipe on UI
      clearLoader();
      recipeView.renderRecipe(state.recipe);
      //console.log(state.recipe);

    } catch(err) {
      alert(`Error processing recipe`);
      clearLoader();
    }
    
  }
  
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange','load'].forEach(e => window.addEventListener(e, controlRecipe));

// Handling recipe button clicks
elements.recipeViewBox.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease, .btn-decrease *')) {
    if(state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if(e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }
});