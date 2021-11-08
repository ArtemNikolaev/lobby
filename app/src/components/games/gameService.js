const { promises: fs, existsSync } = require("fs");
const gameStorage = require("./gameStorage");
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
      const id = await gameStorage.create(gameData);

      return { id, ...gameData };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getAll() {
    try {
      return gameStorage.getAll();
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async delete(id) {
    try {
      const game = await gameStorage.findById(id);
      if (!game) throw new NotFoundError(GAME_NOT_FOUND);

      await gameStorage.deleteById(id);
      if (existsSync(game.url)) await fs.unlink(game.url);
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new GameService();
