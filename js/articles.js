let articlesList = [];

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
  } catch (error) {
    console.error("Error:", error);
  }
})();

async function getArticle(articlePath) {
  const articleDescription = articlesList.find(
    (article) => article.slug === articlePath
  );

  if (typeof articleDescription === "undefined") {
    console.log("Article not found, do something!");
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

function renderArticlesList() {
  const articlesContainer = document.getElementById("articles-container");

  for (let i = 0; i < 5; i++) {
    const article = articlesList[i];
    articlesContainer.innerHTML += setCard(article);
  }
}
