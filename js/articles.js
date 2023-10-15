import Pagination from './pagination.js';

let articlesList = [];
let articlesCategories = [];
let filteredArticles = [];

const itemsPerPage = 3;
let currentPage = 1;

function displayMessage(elementId, text) {
  const systemMessage = document.getElementById(elementId);
  systemMessage.style.display = 'block';
  const paragraph = document.createElement('p');
  const elementText = document.createTextNode(text);
  paragraph.appendChild(elementText);
  systemMessage.appendChild(paragraph);
}

function setCard(article) {
  const dateModified = new Date(article.dateModified);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = dateModified.toLocaleDateString('pt-BR', options);
  const htmlSnippet = `
    <div class="article-card">
      <a href="/artigo/${article.slug}">
        <img src="${article.image}" alt="foto do artigo"/>
      </a>
      <div class="card-content">
        <h2>${article.title}</h2>
        <h3>${article.category}</h3>
        <p>${article.description}</p>
        <h4>${formattedDate}</h4>
      </div>
    </div>
  `;

  return htmlSnippet;
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
const onPageChange = (page) => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  currentPage = page;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  renderCards(filteredArticles.slice(startIndex, endIndex));
};

function paginate(articlesLength) {
  const paginationElement = document.getElementById('pagination');
  const totalPages = Math.ceil(articlesLength / itemsPerPage);
  // eslint-disable-next-line no-unused-vars
  const pagination = new Pagination(paginationElement, totalPages, currentPage, onPageChange);
}

function searchArticles(searchInput) {
  const foundArticles = [];

  articlesList.forEach((article) => {
    const title = article.title.toLowerCase();
    const description = article.description.toLowerCase();

    if (title.includes(searchInput) || description.includes(searchInput)) {
      foundArticles.push(article);
    }
  });

  if (foundArticles.length > 0) {
    filteredArticles = foundArticles;
    currentPage = 1;
    renderCards(filteredArticles.slice(0, itemsPerPage));
    paginate(foundArticles.length);
  } else {
    filteredArticles = [];
    const articlesContainer = document.getElementById('articles-container');
    articlesContainer.innerHTML = '<h2>Nenhum artigo encontrado.</h2>';
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';
  }
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
  // eslint-disable-next-line no-console
  console.log(articlesList.length); // remover depois lalall
  let articlesLength = 0;
  currentPage = 1;
  const searchInput = document.getElementById('search-input');

  searchInput.addEventListener('input', () => {
    searchArticles(searchInput.value.trim().toLowerCase());
  });

  if (Number.isNaN(categoryIndex)) {
    filteredArticles = articlesList;
    articlesLength = articlesList.length;
  } else {
    filteredArticles = filterByCategory(categoryIndex);

    if (filteredArticles === null) {
      filteredArticles = articlesList;
      articlesLength = articlesList.length;
    } else {
      articlesLength = filteredArticles.length;
    }
  }

  renderCategoriesList();
  renderCards(filteredArticles.slice(0, itemsPerPage));
  paginate(articlesLength);
}

export {
  getArticlesList,
  getArticle,
  renderArticlesList,
};
