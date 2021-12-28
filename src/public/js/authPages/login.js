import showError from "../utils/showError.js";
import { app } from "../config.js";
import fetchGraphQL from "../fetchServices/graphQL.js";

const { token, userPage, adminPage } = app;
const failMessage = document.querySelector(".fail-msg");
const form = document.querySelector(".login-form");
const resetPWLink = document.querySelector(".reset-pw-link");
const resetPWDiv = document.querySelector(".reset-pw-div");
const loginBtn = document.querySelector(".login-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  try {
    const query = `mutation LoginMutation($emailOrUsername: String!, $password: String!) {
      login(emailOrUsername: $emailOrUsername, password: $password) {
        code
        success
        user {
          id
          username
          email
          role
        }
        message
        token
      }
    }`;

    const json = await fetchGraphQL({
      query,
      variables: {
        emailOrUsername: data.get("login"),
        password: data.get("password")
      },
    });

    const res = json.data.login;

    // TODO: remove comment
    // const response = await auth.send(requestData);
    // const res = await response.json();
    //
    // if (response.status === 401) {
    //   failMessage.innerText = res.message;
    //   failMessage.style.display = "block";
    //
    //   setTimeout(() => {
    //     failMessage.style.display = "none";
    //   }, 4000);
    //
    //   return;
    // }
    //
    // if (response.status >= 400) throw new Error(res.message);

    localStorage.setItem(token, res.token);
    document.location.href = res.user.role === "user" ? userPage : adminPage;
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
    const resetForm = document.querySelector(".pw-reset-form");

    resetForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(resetForm);

      const query = `mutation SendResetLinkMutation($email: String!) {
        sendResetLink(email: $email) {
          code
          success
          message
          responseMessage {
            message
          }
        }
      }`;

      try {
        const json = await fetchGraphQL({
          query,
          variables: {
            email: data.get("email"),
          },
        });

        const res = json.data.sendResetLink;

        checkMessage.innerText = res.responseMessage.message;
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
