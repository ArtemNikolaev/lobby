const { promises: fs, existsSync } = require("fs");
const gameStorage = require("./gameStorage");
const tableStorage = require("./tableStorage");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const { GAME_NOT_FOUND } = require("../../helpers/messages");

class GameService {
  async create(data) {
    const gameData = {
      title: data.body.title,
      description: data.body.description,
      url: data.file.path,
    };

    try {
      const data = await gameStorage.create(gameData);

      return { id: data[0].insertId, ...gameData };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getAll() {
    try {
      const [games, _] = await gameStorage.getAll();

      return games;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async delete(id) {
    try {
      const [data] = await gameStorage.findById(id);
      if (!data.length) throw new NotFoundError(GAME_NOT_FOUND);

      await gameStorage.deleteById(id);
      if (existsSync(data[0].url)) await fs.unlink(data[0].url);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async findTablesByGameId(gameId) {
    try {
      const [games, _] = await tableStorage.findByGameId(gameId);

      return games;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async createTable(data) {
    const tableData = { game_id: +data.params.id, user_id: data.user.id };

    try {
      const data = await tableStorage.create(tableData);

      return { id: data[0].insertId, ...tableData, players: 0, viewers: 0 };
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new GameService();
