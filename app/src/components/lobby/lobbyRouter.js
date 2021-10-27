const { Router } = require("express");
const lobbyController = require("./lobbyController");

const router = Router();

router.get("/", async (req, res, next) => {
  await lobbyController.getProfile(req, res, next);
});

module.exports = router;
