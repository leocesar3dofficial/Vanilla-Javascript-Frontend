import routes from './routes.js';
import {
  renderArticlesList,
  getArticle,
} from './articles.js';

const content = document.getElementById('content');
const pageDescription = document.querySelector('meta[name="description"]');

async function render404Template() {
  const html = await fetch(routes[404].template).then((data) => data.text());
  document.title = routes[404].title;
  pageDescription.setAttribute('content', routes[404].description);
  content.innerHTML = html;
}

function performAction(path) {
  switch (path) {
    case routes['/artigos']: {
      const categoriaParam = parseInt(
        new URLSearchParams(window.location.search).get('categoria'),
        10,
      );

      renderArticlesList(categoriaParam);
      break;
    }
    case routes['/artigo']: {
      const articleTitle = window.location.pathname.split('/')[2];

      getArticle(articleTitle).then((article) => {
        if (article === null) {
          render404Template();
        }
      });

      break;
    }
    default:
      break;
  }
}

async function handlePath() {
  const path = window.location.pathname;
  const pathnameFirstPart = path.split('/')[1];
  const match = routes[`/${pathnameFirstPart}`] || routes[404];
  const html = await fetch(match.template).then((data) => data.text());
  document.title = match.title;
  pageDescription.setAttribute('content', match.description);
  content.innerHTML = html;
  performAction(match);
}

// listen to every link clicked in the SPA and direct its action to the router
document.addEventListener('click', (event) => {
  const linkElement = event.target.closest('a');

  if (!linkElement) {
    return;
  }

  const isBlankLink = linkElement.getAttribute('target') === '_blank';

  if (isBlankLink) {
    return;
  }

  event.preventDefault();
  const linkHref = linkElement.getAttribute('href');
  window.history.pushState({}, '', linkHref);
  handlePath();
});

// fired when back or forward button on browser is pressed
window.onpopstate = handlePath;

export default handlePath;
