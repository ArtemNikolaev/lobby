const userStorage = require("./userStorage");
const { verify } = require("../../helpers/scrypt");
const { WRONG_CREDENTIALS } = require("../../helpers/messages");
const UnauthorizedError = require("../../errors/unauthorizedError");
const CatchError = require("../../errors/catchError");

class UserService {
  async checkCredential(credential) {
    try {
      const { login, password } = credential;

      const user = await userStorage.find(login);
      if (!user) throw new UnauthorizedError(WRONG_CREDENTIALS);

      const isMatch = await verify(user.password, password);
      if (!isMatch) throw new UnauthorizedError(WRONG_CREDENTIALS);

      return user;
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new UserService();
