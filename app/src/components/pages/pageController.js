const pageService = require("./pageService");

class PageController {
  async getPage(req, res, next) {
    try {
      const data = await pageService.getPage(req.user.id);

      return res.json(data);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PageController();
