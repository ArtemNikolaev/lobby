const authService = require("./services/authService");
const buildResponse = require("./utils/buildResponse");
const { clientHost } = require("./config");

class AuthController {
  async register(body) {
    const data = await authService.register(body);

    return buildResponse(data);
  }

  async login(body) {
    const data = await authService.login(body);

    return buildResponse(data);
  }

  logout() {
    const data = {
      statusCode: 200,
      body: { message: "Logout was successful" },
    };

    return buildResponse(data);
  }

  async sendResetLink(body) {
    const data = await authService.sendResetLinkToEmail(body.email);

    return buildResponse(data);
  }

  async verifyResetLink(event) {
    const data = await authService.verifyLink(event.pathParameters);

    return buildResponse(data, {
      Location: `${clientHost}/reset-password`,
    });
  }

  async resetPassword(body) {
    const data = await authService.resetPassword(body);

    return buildResponse(data);
  }
}

module.exports = new AuthController();
