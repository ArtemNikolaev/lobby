const controller = require("./pages/controller");

exports.pages = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
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

    case req.method === "GET" && req.path === `/lobby-page/${req.params.id}`:
      await controller.getLobbyPage(req, res);
      break;

    case req.method === "GET" && req.path === `/table-page/${req.params.id}`:
      await controller.getTablePage(req, res);
      break;
  }
};
