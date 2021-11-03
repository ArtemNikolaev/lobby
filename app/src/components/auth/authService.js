const userService = require("../user/userService");
const userStorage = require("../user/userStorage");
const CatchError = require("../../errors/catchError");
const tokenService = require("../token/tokenService");
const { hash } = require("../../helpers/scrypt");
const NotFoundError = require("../../errors/notFoundError");
const { USER_NOT_FOUND, IVALID_LINK } = require("../../helpers/messages");
const { port } = require("../../../config").app;
const { accessSecret, linkTTL } = require("../../../config").token;
const GoneError = require("../../errors/goneError");

class AuthService {
  async registration(body) {
    try {
      const userData = { ...body, password: await hash(body.password) };

      const data = await userStorage.create(userData);

      return { id: data[0].insertId, ...userData };
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
      const [data] = await userStorage.findByEmail(email);
      if (!data.length) throw new NotFoundError(USER_NOT_FOUND);
      const user = data[0];

      const payload = { id: user.id, email: user.email };
      const secret = accessSecret + user.password;

      const token = tokenService.generateToken(payload, secret, linkTTL);

      const link = `http://localhost:${port}/auth/password-reset-link/${user.id}/${token}`;

      // TODO: Logic with sending the link to user email
      console.log("\n\nClick to reset password:\n\n", link, "\n\n");
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async verifyLink(params) {
    try {
      const { id, token } = params;

      const [data] = await userStorage.findById(id);
      if (!data.length) throw new NotFoundError(USER_NOT_FOUND);

      const secret = accessSecret + data[0].password;

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

      const [data] = await userStorage.updatePassword({
        email,
        password: await hash(password),
      });

      if (!data.affectedRows) throw new NotFoundError(USER_NOT_FOUND);
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new AuthService();
