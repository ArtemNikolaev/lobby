const tableStorage = require("./tableStorage");
const userStorage = require("../user/userStorage");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const { TABLE_NOT_FOUND, USER_NOT_FOUND } = require("../../helpers/messages");

class TableService {
  async findByGameId(gameId) {
    try {
      return tableStorage.findByGameId(gameId);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async create(data) {
    try {
      const user = await userStorage.findById(data.user.id);
      if (!user) throw new NotFoundError(USER_NOT_FOUND);

      const tableData = {
        creator: user.username,
        game_id: parseInt(data.params.id),
        max_players: data.body.maxPlayers,
      };

      const id = await tableStorage.create(tableData);

      return { id, ...tableData };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async delete(id) {
    try {
      await tableStorage.deleteById(id);
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
