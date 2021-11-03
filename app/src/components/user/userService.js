const userStorage = require("./userStorage");
const { verify } = require("../../helpers/scrypt");
const { WRONG_CREDENTIALS, USER_NOT_FOUND } = require("../../helpers/messages");
const UnauthorizedError = require("../../errors/unauthorizedError");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const UserDto = require("../../dtos/userDto");
const gameService = require("../games/gameService");

class UserService {
  async getRoom(id) {
    try {
      const user = await this.getUser(id);
      const userDto = new UserDto(user);

      const games = await gameService.getAll();

      return { user: userDto, games };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async checkCredential(credential) {
    try {
      const { login, password } = credential;

      const [data] = await userStorage.find(login);
      if (!data.length) throw new UnauthorizedError(WRONG_CREDENTIALS);

      const isMatch = await verify(data[0].password, password);
      if (!isMatch) throw new UnauthorizedError(WRONG_CREDENTIALS);

      return data[0];
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getUser(id) {
    try {
      const [data] = await userStorage.findById(id);
      if (!data.length) throw new NotFoundError(USER_NOT_FOUND);

      return data[0];
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new UserService();
