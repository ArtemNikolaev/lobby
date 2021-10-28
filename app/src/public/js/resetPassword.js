import user from "./services/user.js";
import formatter from "./utils/formatter.js";
import app from "./config.js";
import showError from "./utils/showError.js";

const { host, port } = app;
const successMessage = document.querySelector(".success-msg");
const form = document.querySelector(".reset-pw-form");
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
      email: formatter(email.value),
      password: formatter(password.value),
    },
    path: "password-reset",
    method: "PATCH",
  };

  try {
    const response = await user.send(requestData);

    if (response.status === 204) {
      successMessage.innerText = "Password successfully updated!";
      successMessage.style.display = "block";

      setTimeout(() => {
        location.href = `http://${host}:${port}/auth/login`;
      }, 2000);
    }
  } catch (error) {
    showError(error);
  }
});
