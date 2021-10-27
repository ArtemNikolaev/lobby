import user from "../js/services/user.js";
import jumpToStartPage from "./utils/jumpToStartPage.js";
import showError from "./utils/showError.js";

const myId = document.querySelector("#id");
const myUsername = document.querySelector("#username");
const myEmail = document.querySelector("#email");
const logout = document.querySelector(".logout");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userData = await user.getUser();
    if (!userData) return jumpToStartPage();

    const { id, username, email } = userData;

    myId.innerText = id;
    myUsername.innerText = username;
    myEmail.innerText = email;
  } catch (error) {
    showError(error);
  }
});

logout.addEventListener("click", async () => {
  await user.logout();
});
