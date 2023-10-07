import routes from './routes.js';
import {
  renderCategoriesList,
  renderArticlesList,
  getArticle,
} from './articles.js';

const menu = document.getElementById('menu');
const content = document.getElementById('content');
const pageDescription = document.querySelector('meta[name="description"]');

async function render404Template() {
  const html = await fetch(routes[404].template).then((data) => data.text());
  document.title = routes[404].title;
  pageDescription.setAttribute('content', routes[404].description);
  content.innerHTML = html;
}

function performAction(path, callback) {
  switch (path) {
    case routes['/artigos']: {
      renderCategoriesList(callback);
      const categoriaParam = parseInt(
        new URLSearchParams(window.location.search).get('categoria'),
        10,
      );
      renderArticlesList(categoriaParam, callback);
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

async function handlePath(callback) {
  const path = window.location.pathname;
  const pathnameFirstPart = path.split('/')[1];
  const match = routes[`/${pathnameFirstPart}`] || routes[404];
  const html = await fetch(match.template).then((data) => data.text());
  document.title = match.title;
  pageDescription.setAttribute('content', match.description);
  content.innerHTML = html;
  performAction(match, callback);
}

// executed when a link with a click event listener points here
const route = (event) => {
  event.preventDefault();
  window.history.pushState({}, '', event.currentTarget.href);
  handlePath(route);
};

Array.from(menu.children).forEach((element) => {
  element.querySelector('a').addEventListener('click', route);
});

function initRouter() {
  handlePath(route);
}

// fired when back or forward button on browser is pressed
window.onpopstate = handlePath;

export default initRouter;
