import icons from 'url:../../img/icons.svg';

class AddRecipeView {
  #overlay = document.querySelector('.overlay');
  #addRecipeContainer = document.querySelector('.add-recipe-window');
  #parentContainer = document.querySelector('.upload');
  #showAddRecipeButton = document.querySelector('.nav__btn--add-recipe');
  #closeAddRecipeButton = document.querySelector('.btn--close-modal');
  #successMessage = `You have successfully uploaded your recipe to the server`;
  #defaultMarkUp = `
  <div class="upload__column">
    <h3 class="upload__heading">Recipe data</h3>
    <label>Title</label>
    <input value="TESTING" required name="title" type="text" />
    <label>URL</label>
    <input value="TESTING" required name="sourceUrl" type="text" />
    <label>Image URL</label>
    <input value="TESTING" required name="image" type="text" />
    <label>Publisher</label>
    <input value="TESTING" required name="publisher" type="text" />
    <label>Prep time</label>
    <input value="23" required name="cookingTime" type="number" />
    <label>Servings</label>
    <input value="23" required name="servings" type="number" />
  </div>

<div class="upload__column">
    <h3 class="upload__heading">Ingredients</h3>
    <label>Ingredient 1</label>
    <input
      value="0.5,kg,Rice"
      type="text"
      required
      name="ingredient-1"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 2</label>
    <input
      value="1,,Avocado"
      type="text"
      name="ingredient-2"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 3</label>
    <input
      value=",,salt"
      type="text"
      name="ingredient-3"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 4</label>
    <input
      type="text"
      name="ingredient-4"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 5</label>
    <input
      type="text"
      name="ingredient-5"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 6</label>
    <input
      type="text"
      name="ingredient-6"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
  </div>

  <button class="btn upload__btn">
    <svg>
      <use href="src/img/icons.svg#icon-upload-cloud"></use>
    </svg>
    <span>Upload</span>
  </button>
  `;

  constructor() {
    this.handleRecipeMarkUp();
  }

  addGetAddRecipeFormDetailsHandler(handler) {
    this.#parentContainer.addEventListener('submit', async function (e) {
      try {
        e.preventDefault();
        const formDataArray = [...new FormData(this)];
        const formData = Object.fromEntries(formDataArray);
        await handler(formData);
      } catch (error) {
        console.log(error);
      }
    });
  }

  handleRecipeMarkUp() {
    this.#showAddRecipeButton.addEventListener(
      'click',
      this.showAddRecipeMarkUp.bind(this)
    );

    this.#overlay.addEventListener('click', this.hideRecipeMarkUp.bind(this));

    this.#closeAddRecipeButton.addEventListener(
      'click',
      this.hideRecipeMarkUp.bind(this)
    );
  }

  showAddRecipeMarkUp() {
    this.#overlay.classList.toggle('hidden');
    this.#addRecipeContainer.classList.toggle('hidden');
  }

  hideRecipeMarkUp() {
    this.#overlay.classList.toggle('hidden');
    this.#addRecipeContainer.classList.toggle('hidden');
    this.#clearRecipeContainer();
    this.#fillRecipeContainer(this.#defaultMarkUp);
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

  renderErrorMessage(message) {
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

  renderSuccessMessage(message = this.#successMessage) {
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
}

const addRecipeView = new AddRecipeView();

module.exports = { addRecipeView };
