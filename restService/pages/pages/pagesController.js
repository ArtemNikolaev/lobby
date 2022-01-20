const pagesService = require("./pagesService");
const buildResponse = require("../utils/buildResponse");

class PagesController {
  async getProfilePage(id) {
    const data = await pagesService.getProfilePage(id);

    return buildResponse(data);
  }

  async getLobbyPage(event) {
    const data = await pagesService.getLobbyPage(event.pathParameters.id);

    return buildResponse(data);
  }

  async getTablePage(event) {
    const data = await pagesService.getTablePage(event.pathParameters.id);

    return buildResponse(data);
  }
}

module.exports = new PagesController();
