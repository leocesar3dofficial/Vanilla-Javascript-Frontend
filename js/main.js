import { handlePath } from "./router.js";
import { enableThemes } from "./themes.js";

document.addEventListener("DOMContentLoaded", () => {
  handlePath();
  enableThemes();
});
