import showError from "../utils/showError.js";
import { app } from "../config.js";
import fetchGraphQL from "../fetchServices/graphQL.js";

const { loginPage } = app;
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

  try {
    const query = `mutation RegisterMutation($email: String!, $username: String!, $password: String!) {
      register(email: $email, username: $username, password: $password) {
        code
        success
        message
        id
      }
    }`;

    const json = await fetchGraphQL({
      query,
      variables: {
        email: body.get("email"),
        username: body.get("username"),
        password,
      },
    });

    if (json.errors || json.data.register.code !== 200) {
      errMessage.innerText = "Something went wrong";
      errMessage.style.display = "block";

      setTimeout(() => {
        errMessage.style.display = "none";
      }, 4000);

      console.log(json);
      return;
    }

    document.location.href = loginPage;
  } catch (error) {
    showError(error);
  }
});
