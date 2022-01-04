const pageService = require("./pageService");

class PageController {
  async getProfilePage(req, res, next) {
    try {
      const data = await pageService.getProfilePage(req.user.id);

      return res.json(data);
    } catch (error) {
      return next(error);
    }
  }

  async getTablePage(req, res, next) {
    try {
      const data = await pageService.getTablePage(req.params.tableId);

      return res.json(data);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PageController();
