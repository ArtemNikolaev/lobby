const controller = require("./auth/controller");

exports.auth = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST", "DELETE");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send();
    return;
  }

  switch (true) {
    case req.method === "POST" && req.path === "/signup":
      await controller.register(req, res);
      break;

    case req.method === "POST" && req.path === "/signin":
      await controller.login(req, res);
      break;

    case req.method === "POST" && req.path === "/signout":
      controller.logout(req, res);
      break;

    case req.method === "POST" && req.path === "/password-reset-link":
      await controller.sendResetLink(req, res);
      break;

    case req.method === "GET" &&
      /^\/password-reset-link\/[0-9a-fA-f]{24}\/[\w\.\-]+$/.test(req.path):
      await controller.verifyResetLink(req, res);
      break;

    case req.method === "PATCH" && req.path === "/password-reset":
      await controller.resetPassword(req, res);
      break;

    default:
      res.status(404).send(`The Route ${req.path} doesn't exist`);
      break;
  }
};
