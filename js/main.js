import { handlePath } from "./router.js";
import { enableThemes } from "./themes.js";

if (!window["import"] === false) {
  document.getElementById("module-support-warning").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  handlePath();
  enableThemes();
});
