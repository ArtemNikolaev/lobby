const { accessSecret, resetLinkTTL, apiURL } = require("../config");
const { generateToken, verifyToken } = require("../utils/token");
const { hash } = require("../utils/scrypt");
const userDto = require("../utils/userDto");
const errorObject = require("../utils/errorObject");
const GoneError = require("../errors/goneError");

const IVALID_LINK = "This link is no longer valid";

const {
  checkUsername,
  createUser,
  checkCredentials,
  findUserByEmail,
  findUserById,
  updatePassword,
} = require("./userService");

class AuthService {
  async register(body) {
    try {
      await checkUsername(body);

      const userData = {
        role: "user",
        ...body,
        password: await hash(body.password),
      };

      const id = await createUser(userData);

      return { statusCode: 201, body: { id, ...userData } };
    } catch (error) {
      return errorObject(error);
    }
  }

  async login(body) {
    try {
      const user = await checkCredentials(body);
      const { id, role } = user;

      return {
        statusCode: 200,
        body: { user: userDto(user), token: generateToken({ id, role }) },
      };
    } catch (error) {
      return errorObject(error);
    }
  }

  async sendResetLinkToEmail(email) {
    try {
      const { id, password } = await findUserByEmail(email);

      const payload = { id, email };
      const secret = accessSecret + password;

      const token = generateToken(payload, secret, resetLinkTTL);

      const link = `${apiURL}/auth/password-reset-link/${id}/${token}`;

      // TODO: Logic with sending the link to user email
      global.console.log("\n\nClick to reset password:\n\n", link, "\n\n");

      return {
        statusCode: 200,
        body: { message: "Check your email, please!" },
      };
    } catch (error) {
      return errorObject(error);
    }
  }

  async verifyLink(params) {
    try {
      const { id, token } = params;

      const { password } = await findUserById(id);
      const secret = accessSecret + password;

      try {
        verifyToken(token, secret);
      } catch (error) {
        throw new GoneError(IVALID_LINK);
      }

      return { statusCode: 302 };
    } catch (error) {
      return errorObject(error);
    }
  }

  async resetPassword(body) {
    try {
      const { email, password } = body;
      await updatePassword({ email, password: await hash(password) });

      return { statusCode: 204, body: null };
    } catch (error) {
      return errorObject(error);
    }
  }
}

module.exports = new AuthService();
