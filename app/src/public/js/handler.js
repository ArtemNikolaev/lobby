import user from "../js/services/user.js";
import jumpToStartPage from "./utils/jumpToStartPage.js";
import showError from "./utils/showError.js";
import app from "./config.js";

const { token } = app;
const myId = document.querySelector("#id");
const myUsername = document.querySelector("#username");
const myEmail = document.querySelector("#email");
const myRole = document.querySelector("#role");

async function contentLoader(path) {
  try {
    const jwt = localStorage.getItem(token);

    const userData = await user.getUser(path, jwt);
    if (!userData) return jumpToStartPage();

    const { role, id, username, email } = userData;

    myRole.innerText = role;
    myId.innerText = id;
    myUsername.innerText = username;
    myEmail.innerText = email;
  } catch (error) {
    showError(error);
  }
}

async function logout() {
  try {
    const jwt = localStorage.getItem(token);
    const response = await user.logout(jwt);

    if (response.status !== 200) throw new Error("Logout Error");

    localStorage.removeItem(token);
  } catch (error) {
    showError(error);
  }
}

export { contentLoader, logout };
