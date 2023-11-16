import icons from 'url:../../img/icons.svg';

class RecipeView {
  // unique
  #parentContainer = document.querySelector('.recipe');
  #recipeData;
  #bookMarkedRecipes = [];
  #errorMessage = `sorry we couldn't successfully fetch your recipe, please check and confirm your input then try again`;
  #clearLocalStorage = false;

  // constructor() {
  //   this.#coordinateRequestUI();
  // }

  // unique
  addRenderHandler(handler) {
    ['load', 'hashchange'].forEach(ev =>
      window.addEventListener(ev, function () {
        handler(ev);
      })
    );
  }

  addServingsChangesController(handler) {
    this.#parentContainer.addEventListener('click', function (e) {
      let newServings;
      const activeElement = e.target.closest('.btn--update-servings');
      if (!activeElement) return;
      newServings = +activeElement.dataset.currentServings;
      handler(newServings);
    });
  }

  addGetBookMarkedRecipeFromLocalStorage(handler) {}

  addBookmarkingController(handler) {
    this.#parentContainer.addEventListener('click', function (e) {
      const bookMarkButton = e.target.closest('.btn--bookmark');
      if (!bookMarkButton) return;
      handler();
    });
  }

  updateLocalStorageBookMark() {
    localStorage.setItem('bookmarks', JSON.stringify(this.#bookMarkedRecipes));
  }

  setClearLocalStorage(answer) {
    if (answer === true) this.#clearLocalStorage = answer;
    if (answer === false) this.#clearLocalStorage = answer;
  }

  getBookMarkFromLocalStorage() {
    if (this.#clearLocalStorage === true) localStorage.clear('bookmarks');

    const bookmarkedRecipe = localStorage.getItem('bookmarks');

    if (bookmarkedRecipe)
      this.#bookMarkedRecipes = JSON.parse(bookmarkedRecipe);
  }

  pushRecipeToBookMark(recipe) {
    this.#bookMarkedRecipes.push(recipe);
    this.#recipeData.bookmarked = true;
    this.updateLocalStorageBookMark();
  }

  removeRecipeFromBookMark(id) {
    const filteredBookMarkedRecipes = this.#bookMarkedRecipes.filter(
      recipe => recipe.id !== id
    );
    this.#bookMarkedRecipes = filteredBookMarkedRecipes;
    this.#recipeData.bookmarked = false;
    this.updateLocalStorageBookMark();
  }

  getBookmarkedState() {
    return this.#recipeData.bookmarked;
  }

  getBookMarkedRecipes() {
    return this.#bookMarkedRecipes;
  }

  confirmServingsIsValid(newServings) {
    return newServings >= 1;
  }

  generateNewRecipeData(newServings) {
    this.#recipeData.ingredients.map(ing => {
      ing.quantity = (ing.quantity * newServings) / this.#recipeData.servings;
    });
    this.#recipeData.servings = newServings;

    this.render();
  }

  #clearRecipeContainer() {
    this.#parentContainer.innerHTML = '';
  }

  #fillRecipeContainer(markUp) {
    this.#parentContainer.insertAdjacentHTML('afterbegin', markUp);
  }

  showLoadingSpinner() {
    const spinnerMarkUp = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> 
  `;

    this.#clearRecipeContainer();
    this.#fillRecipeContainer(spinnerMarkUp);
  }

  // unique
  // #restoreUI() {
  //   if (this.#recipeData === undefined) {
  //     const restoreMarkUp = `
  //   <div class="message">
  //     <div>
  //       <svg>
  //         <use href="${icons}#icon-smile"></use>
  //       </svg>
  //     </div>
  //     <p>Start by searching for a recipe or an ingredient. Have fun!</p>
  //   </div>
  //   `;

  //     const parentContainer = document.querySelector('.recipe');

  //     this.#clearRecipeContainer();
  //     this.#fillRecipeContainer(restoreMarkUp);
  //   }
  // }

  renderDefaultMessage() {
    const restoreMarkUp = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>Start by searching for a recipe or an ingredient. Have fun!</p>
    </div>
    `;
    this.#clearRecipeContainer();
    this.#fillRecipeContainer(restoreMarkUp);
  }

  renderErrorMessage(message = this.#errorMessage) {
    const markUp = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this.#clearRecipeContainer();
    this.#fillRecipeContainer(markUp);
  }

  returnCurrentServings() {
    return this.#recipeData.servings;
  }

  setRecipeData(recipeData) {
    this.#recipeData = recipeData;
  }

  getRecipeData() {
    return this.#recipeData;
  }

  //unique
  #generateMarkup() {
    const bookMarkedStatus = this.#bookMarkedRecipes.some(
      el => el.id === this.#recipeData.id
    );

    const bookmarkedIcon =
      bookMarkedStatus === true ? 'icon-bookmark-fill' : 'icon-bookmark';

    const recipeKey = this.#recipeData.key;

    const recipeMarkUp = this.#recipeData
      ? `
    <figure class="recipe__fig">
      <img src="${this.#recipeData.imageUrl}" alt="${
          this.#recipeData.title
        }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this.#recipeData.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this.#recipeData.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon ${recipeKey ? '' : 'hidden'}">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this.#recipeData.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-current-servings="${
            this.#recipeData.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-current-servings="${
            this.#recipeData.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${recipeKey ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#${bookmarkedIcon}"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${this.#recipeData.ingredients
        .map(
          ing =>
            `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ing.quantity ? `${ing.quantity.toFixed(2)}g` : ''
              }</div>
              <div class="recipe__description">
                ${ing.description}
              </div>
            </li>`
        )
        .join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this.#recipeData.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this.#recipeData.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>`
      : `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>Start by searching for a recipe or an ingredient. Have fun!</p>
    </div>
    `;
    return recipeMarkUp;
  }

  render() {
    const recipeMarkUp = this.#generateMarkup();
    this.#clearRecipeContainer();
    this.#fillRecipeContainer(recipeMarkUp);
  }
}

const viewRecipe = new RecipeView();

module.exports = { viewRecipe };
