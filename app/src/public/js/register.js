import user from "./services/user.js";
import showError from "./utils/showError.js";

const errMessage = document.querySelector(".fail-msg");
const form = document.querySelector(".register-form");
const confimMessage = document.querySelector(".confirm-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = new FormData(form);

  const password = body.get("password");
  const confirmPassword = body.get("confirm-password");

  if (password !== confirmPassword) {
    confimMessage.innerText = "Password mismatch!";
    confimMessage.style.color = "red";
    return;
  }

  const requestData = {
    body: {
      username: body.get("username"),
      email: body.get("email"),
      password,
    },
    path: "register",
    method: "POST",
  };

  try {
    const response = await user.send(requestData);
    const data = await response.json();

    if (response.status === 409) {
      errMessage.innerText = "Something went wrong";
      errMessage.style.display = "block";

      setTimeout(() => {
        errMessage.style.display = "none";
      }, 4000);
      console.log(data.message);

      return;
    } else if (response.status >= 409) {
      console.log(data.message);

      return;
    }

    location.href = "/auth/login";
  } catch (error) {
    showError(error);
  }
});
