import user from "../js/services/user.js";
import showError from "./utils/showError.js";
import app from "./config.js";

const { token } = app;
const failMessage = document.querySelector(".fail-msg");
const form = document.querySelector(".login-form");
const resetPWLink = document.querySelector(".reset-pw-link");
const resetPWDiv = document.querySelector(".reset-pw-div");
const loginBtn = document.querySelector(".login-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const requestData = {
    body: {
      login: data.get("login"),
      password: data.get("password"),
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
    location.href = data.user.role === "user" ? "/lobby" : "/admin";
  } catch (error) {
    showError(error);
  }
});

resetPWLink.addEventListener("click", (e) => {
  e.preventDefault();
  resetPWDiv.classList.toggle("hidden");

  if (!resetPWDiv.classList.contains("hidden")) {
    loginBtn.classList.add("hidden");

    const checkMessage = document.querySelector(".check-message");
    const form = document.querySelector(".pw-reset-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);

      const requestData = {
        body: {
          email: data.get("email"),
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
    loginBtn.classList.remove("hidden");
  }
});
