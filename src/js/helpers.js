import { REQUEST_TIMEOUT_IN_SECS } from './configuration';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

async function getJSON(url) {
  try {
    const fetchData = fetch(url);
    const search = await Promise.race([
      fetchData,
      timeout(REQUEST_TIMEOUT_IN_SECS),
    ]);

    const response = await search.json();

    if (response.status === 'fail')
      throw new Error(`request fail because of ${response.message}`);

    let data = response.data?.recipe || response.data.recipes;

    return data;
  } catch (error) {
    throw error;
  }
}

async function postJSON(url, recipedata) {
  try {
    const sendData = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipedata),
    });
    const returnedData = await Promise.race([
      sendData,
      timeout(REQUEST_TIMEOUT_IN_SECS),
    ]);

    const response = await returnedData.json();

    if (response.status === 'fail')
      throw new Error(`request fail because of ${response.message}`);

    let data = response.data?.recipe || response.data.recipes;

    return data;
  } catch (error) {
    throw error;
  }
}

function switchRecipeData(passedData, returnedType) {
  if (!returnedType) return;

  if (returnedType !== 'appData' && returnedType !== 'serverData')
    return `the {returnedType} parameter can only be either "appData" || "serverData"`;

  if (returnedType === 'appData') {
    const {
      cooking_time: cookingTime,
      id,
      image_url: imageUrl,
      ingredients,
      publisher,
      servings,
      source_url: sourceUrl,
      title,
      key,
    } = passedData;

    const recipeData = {
      cookingTime,
      id,
      imageUrl,
      ingredients,
      publisher,
      servings,
      sourceUrl,
      title,
      key,
      bookmarked: false,
    };

    return recipeData;
  }

  if (returnedType === 'serverData') {
    const {
      cookingTime: cooking_time,
      imageUrl: image_url,
      ingredients,
      publisher,
      servings,
      sourceUrl: source_url,
      title,
    } = passedData;

    const recipeData = {
      cooking_time,
      image_url,
      ingredients,
      publisher,
      servings,
      source_url,
      title,
    };

    return recipeData;
  }
}

module.exports = { getJSON, postJSON, switchRecipeData };
