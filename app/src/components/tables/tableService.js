// const tableStorage = require("./tableStorage");
const tableStorage = require("./tableStorageMDB");
const userService = require("../user/userService");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const { TABLE_NOT_FOUND } = require("../../helpers/messages");

class TableService {
  async create(data) {
    try {
      const user = await userService.getUser(data.user.id);

      const tableData = {
        creator: user.username,
        game_id: data.params.id,
        max_players: data.body.maxPlayers,
      };

      const id = await tableStorage.create(tableData);

      return { id, ...tableData };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async findByGameId(gameId) {
    try {
      return tableStorage.findByGameId(gameId);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async delete(id) {
    try {
      const deleted = await tableStorage.deleteById(id);
      if (!deleted) throw new NotFoundError(TABLE_NOT_FOUND);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getTableInfo(id) {
    try {
      const table = await tableStorage.getTableInfo(id);
      if (!table) throw new NotFoundError(TABLE_NOT_FOUND);

      return table;
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new TableService();
