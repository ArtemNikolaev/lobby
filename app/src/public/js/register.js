import user from "./services/user.js";
import formatter from "./utils/formatter.js";
import app from "./config.js";
import showError from "./utils/showError.js";

const { host, port } = app;
const errMessage = document.querySelector(".fail-msg");
const form = document.querySelector(".register-form");
const name = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const passwordConfirm = document.querySelector("#password_confirm");
const confimMessage = document.querySelector(".confirm-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (password.value !== passwordConfirm.value) {
    confimMessage.innerText = "Password mismatch!";
    confimMessage.style.color = "red";
    return;
  }

  const requestData = {
    body: {
      username: formatter(name.value),
      email: formatter(email.value),
      password: formatter(password.value),
    },
    path: "register",
    method: "POST",
  };

  try {
    const response = await user.send(requestData);
    const data = await response.json();

    if (response.status >= 400) {
      errMessage.innerText = data.message;
      errMessage.style.display = "block";

      setTimeout(() => {
        errMessage.style.display = "none";
      }, 4000);
    } else {
      location.href = `http://${host}:${port}/auth/login`;
    }
  } catch (error) {
    showError(error);
  }
});
