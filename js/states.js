function performAction(state) {
  switch (state) {
    case routes["/artigos"]:
      renderCategoiesList();
      const categoriaParam = parseInt(
        new URLSearchParams(window.location.search).get("categoria"),
        10
      );
      renderArticlesList(categoriaParam);
      break;
    case routes["/artigo"]:
      const articleTitle = window.location.pathname.split("/")[2];
      getArticle(articleTitle);
      break;
    default:
      break;
  }
}
