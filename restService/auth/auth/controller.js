const service = require("./service");
const { clientHost } = require("../config");
const checkUsername = require("../helpers/checkUsername");
const responseError = require("../utils/responseError");
const { bodyValidator } = require("../utils/validator");
const {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  sendResetLinkSchema,
} = require("../utils/schemas");

class Controller {
  async register(req, res) {
    try {
      bodyValidator(registerSchema, req);
      await checkUsername(req.body);

      const data = await service.register(req.body);

      res.status(201).json(data);
    } catch (error) {
      responseError(res, error);
    }
  }

  async login(req, res) {
    try {
      bodyValidator(loginSchema, req);
      const data = await service.login(req.body);

      res.json(data);
    } catch (error) {
      responseError(res, error);
    }
  }

  logout(req, res) {
    try {
      res.json({ message: "Logout was successful" });
    } catch (error) {
      responseError(res, error);
    }
  }

  async sendResetLink(req, res) {
    try {
      bodyValidator(sendResetLinkSchema, req);

      const data = await service.sendResetLinkToEmail(req.body.email);

      res.json(data);
    } catch (error) {
      responseError(res, error);
    }
  }

  async verifyResetLink(req, res) {
    try {
      const [_, __, id, token] = req.params["0"].split("/");
      await service.verifyLink({ id, token });

      res.setHeader("Location", `${clientHost}/reset-password`);
      res.status(302).send();
    } catch (error) {
      responseError(res, error);
    }
  }

  async resetPassword(req, res) {
    try {
      bodyValidator(resetPasswordSchema, req);

      await service.resetPassword(req.body);

      res.status(204).send();
    } catch (error) {
      responseError(res, error);
    }
  }
}

module.exports = new Controller();
