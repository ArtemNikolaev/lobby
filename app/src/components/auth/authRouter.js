const { Router } = require("express");
const authController = require("./authController");
const checkUsername = require("../../middlewares/checkUsername");

const router = Router();

router.post("/register", checkUsername, async (req, res, next) => {
  await authController.register(req, res, next);
});

router.post("/login", async (req, res, next) => {
  await authController.login(req, res, next);
});

module.exports = router;
