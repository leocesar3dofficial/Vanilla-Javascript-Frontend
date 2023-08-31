function performAction(state) {
  switch (state) {
    case routes["/artigos"]:
      renderArticlesList();
      break;
    case routes["/artigo"]:
      const articleTitle = window.location.pathname.split("/")[2];
      getArticle(articleTitle);
      break;
    default:
      break;
  }
}
