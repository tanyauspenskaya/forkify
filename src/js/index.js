import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';


/** The Global state of the app
 * - Search object
 * - Current Recipe
 * - Shopping List object
 * - Liked recipes
 */

const state = {};
window.state = state;


/* SEARCH 
  CONTROLLER */ 

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



/* RECIPE 
  CONTROLLER */ 

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
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(recipeID)
      );
      //console.log(state.recipe);

    } catch(err) {
      alert(`Error processing recipe`);
      clearLoader();
    }
    
  }
  
};


/* LIST 
  CONTROLLER */ 

const controlList = () => {
  // Create a new list if there is none yet
  if(!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}


// Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  
  // delete
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  // update
  } else if(e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val);
  }
});

// testing
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

/* LIKE 
  CONTROLLER */ 

const controlLike = () => {
  if(!state.likes)  state.likes = new Likes();
  const currentID = state.recipe.id;

  // user has NOT yet liked current recipe
  if(!state.likes.isLiked(currentID)) {
    // add like to the state
    const newLike = state.likes.addLike(
      currentID, 
      state.recipe.title, 
      state.recipe.author, 
      state.recipe.img
    );

    // toggle button
    likesView.toggleLikeButton(true);

    // add like to UI list
    likesView.renderLike(newLike);
    
  // user has yet liked current recipe
  } else {

    // remove like from the state
    state.likes.deleteLike(currentID);

    // toggle button
    likesView.toggleLikeButton(false);

    // remove like from UI list
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
}


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
  } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // add to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // like controller
    controlLike();
  }
});

