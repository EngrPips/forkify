import icons from 'url:../../img/icons.svg';

class PaginationView {
  #parentContainer = document.querySelector('.pagination');
  #paginationData = {
    currentPage: 0,
    totalNumberOfData: 0,
    dataPerPage: 0,
    totalNumberOfPage: 1,
  };

  #clearPaginationContainer() {
    this.#parentContainer.innerHTML = '';
  }

  #fillPaginationContainer(markUp) {
    this.#parentContainer.insertAdjacentHTML('afterbegin', markUp);
  }

  setPaginationData(data) {
    this.#paginationData = data;
  }

  // computePaginationDatatotalNumberOfPage() {
  //   const totalNumberOfPage =
  //     this.#paginationData.totalNumberOfData / this.#paginationData.dataPerPage;

  //   this.#paginationData.totalNumberOfPage = totalNumberOfPage;
  // }

  addPaginationHandler(controller) {
    let goToPage;
    this.#parentContainer.addEventListener('click', function (e) {
      const activeElement = e.target.closest('.btn--inline');
      if (!activeElement) return;
      goToPage = +activeElement.dataset.goto;
      controller(goToPage);
    });
  }

  #generateMarkup() {
    if (
      this.#paginationData.currentPage === 1 &&
      this.#paginationData.currentPage < this.#paginationData.totalNumberOfPage
    ) {
      return `
            <button data-goto="${
              this.#paginationData.currentPage + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${this.#paginationData.currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
      
      `;
    }

    if (
      this.#paginationData.currentPage > 1 &&
      this.#paginationData.currentPage < this.#paginationData.totalNumberOfPage
    ) {
      return `
        <button data-goto="${
          this.#paginationData.currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this.#paginationData.currentPage - 1}</span>
        </button>
        <button data-goto="${
          this.#paginationData.currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${this.#paginationData.currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
         </button>
        `;
    }

    if (
      this.#paginationData.currentPage ===
      this.#paginationData.totalNumberOfPage
    ) {
      return `
        <button data-goto="${
          this.#paginationData.currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this.#paginationData.currentPage - 1}</span>
        </button>
        `;
    }

    if (
      this.#paginationData.currentPage === 1 &&
      this.#paginationData.currentPage ===
        this.#paginationData.totalNumberOfPage
    ) {
      return;
    }
  }

  render() {
    const markUp = this.#generateMarkup();
    this.#clearPaginationContainer();
    this.#fillPaginationContainer(markUp);
  }
}

const paginationView = new PaginationView();

module.exports = { paginationView };
