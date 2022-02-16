const controller = require("./games/controller");

exports.games = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST, DELETE");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).send();
    return;
  }

  switch (true) {
    case req.method === "POST" && req.path === "/":
      await controller.createGame(req, res, "admin");
      break;

    case req.method === "DELETE" && /^\/[0-9a-fA-f]{24}$/.test(req.path):
      await controller.deleteGame(req, res, "admin");
      break;

    case req.method === "POST" && /^\/[0-9a-fA-f]{24}\/tables$/.test(req.path):
      await controller.createTable(req, res);
      break;

    case req.method === "DELETE" &&
      /^\/[0-9a-fA-f]{24}\/tables\/[0-9a-fA-f]{24}$/.test(req.path):
      await controller.deleteTable(req, res);
      break;

    default:
      res.status(404).send(`The Route ${req.path} doesn't exist`);
      break;
  }
};
