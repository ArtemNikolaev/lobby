import user from "../js/services/user.js";
import showError from "./utils/showError.js";
import formatter from "./utils/formatter.js";
import app from "./config.js";

const { host, port } = app;
const failMessage = document.querySelector(".fail-msg");
const form = document.querySelector(".login-form");
const login = document.querySelector("#login");
const password = document.querySelector("#password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    login: formatter(login.value),
    password: formatter(password.value),
  };

  try {
    const response = await user.sendData(loginData, "login");
    const data = await response.json();

    if (response.status >= 400) {
      failMessage.innerText = data.message;
      failMessage.style.display = "block";
      setTimeout(() => {
        failMessage.style.display = "none";
      }, 4000);
      return;
    }

    localStorage.setItem("lobby-token", data.token);
    location.href = `http://${host}:${port}/lobby`;
  } catch (error) {
    showError(error);
  }
});
