import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { state, getRecipeData, getSearchResult, uploadRecipe } from './model';
import { CLEAR_ADDRECIPE_CONTAINER_TIMEOUT } from './configuration';
import { viewRecipe } from './view/recipeView';
import { searchRecipe } from './view/searchResultView';
import { displaySearchResultView } from './view/displaySearchResultView';
import { paginationView } from './view/paginationView';
import { bookMarkView } from './view/BookMarkView';
import { addRecipeView } from './view/addRecipeView';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

// https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886

///////////////////////////////////////

async function controlRecipeView(e) {
  try {
    viewRecipe.showLoadingSpinner();

    if (e == 'load') {
      // viewRecipe.setClearLocalStorage(true);
      viewRecipe.getBookMarkFromLocalStorage();
      const currentlyBookMarkedRecipe = viewRecipe.getBookMarkedRecipes();

      bookMarkView.setRecipeData(currentlyBookMarkedRecipe);
      bookMarkView.render();
    }

    const currentRecipeList = displaySearchResultView.getRecipeData();

    if (e === 'hashchange' && currentRecipeList) {
      displaySearchResultView.render();
      bookMarkView.render();
    }

    const recipeId = window.location.hash.slice(1);

    if (!recipeId) throw new Error(`couldn't get a proper recipeID`);

    await getRecipeData(recipeId);

    viewRecipe.setRecipeData(state.recipeData);

    viewRecipe.render();
  } catch (error) {
    if (error.message === "couldn't get a proper recipeID")
      viewRecipe.renderDefaultMessage();

    if (error.message.includes('Invalid _id')) viewRecipe.renderErrorMessage();
  }
}

async function controlSearchResultView() {
  try {
    displaySearchResultView.showLoadingSpinner();
    const queryString = searchRecipe.getQueryString();
    if (!queryString) throw new Error('no query string provided');
    await getSearchResult(queryString);
    viewRecipe.renderDefaultMessage();
    displaySearchResultView.setRecipeData(state.searchResult.data);
    displaySearchResultView.resetCurrentPage();
    displaySearchResultView.render();
    const paginationViewData =
      displaySearchResultView.returnPaginationViewData();
    paginationView.setPaginationData(paginationViewData);
    paginationView.render();
  } catch (error) {
    displaySearchResultView.renderErrorMessage();
  }
}

function paginationCoordinatoor(goToPage) {
  displaySearchResultView.setCurrentPage(goToPage);
  const paginationViewData = displaySearchResultView.returnPaginationViewData();
  paginationView.setPaginationData(paginationViewData);
  paginationView.render();
}

function controlServingsChange(newServings) {
  if (!viewRecipe.confirmServingsIsValid(newServings)) return;
  viewRecipe.generateNewRecipeData(newServings);
}

function bookMarkingController() {
  // -> All of the logic below is to handle adding a recipe to the bookMark array and make sure the currently bookmarked recipe carries the bookmarked badge om the UI
  const currentRecipe = viewRecipe.getRecipeData();
  let bookMarkedState = viewRecipe.getBookmarkedState();

  if (!bookMarkedState) {
    viewRecipe.pushRecipeToBookMark(currentRecipe);
  } else if (bookMarkedState) {
    const id = currentRecipe.id;
    viewRecipe.removeRecipeFromBookMark(id);
  }

  viewRecipe.render();

  // -> All of the logic below is to ensure that the bookmarked recipe are present in the BookMarked view of the UI
  const currentlyBookMarkedRecipe = viewRecipe.getBookMarkedRecipes();
  bookMarkView.setRecipeData(currentlyBookMarkedRecipe);
  bookMarkView.render();
}

async function addNewRecipeController(formData) {
  try {
    // show loading spinner
    addRecipeView.showLoadingSpinner();

    // try upload the recipe to the server
    const myRecipe = await uploadRecipe(formData);

    // show success message when recipe is successfully uploaded to the server
    addRecipeView.renderSuccessMessage();

    // set the added recipe as the current recipe of the RecipeView
    viewRecipe.setRecipeData(myRecipe);

    // bookMark the newly posted recipe
    viewRecipe.pushRecipeToBookMark(myRecipe);

    // display the added recipe on viewRecipe
    viewRecipe.render();

    // update the bookmarked view to include the just created recipe
    bookMarkView.render();

    // change the id in the browser url to reflect the id of the newly created recipe
    window.history.pushState(null, '', `#${myRecipe.id}`);

    // then close the add recipe container after 2.5 seconds
    setTimeout(function () {
      addRecipeView.hideRecipeMarkUp();
    }, CLEAR_ADDRECIPE_CONTAINER_TIMEOUT * 1000);
  } catch (error) {
    addRecipeView.renderErrorMessage(error.message);
  }
}

function init() {
  viewRecipe.addRenderHandler(controlRecipeView);
  viewRecipe.addBookmarkingController(bookMarkingController);
  viewRecipe.addServingsChangesController(controlServingsChange);
  searchRecipe.addSearchHandler(controlSearchResultView);
  paginationView.addPaginationHandler(paginationCoordinatoor);
  addRecipeView.addGetAddRecipeFormDetailsHandler(addNewRecipeController);
}

init();

// if (module.hot) {
//   module.hot.accept();
// }
