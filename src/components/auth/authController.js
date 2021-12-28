const { port } = require("../../../config").app;
const { CHECK_EMAIL } = require("../../helpers/messages");
const { CREATED, NO_CONTENT } = require("../../helpers/statusCodes");
const authService = require("./authService");
const UserDto = require("../../dtos/userDto");

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.registration(req.body);

      return res.status(CREATED).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { user, token } = await authService.login(req.body);
      const userDto = new UserDto(user);

      return res.json({ user: userDto, token });
    } catch (error) {
      return next(error);
    }
  }

  async sendResetLink(req, res, next) {
    try {
      await authService.sendResetLinkToEmail(req.body.email);

      return res.json({ message: CHECK_EMAIL });
    } catch (error) {
      return next(error);
    }
  }

  async verifyResetLink(req, res, next) {
    try {
      await authService.verifyLink(req.params);

      return res.redirect(`http://localhost:${port}/auth/password-reset`);
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      await authService.resetPassword(req.body);

      return res.status(NO_CONTENT).send();
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();
