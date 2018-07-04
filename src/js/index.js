import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/** The Global state of the app
 * - Search object
 * - Current Recipe
 * - Shopping List object
 * - Liked recipes
 */

const state = {};

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

    // 4) search for recipes
    await state.search.getResults();

    // 5) render results on UI
    //console.log(state.search.result);
    clearLoader();
    searchView.renderResults(state.search.result);
  } else {

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


