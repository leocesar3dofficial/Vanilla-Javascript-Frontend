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

// getArticlesList().then((articles) => {
//   if (articles) {
//     articlesList = articles;
//   } else {
//     console.log("Failed to fetch articles.");
//   }
// });

(async () => {
  try {
    articlesList = await getArticlesList();
    console.log("Data available:", articlesList);
  } catch (error) {
    console.error("Error:", error);
  }
})();

function getArticle(articlePath) {
  const articleDescription = articlesList.find(
    (article) => article.slug === articlePath
  );

  if (articleDescription === "undefined") {
    console.log("article not found, do something!");
    return;
  }

  const articleURL = `../articles/${articleDescription.filename}`;

  return fetch(articleURL).then((response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return response
      .text()
      .then((htmlContent) => {
        const articleContainer = document.getElementById("article-container");
        articleContainer.innerHTML = htmlContent;
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  });
}

function renderArticlesList() {
  const articlesContainer = document.getElementById("articles-container");

  for (let i = 0; i < 5; i++) {
    const article = articlesList[i];
    articlesContainer.innerHTML += setCard(article);
  }
}
