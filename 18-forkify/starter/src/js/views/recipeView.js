import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class RecipeView {
  #parentElement = document.querySelector('.recipe');
  #data;
  #errorMessage = `We couldn't find that recipe :(\nPlease try another one`;
  #message = '';
  constructor() {}

  updateAndRender(data) {
    this.#data = data;
    this.#render();
  }
  #render() {
    const markup = this.#generateMarkup(this.#data);
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  #generateMarkup(recipe) {
    return `
		<figure class="recipe__fig">
			<img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
			<h1 class="recipe__title">
				<span>${recipe.title}</span>
			</h1>
		</figure>

		<div class="recipe__details">
			<div class="recipe__info">
				<svg class="recipe__info-icon">
					<use href="${icons}#icon-clock"></use>
				</svg>
				<span class="recipe__info-data recipe__info-data--minutes">${
          recipe.cookingTime
        }</span>
				<span class="recipe__info-text">minutes</span>
			</div>
			<div class="recipe__info">
				<svg class="recipe__info-icon">
					<use href="${icons}#icon-users"></use>
				</svg>
				<span class="recipe__info-data recipe__info-data--people">${
          recipe.servings
        }</span>
				<span class="recipe__info-text">servings</span>

				<div class="recipe__info-buttons">
					<button class="btn--tiny btn--increase-servings">
						<svg>
							<use href="${icons}#icon-minus-circle"></use>
						</svg>
					</button>
					<button class="btn--tiny btn--increase-servings">
						<svg>
							<use href="${icons}#icon-plus-circle"></use>
						</svg>
					</button>
				</div>
			</div>

			<div class="recipe__user-generated">
				<svg>
					<use href="${icons}#icon-user"></use>
				</svg>
			</div>
			<button class="btn--round">
				<svg class="">
					<use href="${icons}#icon-bookmark-fill"></use>
				</svg>
			</button>
		</div>

		<div class="recipe__ingredients">
			<h2 class="heading--2">Recipe ingredients</h2>
			<ul class="recipe__ingredient-list">
				${recipe.ingredients.map(ing => this.#generateIngredientsMarkup(ing)).join('')}
			</ul>
		</div>

		<div class="recipe__directions">
			<h2 class="heading--2">How to cook it</h2>
			<p class="recipe__directions-text">
				This recipe was carefully designed and tested by
				<span class="recipe__publisher">${recipe.publisher}</span>. Please check out
				directions at their website.
			</p>
			<a
				class="btn--small recipe__btn"
				href="${recipe.source}"
				target="_blank"
			>
				<span>Directions</span>
				<svg class="search__icon">
					<use href="${icons}#icon-arrow-right"></use>
				</svg>
			</a>
		</div>
`;
  }
  #generateIngredientsMarkup(ing) {
    return `
		<li class="recipe__ingredient">
			<svg class="recipe__icon">
				<use href="${icons}#icon-check"></use>
			</svg>
			<div class="recipe__quantity">${
        ing.quantity ? new Fraction(ing.quantity).toString() : ''
      }</div>
			<div class="recipe__description">
				<span class="recipe__unit">${ing.unit}</span>
				${ing.description}
			</div>
		</li>`;
  }
  #clear() {
    this.#parentElement.innerHTML = '';
  }
  renderSpiner() {
    const markup = `
		<div class="spinner">
			<svg>
				<use href="${icons}#icon-loader"></use>
			</svg>
		</div>`;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this.#errorMessage) {
    const markup = `<div class="error">
		<div>
			<svg>
				<use href="src/img/${icons}.svg#icon-alert-triangle"></use>
			</svg>
		</div>
		<p>${message}</p>
	</div>`;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this.#message) {
    const markup = `<div class="recipe">
		<div class="message">
			<div>
				<svg>
					<use href="src/img/${icons}.svg#icon-smile"></use>
				</svg>
			</div>
			<p>Start by searching for a recipe or an ingredient. Have fun!</p>
		</div>`;
  }

  //This method is part of the public API of the class because it needs to be called by the controller
  //for it to subscribe to events
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(windowEvent =>
      window.addEventListener(windowEvent, handler)
    );
  }
}

export default new RecipeView();
