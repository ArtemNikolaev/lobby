const tableStorage = require("./tableStorage");
const userStorage = require("../user/userStorage");
const NotFoundError = require("../../errors/notFoundError");
const ForbiddenError = require("../../errors/forbiddenError");
const CatchError = require("../../errors/catchError");
const {
  TABLE_NOT_FOUND,
  CANNOT_DELETE,
  USER_NOT_FOUND,
} = require("../../helpers/messages");
const inMemoryStorage = require("../../inMemoryStorage/inMemoryStorage");

class TableService {
  async findByGameId(gameId) {
    try {
      let tables = await tableStorage.findByGameId(gameId);

      if (tables.length) {
        tables = await Promise.all(
          tables.map(async (table) => {
            table.count = await inMemoryStorage.getPlayersCount(table.id);
            return table;
          })
        );
      }

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

      return { id, creator: user.username, ...tableData };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async delete(id) {
    try {
      const count = await inMemoryStorage.getPlayersCount(parseInt(id));
      if (count > 1) throw new ForbiddenError(CANNOT_DELETE);

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
