const tableStorage = require("./tableStorage");
const userStorage = require("../user/userStorage");
const playerStorage = require("../players/playerStorage");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const { TABLE_NOT_FOUND, USER_NOT_FOUND } = require("../../helpers/messages");

class TableService {
  async findByGameId(gameId) {
    try {
      let tables = await tableStorage.findByGameId(gameId);

      if (tables.length) {
        tables = await Promise.all(
          tables.map(async (table) => {
            table.count = await playerStorage.getCount(table.id);
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
