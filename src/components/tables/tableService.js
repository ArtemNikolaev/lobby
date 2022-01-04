const initTableStorage = require("./tableStorages/initTableStorage");
const userService = require("../user/userService");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const { TABLE_NOT_FOUND } = require("../../helpers/messages");
const { storageType } = require("../../../config").app;

class TableService {
  constructor() {
    this.storage = initTableStorage(storageType);
  }

  async create(data) {
    try {
      const user = await userService.getUser(data.user.id);

      const tableData = {
        creator: user.username,
        gameId: data.params.id,
        maxPlayers: data.body.maxPlayers,
      };

      const id = await this.storage.create(tableData);

      return { id, ...tableData };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async findByGameId(gameId) {
    try {
      return this.storage.findByGameId(gameId);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async delete(id) {
    try {
      const deleted = await this.storage.deleteById(id);
      if (!deleted) throw new NotFoundError(TABLE_NOT_FOUND);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getTableInfo(id) {
    try {
      const table = await this.storage.getTableInfo(id);
      if (!table) throw new NotFoundError(TABLE_NOT_FOUND);

      return table;
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new TableService();
