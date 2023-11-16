import { API_URL, FORKIFY_API_KEY } from './configuration';
import { getJSON, postJSON, switchRecipeData } from './helpers';

const state = {
  recipeData: {},
  searchResult: {
    query: '',
    data: [],
  },
};

async function getRecipeData(recipeId) {
  // here we are fetching the data that we want to display on the user interface
  try {
    const data = await getJSON(`${API_URL}${recipeId}?key=${FORKIFY_API_KEY}`);
    const dataKey = data.key ? data.key : '';

    const {
      cooking_time: cookingTime,
      id,
      image_url: imageUrl,
      ingredients,
      publisher,
      servings,
      source_url: sourceUrl,
      title,
    } = data;

    const recipeData = {
      cookingTime,
      id,
      imageUrl,
      ingredients,
      publisher,
      servings,
      sourceUrl,
      title,
      key: dataKey,
    };
    console.log(recipeData.key);
    state.recipeData = recipeData;
  } catch (error) {
    throw error;
  }
}

async function getSearchResult(query) {
  try {
    const data = await getJSON(
      `${API_URL}?search=${query}&key=${FORKIFY_API_KEY}`
    );
    state.searchResult.query = query;

    const formatedData = data.map(el => {
      const dataKey = el.key ? el.key : '';
      const { id, image_url: imageUrl, publisher, title } = el;
      const object = { id, imageUrl, publisher, title, key: dataKey };
      return object;
    });
    state.searchResult.data = formatedData;
  } catch (error) {
    throw error;
  }
}

async function uploadRecipe(formData) {
  try {
    const ingredients = Object.entries(formData)
      .filter(
        ingredient => ingredient[0].startsWith('ingredient') && ingredient[1]
      )
      .map(ingredient => {
        const ingredientInfo = ingredient[1].trim().split(',');

        if (ingredientInfo.length !== 3)
          throw new Error(
            'Please fill the ingredients form with all stated fields'
          );

        let [quantity, unit, description] = ingredientInfo;
        quantity = +quantity;

        if (
          typeof description !== 'string' ||
          typeof quantity !== 'number' ||
          typeof unit !== 'string'
        )
          throw new Error(
            'Please fill the ingridents form fields with appropriate data'
          );

        return { quantity: quantity || null, unit: unit || null, description };
      });

    let appRecipeData = {
      cookingTime: +formData.cookingTime,
      imageUrl: formData.image,
      ingredients,
      publisher: formData.publisher,
      servings: +formData.servings,
      sourceUrl: formData.sourceUrl,
      title: formData.title,
    };
    const severRecipeData = switchRecipeData(appRecipeData, 'serverData');

    const serverReturnedData = await postJSON(
      `${API_URL}?key=${FORKIFY_API_KEY}`,
      severRecipeData
    );
    appRecipeData = switchRecipeData(serverReturnedData, 'appData');

    return appRecipeData;
  } catch (error) {
    throw error;
  }
}

module.exports = { state, getRecipeData, getSearchResult, uploadRecipe };
