const tableStorage = require("./tableStorage");
const userStorage = require("../user/userStorage");
const playersTablesStorage = require("./playersTablesStorage");
const NotFoundError = require("../../errors/notFoundError");
const ForbiddenError = require("../../errors/forbiddenError");
const CatchError = require("../../errors/catchError");
const {
  TABLE_NOT_FOUND,
  CANNOT_DELETE,
  USER_NOT_FOUND,
} = require("../../helpers/messages");

class TableService {
  async findByGameId(gameId) {
    try {
      const [tables, _] = await tableStorage.findByGameId(gameId);

      return tables;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async create(data) {
    try {
      const user = await userStorage.findById(data.user.id);
      if (!user) throw new NotFoundError(USER_NOT_FOUND);

      const tableData = { game_id: +data.params.id, user_id: user.id };
      const id = await tableStorage.create(tableData);

      // await playersTablesStorage.create({ user_id: user.id, table_id: id });

      return {
        id,
        creator: user.username,
        ...tableData,
        players: 1,
        viewers: 0,
      };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async delete(id, gameId, userId) {
    try {
      const table = await tableStorage.findById(id);

      if (!table) throw new NotFoundError(TABLE_NOT_FOUND);
      if (table.user_id !== userId || table.game_id !== +gameId)
        throw new ForbiddenError(CANNOT_DELETE);

      await tableStorage.deleteById(id);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async findGameAndTableById(id) {
    try {
      const table = await tableStorage.findGameAndTableById(id);
      if (!table) throw new NotFoundError(TABLE_NOT_FOUND);

      return table;
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new TableService();
