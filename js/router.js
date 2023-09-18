import { routes } from "./routes.js";
import { performAction } from "./states.js";

const menu = document.getElementById("menu");
const content = document.getElementById("content");
const pageDescription = document.querySelector('meta[name="description"]');

const route = (event) => {
  event.preventDefault();
  window.history.pushState({}, "", event.currentTarget.href);
  handlePath();
};

for (const item of menu.children) {
  item.querySelector("a").addEventListener("click", route);
}

const handlePath = async () => {
  const path = window.location.pathname;
  const pathnameFirstPart = path.split("/")[1];
  const match = routes["/" + pathnameFirstPart] || routes[404];
  const html = await fetch(match.template).then((data) => data.text());
  document.title = match.title;
  pageDescription.setAttribute("content", match.description);
  content.innerHTML = html;
  performAction(match);
};

async function render404Template() {
  const html = await fetch(routes[404].template).then((data) => data.text());
  document.title = routes[404].title;
  pageDescription.setAttribute("content", routes[404].description);
  content.innerHTML = html;
}

// fired when back or forward button on browser is pressed
window.onpopstate = handlePath;
handlePath();

export { route, handlePath, render404Template };
