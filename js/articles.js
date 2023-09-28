import setCard from './articleCard.js';

let articlesList = [];
let articlesCategories = [];

const getArticlesList = async () => {
  try {
    const response = await fetch('../articles.json');

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Fetch error:', error);
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
    console.error('Error:', error);
  }
})();

async function getArticle(articlePath) {
  const articleDescription = articlesList.find(
    (article) => article.slug === articlePath,
  );

  if (typeof articleDescription === 'undefined') {
    return null;
  }

  const articleURL = `../articles/${articleDescription.filename}`;

  try {
    const response = await fetch(articleURL);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const htmlContent = await response.text();
    const articleContainer = document.getElementById('article-container');
    articleContainer.innerHTML = htmlContent;
  } catch (error) {
    console.error('Fetch error:', error);
  }

  return null;
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

function renderArticlesList(searchValue, callback) {
  const articlesContainer = document.getElementById('articles-container');
  let filteredArticles = [];

  if (Number.isNaN(searchValue)) {
    filteredArticles = articlesList;
  } else {
    filteredArticles = filterByCategory(searchValue);
    if (filteredArticles === null) {
      filteredArticles = articlesList;
    }
  }

  for (let i = 0; i < filteredArticles.length; i += 1) {
    const article = filteredArticles[i];
    articlesContainer.innerHTML += setCard(article);
  }

  const cardLinks = document.getElementsByClassName('article-card-link');

  Array.from(cardLinks).forEach((link) => {
    link.addEventListener('click', callback);
  });
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

export {
  getArticlesList,
  getArticle,
  renderArticlesList,
  renderCategoriesList,
  filterByCategory,
};
