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
      const data = await gameStorage.deleteById(id);
      if (!data[0].affectedRows) throw new NotFoundError(GAME_NOT_FOUND);
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new GameService();
