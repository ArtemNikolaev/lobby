const authController = require("./authController");

exports.handler = async (event) => {
  let response;
  global.console.log(`:: | ${event.httpMethod} | ${event.path} |`);

  switch (true) {
    case event.httpMethod === "POST" && event.path === "/auth/signup":
      response = await authController.register(JSON.parse(event.body));
      break;

    case event.httpMethod === "POST" && event.path === "/auth/signin":
      response = await authController.login(JSON.parse(event.body));
      break;

    case event.httpMethod === "POST" && event.path === "/auth/signout":
      response = authController.logout();
      break;

    case event.httpMethod === "POST" &&
      event.path === "/auth/password-reset-link":
      response = await authController.sendResetLink(JSON.parse(event.body));
      break;

    case event.httpMethod === "GET" &&
      event.path ===
        `/auth/password-reset-link/${event.pathParameters.id}/${event.pathParameters.token}`:
      response = await authController.verifyResetLink(event);
      break;

    case event.httpMethod === "PATCH" && event.path === "/auth/password-reset":
      response = await authController.resetPassword(JSON.parse(event.body));
      break;
  }

  return response;
};
