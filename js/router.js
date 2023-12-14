import routes from './routes.js';
import {
  renderArticlesList,
  getArticle,
} from './articles.js';

const loadedCustomFiles = [];
const { head } = document;
const content = document.getElementById('content');
const pageDescription = document.querySelector('meta[name="description"]');

function loadCustomCSS(filename) {
  if (loadedCustomFiles.indexOf(filename) !== -1) return;
  const style = document.createElement('link');
  style.href = filename;
  style.type = 'text/css';
  style.rel = 'stylesheet';
  head.append(style);
  loadedCustomFiles.push(filename);
}

function loadCustomScript(filename) {
  if (loadedCustomFiles.indexOf(filename) !== -1) return;
  const script = document.createElement('script');
  script.src = filename;
  script.type = 'text/javascript';
  head.append(script);
  loadedCustomFiles.push(filename);
}

async function render404Template() {
  const html = await fetch(routes[404].template).then((data) => data.text());
  document.title = routes[404].title;
  pageDescription.setAttribute('content', routes[404].description);
  content.innerHTML = html;
}

function performAction(path) {
  switch (path) {
    case routes['/']: {
      const actionElementsDiv = document.getElementById('lower');
      const buttons = actionElementsDiv.querySelectorAll('button');

      buttons[0].addEventListener('click', () => {
        loadCustomCSS('/css/custom/test.css');
      });

      buttons[1].addEventListener('click', () => {
        loadCustomScript('/js/custom/test.js');
      });

      break;
    }
    case routes['/artigos']: {
      const categoryParam = parseInt(
        new URLSearchParams(window.location.search).get('categoria'),
        10,
      );

      const subjectParam = parseInt(
        new URLSearchParams(window.location.search).get('assunto'),
        10,
      );

      renderArticlesList(subjectParam, categoryParam).then((articles) => {
        if (articles === null) {
          render404Template();
        }
      });

      break;
    }
    case routes['/artigo']: {
      const subjectParam = parseInt(
        new URLSearchParams(window.location.search).get('assunto'),
        10,
      );

      const articleTitle = new URLSearchParams(window.location.search).get('titulo');

      getArticle(subjectParam, articleTitle).then((article) => {
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
