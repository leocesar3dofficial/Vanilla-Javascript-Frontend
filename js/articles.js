let articlesList = [];
let articlesCategories = [];

const getArticlesList = async () => {
  try {
    const response = await fetch("../articles.json");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

(async () => {
  try {
    articlesList = await getArticlesList();
    articlesCategories = extractUniqueCategories(articlesList);
  } catch (error) {
    console.error("Error:", error);
  }
})();

async function getArticle(articlePath) {
  const articleDescription = articlesList.find(
    (article) => article.slug === articlePath
  );

  if (typeof articleDescription === "undefined") {
    render404Template();
    return;
  }

  const articleURL = `../articles/${articleDescription.filename}`;

  try {
    const response = await fetch(articleURL);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const htmlContent = await response.text();
    const articleContainer = document.getElementById("article-container");
    articleContainer.innerHTML = htmlContent;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function renderArticlesList(searchValue) {
  const articlesContainer = document.getElementById("articles-container");
  let filteredArticles = [];

  if (isNaN(searchValue)) {
    filteredArticles = articlesList;
  } else {
    filteredArticles = filterByCategory(searchValue);
  }

  for (let i = 0; i < filteredArticles.length; i++) {
    const article = filteredArticles[i];
    articlesContainer.innerHTML += setCard(article);
  }

  const cardLinks = document.getElementsByClassName("article-card-link");

  for (const link of cardLinks) {
    link.addEventListener("click", route);
  }
}

function extractUniqueCategories(jsonData) {
  const categories = [];

  jsonData.forEach((item) => {
    const category = item.category;
    if (!categories.includes(category)) {
      categories.push(category);
    }
  });

  return categories;
}

function renderCategoiesList() {
  const categoryFilterContainer = document.getElementById(
    "articles-categories"
  );

  addLink(categoryFilterContainer, "/artigos", "Todos os artigos");

  articlesCategories.forEach((category) => {
    addLink(
      categoryFilterContainer,
      `/artigos/?categoria=${articlesCategories.indexOf(category)}`,
      category
    );
  });
}

function addLink(element, href, textContent) {
  const newLink = document.createElement("a");
  newLink.href = href;
  newLink.textContent = textContent;
  newLink.addEventListener("click", route);
  element.appendChild(newLink);
}

function filterByCategory(categoryIndex) {
  const category = articlesCategories[categoryIndex];

  if (category == "undefined") {
    render404Template();
    return [];
  } else {
    const filteredArticles = articlesList.filter(
      (article) => article.category === category
    );

    return filteredArticles;
  }
}
