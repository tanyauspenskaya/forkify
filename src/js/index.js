import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements} from './views/base';

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

    // 4) search for recipes
    await state.search.getResults();

    // 5) render results on UI
    //console.log(state.search.result);
    searchView.renderResults(state.search.result);
  } else {

  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});


