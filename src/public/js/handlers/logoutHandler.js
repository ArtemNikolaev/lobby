import { app } from "../config.js";
import auth from "../fetchServices/auth.js";
import jumpToStartPage from "../utils/jumpToStartPage.js";
import showError from "../utils/showError.js";
import { getToken } from "../utils/localStorage.js";

const { token } = app;

export default function logoutListener() {
  document.querySelector(".logout").addEventListener("click", async () => {
    try {
      await auth.logout(getToken());

      localStorage.removeItem(token);
      jumpToStartPage();
    } catch (error) {
      showError(error);
    }
  });
}
