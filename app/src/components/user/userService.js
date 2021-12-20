const userStorage = require("./userStorage");
const { verify } = require("../../helpers/scrypt");
const { WRONG_CREDENTIALS, USER_NOT_FOUND } = require("../../helpers/messages");
const UnauthorizedError = require("../../errors/unauthorizedError");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");

class UserService {
  async checkCredential(credential) {
    try {
      const { login, password } = credential;

      const user = await userStorage.findByLogin(login);
      if (!user) throw new UnauthorizedError(WRONG_CREDENTIALS);

      const isMatch = await verify(user.password, password);
      if (!isMatch) throw new UnauthorizedError(WRONG_CREDENTIALS);

      return user;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getUser(id) {
    try {
      const user = await userStorage.findById(id);
      if (!user) throw new NotFoundError(USER_NOT_FOUND);

      return user;
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new UserService();
