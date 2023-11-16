import icons from 'url:../../img/icons.svg';

class DisplaySearchResultView {
  #parentContainer = document.querySelector('.results');
  #recipeData;
  #errorMessage = `sorry we couldn't successfully fetch your recipe, please check and confirm your input then try again`;
  #currentPage = 1;
  #rceipePaginatedData = [];
  #recipePaginatedDataNumberPerPage = 10;
  #totalNumberOfPage = 1;

  #clearRecipeContainer() {
    this.#parentContainer.innerHTML = '';
  }

  #fillRecipeContainer(markUp) {
    this.#parentContainer.insertAdjacentHTML('afterbegin', markUp);
  }

  showLoadingSpinner() {
    const spinnerMarkUp = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div> 
  `;

    this.#clearRecipeContainer();
    this.#fillRecipeContainer(spinnerMarkUp);
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

  setRecipeData(recipeData) {
    this.#recipeData = recipeData;
    this.#totalNumberOfPage = Math.ceil(
      this.#recipeData.length / this.#recipePaginatedDataNumberPerPage
    );
  }

  getRecipeData() {
    return this.#recipeData;
  }

  resetCurrentPage() {
    this.#currentPage = 1;
  }

  setCurrentPage(goToPage) {
    this.#currentPage = goToPage;
    this.render();
  }

  #setRecipePaginatedData() {
    const start =
      (this.#currentPage - 1) * this.#recipePaginatedDataNumberPerPage;

    const end = this.#currentPage * this.#recipePaginatedDataNumberPerPage;

    this.#rceipePaginatedData = this.#recipeData.slice(start, end);
  }

  returnPaginationViewData() {
    const paginationViewData = {
      currentPage: this.#currentPage,
      totalNumberOfData: this.#recipeData.length,
      dataPerPage: this.#recipePaginatedDataNumberPerPage,
      totalNumberOfPage: this.#totalNumberOfPage,
    };

    return paginationViewData;
  }

  #generateMarkup() {
    this.showLoadingSpinner();

    let searchResultMarkup;

    if (
      !this.#recipeData ||
      (Array.isArray(this.#recipeData) && this.#recipeData.length === 0)
    )
      searchResultMarkup = `
        <div class="message">
            <div>
            <svg>
                <use href="${icons}#icon-smile"></use>
            </svg>
            </div>
            <p>We couldn't find a result for the recipe you are trying to search please search for another recipe</p>
        </div>
    `;
    if (this.#recipeData.length > 0) {
      this.#setRecipePaginatedData();
      searchResultMarkup = this.#constructMarkup(this.#rceipePaginatedData);
    }

    return searchResultMarkup;
  }

  #constructMarkup(information) {
    const locationHash = window.location.hash.slice(1);

    return information
      .map(
        data => `
    <li class="preview">
        <a class="preview__link ${
          locationHash === data.id ? 'preview__link--active' : ''
        }"  href="#${data.id}">
        <figure class="preview__fig">
            <img src="${data.imageUrl}" alt="${data.imageUrl}" />
        </figure>
        <div class="preview__data">
            <h4 class="preview__title">${data.title}</h4>
            <p class="preview__publisher">${data.publisher}</p>
            <div class="preview__user-generated ${data.key ? '' : 'hidden'}">
              <svg>
                  <use href="${icons}#icon-user"></use>
              </svg>
            </div>
        </div>
        </a>
    </li>
`
      )
      .join('');
  }

  render() {
    const recipeMarkUp = this.#generateMarkup();
    this.#clearRecipeContainer();
    this.#fillRecipeContainer(recipeMarkUp);
  }
}

const displaySearchResultView = new DisplaySearchResultView();

module.exports = { displaySearchResultView };
