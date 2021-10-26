const userService = require("../user/userService");
const userStorage = require("../user/userStorage");
const CatchError = require("../../errors/catchError");
const tokenService = require("../token/tokenService");
const { hash } = require("../../helpers/scrypt");

class AuthService {
  async registration(body) {
    try {
      const { username, email, password } = body;

      const hashedPassword = await hash(password);
      const user = await userStorage.create({
        username,
        email,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async login(body) {
    try {
      const user = await userService.checkCredential(body);

      const token = tokenService.generateToken({ id: user.id });
      const { username } = user;

      return { username, token };
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new AuthService();
