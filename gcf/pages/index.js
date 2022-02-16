const controller = require("./pages/controller");

exports.pages = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).send();
    return;
  }

  switch (true) {
    case req.method === "GET" && req.path === "/admin-page":
      await controller.getProfilePage(req, res, "admin");
      break;

    case req.method === "GET" && req.path === "/user-page":
      await controller.getProfilePage(req, res, "user");
      break;

    case req.method === "GET" &&
      /^\/lobby-page\/[0-9a-fA-f]{24}$/.test(req.path):
      await controller.getLobbyPage(req, res);
      break;

    case req.method === "GET" &&
      /^\/table-page\/[0-9a-fA-f]{24}$/.test(req.path):
      await controller.getTablePage(req, res);
      break;

    default:
      res.status(404).send(`The Route ${req.path} doesn't exist`);
      break;
  }
};
