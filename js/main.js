// main.js
import { handlePath } from "./router.js"; // Import the necessary functions from your modules
import { enableThemes } from "./themes.js";

// Listen for the 'DOMContentLoaded' event to ensure the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Call the handlePath function to initialize your app
  handlePath();
  enableThemes();
});
