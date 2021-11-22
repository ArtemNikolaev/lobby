const initUserStorage = require("./userStorages/initUserStorage");
const { verify } = require("../../helpers/scrypt");
const { WRONG_CREDENTIALS, USER_NOT_FOUND } = require("../../helpers/messages");
const UnauthorizedError = require("../../errors/unauthorizedError");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const { storageType } = require("../../../config").app;

class UserService {
  constructor() {
    this.storage = initUserStorage(storageType);
  }

  async checkCredential(credential) {
    try {
      const { login, password } = credential;

      const user = await this.storage.findByLogin(login);
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
      const user = await this.storage.findById(id);
      if (!user) throw new NotFoundError(USER_NOT_FOUND);

      return user;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async create(userData) {
    try {
      return this.storage.create(userData);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async findByEmail(email) {
    try {
      return this.storage.findByEmail(email);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async findByUsername(username) {
    try {
      return this.storage.findByUsername(username);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async updatePassword(data) {
    try {
      return this.storage.updatePassword(data);
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new UserService();
