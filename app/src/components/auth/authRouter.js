const { Router } = require("express");
const authController = require("./authController");
const checkUsername = require("../../middlewares/checkUsername");
const validator = require("../../middlewares/validator");
const registerSchema = require("../../schemas/registerSchema");
const loginSchema = require("../../schemas/loginSchema");
const checkAuth = require("../../middlewares/checkAuth");

const router = Router();

router.post(
  "/register",
  validator(registerSchema),
  checkUsername,
  async (req, res, next) => {
    await authController.register(req, res, next);
  }
);

router.post("/login", validator(loginSchema), async (req, res, next) => {
  await authController.login(req, res, next);
});

router.post("/logout", checkAuth, async (req, res, next) => {
  await authController.logout(req, res, next);
});

module.exports = router;
