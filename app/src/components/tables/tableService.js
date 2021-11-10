const tableStorage = require("./tableStorage");
const userStorage = require("../user/userStorage");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const { TABLE_NOT_FOUND, CANNOT_DELETE } = require("../../helpers/messages");
const ForbiddenError = require("../../errors/forbiddenError");

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
    const user = await userStorage.findById(data.user.id);
    const tableData = { game_id: +data.params.id, user_id: user.id };

    try {
      const id = await tableStorage.create(tableData);

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
}

module.exports = new TableService();
