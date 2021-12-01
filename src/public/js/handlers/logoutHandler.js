import { app } from "../config.js";
import auth from "../fetchServices/auth.js";
import jumpToStartPage from "../utils/jumpToStartPage.js";
import showError from "../utils/showError.js";
import { getToken } from "../utils/localStorage.js";

const { token } = app;

export default function logoutListener() {
  document.querySelector(".logout").addEventListener("click", async () => {
    try {
      const response = await auth.logout(getToken());

      if (response.status !== 200) throw new Error("Logout Error");

      jumpToStartPage();
      localStorage.removeItem(token);
    } catch (error) {
      showError(error);
    }
  });
}
