import user from "../js/services/user.js";
import showError from "./utils/showError.js";
import formatter from "./utils/formatter.js";
import app from "./config.js";

const { host, port, token } = app;
const failMessage = document.querySelector(".fail-msg");
const form = document.querySelector(".login-form");
const login = document.querySelector("#login");
const password = document.querySelector("#password");
const resetPWLink = document.querySelector(".reset-pw-link");
const resetPWDiv = document.querySelector(".reset-pw-div");
const loginBtn = document.querySelector(".login-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const requestData = {
    body: {
      login: formatter(login.value),
      password: formatter(password.value),
    },
    path: "login",
    method: "POST",
  };

  try {
    const response = await user.send(requestData);
    const data = await response.json();

    if (response.status >= 400) {
      failMessage.innerText = data.message;
      failMessage.style.display = "block";
      setTimeout(() => {
        failMessage.style.display = "none";
      }, 4000);
      return;
    }

    localStorage.setItem(token, data.token);
    location.href =
      data.user.role === "user"
        ? `http://${host}:${port}/lobby`
        : `http://${host}:${port}/admin`;
  } catch (error) {
    showError(error);
  }
});

resetPWLink.addEventListener("click", (e) => {
  e.preventDefault();
  [];
  if (resetPWDiv.style.display === "none") {
    resetPWDiv.style.display = "block";
    loginBtn.style.display = "none";

    const PWResetInput = document.querySelector("#pw-reset-input");
    const checkMessage = document.querySelector(".check-message");

    document
      .querySelector(".pw-reset-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const requestData = {
          body: {
            email: formatter(PWResetInput.value),
          },
          path: "password-reset-link",
          method: "POST",
        };

        try {
          const response = await user.send(requestData);
          const data = await response.json();

          checkMessage.innerText = data.message;
          checkMessage.style.display = "block";

          setTimeout(() => {
            checkMessage.style.display = "none";
          }, 2000);
        } catch (error) {
          showError(error);
        }
      });
  } else {
    resetPWDiv.style.display = "none";
    loginBtn.style.display = "block";
  }
});
