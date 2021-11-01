const gameStorage = require("./gameStorage");
const CatchError = require("../../errors/catchError");

class GameService {
  async create(data) {
    const { title, description } = data.body;

    try {
      return gameStorage.create({
        title,
        description,
        url: data.file.path,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new GameService();
