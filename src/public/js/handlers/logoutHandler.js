import { app } from "../config.js";
import jumpToStartPage from "../utils/jumpToStartPage.js";
import showError from "../utils/showError.js";

const { token } = app;

export default function logoutListener() {
  document.querySelector(".logout").addEventListener("click", async () => {
    try {
      localStorage.removeItem(token);
      jumpToStartPage();
    } catch (error) {
      showError(error);
    }
  });
}
