import setCard from './articleCard.js';
import Pagination from './pagination.js';

let articlesList = [];
let articlesCategories = [];
let filteredArticles = [];

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

  const articlesInCategory = articlesList.filter(
    (article) => article.category === category,
  );

  return articlesInCategory;
}

function renderCards(list) {
  const articlesContainer = document.getElementById('articles-container');
  articlesContainer.innerHTML = '';

  for (let i = 0; i < list.length; i += 1) {
    const article = list[i];
    articlesContainer.innerHTML += setCard(article);
  }
}

function searchArticles(searchInput) {
  const foundArticles = [];

  articlesList.forEach((article) => {
    const title = article.title.toLowerCase();
    const description = article.description.toLowerCase();

    // Check if the search input matches the title or description
    if (title.includes(searchInput) || description.includes(searchInput)) {
      foundArticles.push(article);
    }

    if (foundArticles.length > 0) {
      filteredArticles = foundArticles;
      renderCards(filteredArticles);
    } else {
      filteredArticles = [];
      const articlesContainer = document.getElementById('articles-container');
      articlesContainer.innerHTML = '<h2>Nenhum artigo encontrado.</h2>';
    }
  });
}

function paginate() {
  const searchInput = document.getElementById('search-input');

  searchInput.addEventListener('input', () => {
    searchArticles(searchInput.value.trim().toLowerCase());
  });

  const containerElement = document.getElementById('paginator'); // Replace with your container element
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const currentPage = 1; // Replace with the current page number

  const onPageChange = (page) => {
    // Handle page change (e.g., fetch and display new data)
    console.log(`Page changed to: ${page}`);
  };

  // eslint-disable-next-line no-unused-vars
  const pagination = new Pagination(containerElement, totalPages, currentPage, onPageChange);
}

function addLink(element, href, textContent) {
  const newLink = document.createElement('a');
  newLink.href = href;
  newLink.textContent = textContent;
  element.appendChild(newLink);
}

function renderCategoriesList() {
  const categoryFilterContainer = document.getElementById(
    'articles-categories',
  );

  addLink(categoryFilterContainer, '/artigos', 'Todos');

  articlesCategories.forEach((category) => {
    addLink(
      categoryFilterContainer,
      `/artigos?categoria=${articlesCategories.indexOf(category)}`,
      category,
    );
  });
}

function renderArticlesList(categoryIndex) {
  if (Number.isNaN(categoryIndex)) {
    filteredArticles = articlesList;
  } else {
    filteredArticles = filterByCategory(categoryIndex);

    if (filteredArticles === null) {
      filteredArticles = articlesList;
    }
  }

  renderCategoriesList();
  renderCards(filteredArticles);
  paginate();
}

export {
  getArticlesList,
  getArticle,
  renderArticlesList,
};
