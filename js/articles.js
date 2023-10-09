import setCard from './articleCard.js';

let articlesList = [];
let articlesCategories = [];

function displayMessage(elementId, text) {
  const systemMessage = document.getElementById(elementId);
  systemMessage.style.display = 'block';
  const paragraph = document.createElement('p');
  const elementText = document.createTextNode(text);
  paragraph.appendChild(elementText);
  systemMessage.appendChild(paragraph);
}

const getArticlesList = async () => {
  try {
    const response = await fetch('../articles.json');

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    displayMessage('system-message', `Fetch error: ${error}`);
  }

  return [];
};

function extractUniqueCategories(jsonData) {
  const categories = [];

  jsonData.forEach((item) => {
    const { category } = item;
    if (!categories.includes(category)) {
      categories.push(category);
    }
  });

  return categories;
}

(async () => {
  try {
    articlesList = await getArticlesList();
    articlesCategories = extractUniqueCategories(articlesList);
  } catch (error) {
    displayMessage('system-message', `Error: ${error}`);
  }
})();

async function getArticle(articlePath) {
  const articleObject = articlesList.find(
    (article) => article.slug === articlePath,
  );

  if (typeof articleObject === 'undefined') {
    return null;
  }

  const articleURL = `../articles/${articleObject.filename}`;

  try {
    const response = await fetch(articleURL);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const htmlContent = await response.text();
    const articleContainer = document.getElementById('article-container');
    articleContainer.innerHTML = htmlContent;
  } catch (error) {
    displayMessage('system-message', `Fetch error: ${error}`);
  }

  return articleObject;
}

function filterByCategory(categoryIndex) {
  const category = articlesCategories[categoryIndex];

  if (typeof category === 'undefined') {
    return null;
  }

  const filteredArticles = articlesList.filter(
    (article) => article.category === category,
  );

  return filteredArticles;
}

function renderCards(filteredArticles, callback) {
  const articlesContainer = document.getElementById('articles-container');
  articlesContainer.innerHTML = '';

  for (let i = 0; i < filteredArticles.length; i += 1) {
    const article = filteredArticles[i];
    articlesContainer.innerHTML += setCard(article);
  }

  const cardLinks = document.getElementsByClassName('article-card-link');

  Array.from(cardLinks).forEach((link) => {
    link.addEventListener('click', callback);
  });
}

function renderArticlesList(searchValue, callback) {
  let filteredArticles = [];

  if (Number.isNaN(searchValue)) {
    filteredArticles = articlesList;
  } else {
    filteredArticles = filterByCategory(searchValue);

    if (filteredArticles === null) {
      filteredArticles = articlesList;
    }
  }

  renderCards(filteredArticles, callback);
}

function addLink(element, href, textContent, callback) {
  const newLink = document.createElement('a');
  newLink.href = href;
  newLink.textContent = textContent;
  newLink.addEventListener('click', callback);
  element.appendChild(newLink);
}

function renderCategoriesList(callback) {
  const categoryFilterContainer = document.getElementById(
    'articles-categories',
  );

  addLink(categoryFilterContainer, '/artigos', 'Todos', callback);

  articlesCategories.forEach((category) => {
    addLink(
      categoryFilterContainer,
      `/artigos?categoria=${articlesCategories.indexOf(category)}`,
      category,
      callback,
    );
  });
}

function searchArticles(callback, searchInput) {
  const foundArticles = [];

  articlesList.forEach((article) => {
    const title = article.title.toLowerCase();
    const description = article.description.toLowerCase();

    // Check if the search input matches the title or description
    if (title.includes(searchInput) || description.includes(searchInput)) {
      foundArticles.push(article);
    }

    if (foundArticles.length > 0) {
      renderCards(foundArticles, callback);
    } else {
      const articlesContainer = document.getElementById('articles-container');
      articlesContainer.innerHTML = '';
    }
  });
}

export {
  getArticlesList,
  getArticle,
  renderArticlesList,
  renderCategoriesList,
  filterByCategory,
  searchArticles,
};
