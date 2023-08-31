const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

const prefersDarkMode = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

if (prefersDarkMode) {
  body.setAttribute("data-theme", "dark");
} else {
  body.setAttribute("data-theme", "light");
}

themeToggle.addEventListener("click", () => {
  if (body.getAttribute("data-theme") === "light") {
    body.setAttribute("data-theme", "dark");
  } else if (body.getAttribute("data-theme") === "dark") {
    body.setAttribute("data-theme", "light");
  }
});
