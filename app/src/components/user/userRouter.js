const { Router } = require("express");
const userController = require("./userController");

const router = Router();

router.get("/", async (req, res, next) => {
  await userController.getUserRoom(req, res, next);
});

module.exports = router;
