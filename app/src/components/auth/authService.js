const { accessSecret, linkTTL } = require("../../../config").token;
const { port } = require("../../../config").app;
const userService = require("../user/userService");
const tokenService = require("../token/tokenService");
const { hash } = require("../../helpers/scrypt");
const { USER_NOT_FOUND, IVALID_LINK } = require("../../helpers/messages");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const GoneError = require("../../errors/goneError");

class AuthService {
  async registration(body) {
    try {
      const userData = {
        role: "user",
        ...body,
        password: await hash(body.password),
      };

      const id = await userService.create(userData);

      return { id, ...userData };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async login(body) {
    try {
      const user = await userService.checkCredential(body);
      const { id, role } = user;

      const token = tokenService.generateToken({ id, role });

      return { user, token };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async sendResetLinkToEmail(email) {
    try {
      const user = await userService.findByEmail(email);
      if (!user) throw new NotFoundError(USER_NOT_FOUND);

      const payload = { id: user.id, email: user.email };
      const secret = accessSecret + user.password;

      const token = tokenService.generateToken(payload, secret, linkTTL);

      const link = `http://localhost:${port}/auth/password-reset-link/${user.id}/${token}`;

      // TODO: Logic with sending the link to user email
      global.console.log("\n\nClick to reset password:\n\n", link, "\n\n");
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async verifyLink(params) {
    try {
      const { id, token } = params;

      const user = await userService.getUser(id);
      const secret = accessSecret + user.password;

      try {
        tokenService.verify(token, secret);
      } catch (error) {
        throw new GoneError(IVALID_LINK);
      }
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async resetPassword(body) {
    try {
      const { email, password } = body;

      const updated = await userService.updatePassword({
        email,
        password: await hash(password),
      });

      if (!updated) throw new NotFoundError(USER_NOT_FOUND);
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new AuthService();
