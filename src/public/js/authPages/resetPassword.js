import showError from "../utils/showError.js";
import { app } from "../config.js";
import fetchGraphQL from "../fetchServices/graphQL.js";

const { loginPage } = app;
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

  try {
    const query = `mutation ResetPasswordMutation($email: String!, $password: String!) {
      resetPassword(email: $email, password: $password) {
        code
        success
        message
      }
    }`;


    const json = await fetchGraphQL({
      query,
      variables: {
        email: data.get("email"),
        password,
      },
    });

    const data = json.data.resetPassword;

    // TODO: remove comment
    // if (response.status === 400 || response.status === 404) {
    //   const res = await response.json();
    //   successMessage.innerText = res.message;
    //   successMessage.style.color = "red";
    //   successMessage.style.display = "block";
    //
    //   setTimeout(() => {
    //     successMessage.style.color = "green";
    //     successMessage.style.display = "none";
    //   }, 2000);
    // } else if (response.status === 204) {
    //   successMessage.innerText = "Password updated successfully!";
    //   successMessage.style.display = "block";
    //
    //   setTimeout(() => {
    //     document.location.href = loginPage;
    //   }, 2000);
    // }
  } catch (error) {
    showError(error);
  }
});
