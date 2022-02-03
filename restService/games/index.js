const controller = require("./games/controller");

exports.games = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST", "DELETE");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send();
    return;
  }

  switch (true) {
    case req.method === "POST" && req.path === "/games":
      await controller.createGame(req, res, "admin");
      break;

    case req.method === "DELETE" &&
      req.path.startsWith("/games/") &&
      req.path.split("/").length === 3:
      await controller.deleteGame(req, res, "admin");
      break;

    case req.method === "POST" &&
      req.path.startsWith("/games/") &&
      req.path.endsWith("/tables"):
      await controller.createTable(req, res);
      break;

    case req.method === "DELETE" &&
      req.path.startsWith("/games/") &&
      req.path.split("/")[3] === "tables":
      await controller.deleteTable(req, res);
      break;

    default:
      res.status(404).send(`The Route ${req.path} doesn't exist`);
      break;
  }
};
