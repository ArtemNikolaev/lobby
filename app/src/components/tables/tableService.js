const tableStorage = require("./tableStorage");
const userStorage = require("../user/userStorage");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const { TABLE_NOT_FOUND, CANNOT_DELETE } = require("../../helpers/messages");
const ForbiddenError = require("../../errors/forbiddenError");

class TableService {
  async findByGameId(gameId) {
    try {
      const [games, _] = await tableStorage.findByGameId(gameId);

      return games;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async create(data) {
    const [user] = await userStorage.findById(data.user.id);
    const tableData = { game_id: +data.params.id, user_id: data.user.id };

    try {
      const data = await tableStorage.create(tableData);

      return {
        id: data[0].insertId,
        creator: user[0].username,
        ...tableData,
        players: 0,
        viewers: 0,
      };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async delete(id, gameId, userId) {
    try {
      const [table] = await tableStorage.findById(id);
      console.log(table[0], gameId);
      if (!table.length) throw new NotFoundError(TABLE_NOT_FOUND);
      if (table[0].user_id !== userId || table[0].game_id !== +gameId)
        throw new ForbiddenError(CANNOT_DELETE);

      await tableStorage.deleteById(id, userId);
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new TableService();
