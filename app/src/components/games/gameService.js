const { promises: fs, existsSync } = require("fs");
const initGameStorage = require("./gameStorages/initGameStorage");
const NotFoundError = require("../../errors/notFoundError");
const CatchError = require("../../errors/catchError");
const { GAME_NOT_FOUND } = require("../../helpers/messages");
const { storageType } = require("../../../config").app;

class GameService {
  constructor() {
    this.storage = initGameStorage(storageType);
  }

  async create(data) {
    const gameData = {
      title: data.body.title,
      description: data.body.description,
      url: data.file.path,
    };

    try {
      const id = await this.storage.create(gameData);

      return { id, ...gameData };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async findById(id) {
    try {
      const game = await this.storage.findById(id);
      if (!game) throw new NotFoundError(GAME_NOT_FOUND);

      return game;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getAll() {
    try {
      return this.storage.getAll();
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async delete(id) {
    try {
      const game = await this.storage.findById(id);
      if (!game) throw new NotFoundError(GAME_NOT_FOUND);

      await this.storage.deleteById(id);
      if (existsSync(game.url)) await fs.unlink(game.url);
    } catch (error) {
      if (error.errno === 1451)
        error.message = "Database Error: cannot delete.";
      throw new CatchError(error);
    }
  }
}

module.exports = new GameService();
