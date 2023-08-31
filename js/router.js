const navigation = document.getElementById("navigation");
const content = document.getElementById("content");
const pageDescription = document.querySelector('meta[name="description"]');

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.currentTarget.href);
  handlePath();
};

for (const link of navigation.children) {
  link.addEventListener("click", route);
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

// window.onpopstate = handlePath;
window.addEventListener("popstate", function (event) {
  handlePath();
});

handlePath();
