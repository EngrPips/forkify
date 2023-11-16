import icons from 'url:../../img/icons.svg';

class BookMarkView {
  #parentContainer = document.querySelector('.bookmarks__list');
  #recipeData = [];
  #defaultMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;

  #clearRecipeContainer() {
    this.#parentContainer.innerHTML = '';
  }

  #fillRecipeContainer(markUp) {
    this.#parentContainer.insertAdjacentHTML('afterbegin', markUp);
  }

  renderDefaultMessage(message = this.#defaultMessage) {
    const markUp = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}icon-smile"></use>
                </svg>
            </div>
            <p>
                ${message}
            </p>
         </div>
    `;

    this.#clearRecipeContainer();
    this.#fillRecipeContainer(markUp);
  }

  setRecipeData(recipeData) {
    this.#recipeData = recipeData;
  }

  #generateMarkup() {
    let bookMarkMarkup;

    if (
      !this.#recipeData ||
      (Array.isArray(this.#recipeData) && this.#recipeData.length === 0)
    )
      bookMarkMarkup = `
      <div class="message">
      <div>
          <svg>
              <use href="${icons}icon-smile"></use>
          </svg>
      </div>
      <p>
          ${this.#defaultMessage}
      </p>
   </div>
    `;
    if (this.#recipeData.length > 0) {
      bookMarkMarkup = this.#constructMarkup(this.#recipeData);
    }

    return bookMarkMarkup;
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

const bookMarkView = new BookMarkView();
module.exports = { bookMarkView };
