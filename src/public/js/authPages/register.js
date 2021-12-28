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

    const data = json.data.register.id;

    // TODO: remove comment
    // if (response.status === 409) {
    //   errMessage.innerText = "Something went wrong";
    //   errMessage.style.display = "block";
    //
    //   setTimeout(() => {
    //     errMessage.style.display = "none";
    //   }, 4000);
    //
    //   window.console.log(data.message);
    //   return;
    // }
    //
    // if (response.status >= 400) throw new Error(data.message);

    document.location.href = loginPage;
  } catch (error) {
    showError(error);
  }
});
