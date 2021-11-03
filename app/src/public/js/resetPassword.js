import user from "./services/user.js";
import showError from "./utils/showError.js";

const successMessage = document.querySelector(".success-msg");
const form = document.querySelector(".reset-pw-form");
const confimMessage = document.querySelector(".confirm-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const password = data.get("password");
  const confirmPassword = data.get("confirm-password");

  if (password !== confirmPassword) {
    confimMessage.innerText = "Password mismatch!";
    confimMessage.style.color = "red";
    return;
  }

  const requestData = {
    body: {
      email: data.get("email"),
      password,
    },
    path: "password-reset",
    method: "PATCH",
  };

  try {
    const response = await user.send(requestData);

    if (response.status === 400 || response.status === 404) {
      const data = await response.json();
      successMessage.innerText = data.message;
      successMessage.style.color = "red";
      successMessage.style.display = "block";

      setTimeout(() => {
        successMessage.style.color = "green";
        successMessage.style.display = "none";
      }, 2000);
    } else if (response.status === 204) {
      successMessage.innerText = "Password updated successfully!";
      successMessage.style.display = "block";

      setTimeout(() => {
        location.href = `/auth/login`;
      }, 2000);
    }
  } catch (error) {
    showError(error);
  }
});
