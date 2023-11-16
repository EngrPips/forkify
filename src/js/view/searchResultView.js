class SearchResultView {
  #parentElement = document.querySelector('.search');
  #searchElement = this.#parentElement.querySelector('.search__field');

  #clearSearchElementInput() {
    this.#searchElement.value = '';
  }

  getQueryString() {
    const queryString = this.#searchElement.value;
    this.#clearSearchElementInput();
    return queryString;
  }

  addSearchHandler(controller) {
    this.#parentElement.addEventListener('submit', async function (e) {
      e.preventDefault();
      await controller();
    });
  }
}

const searchRecipe = new SearchResultView();

module.exports = { searchRecipe };
