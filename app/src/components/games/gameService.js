const gameStorage = require("./gameStorage");
const CatchError = require("../../errors/catchError");

class GameService {
  async create(data) {
    const { title, description } = data.body;

    try {
      return gameStorage.create({
        title,
        description,
        url: data.file.path.split("public")[1],
      });
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
}

module.exports = new GameService();
