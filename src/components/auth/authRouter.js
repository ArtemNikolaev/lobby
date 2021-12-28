const { Router } = require("express");
const authController = require("./authController");
const checkUsername = require("../../middlewares/checkUsername");
const validator = require("../../middlewares/validator");
const registerSchema = require("../../schemas/registerSchema");
const loginSchema = require("../../schemas/loginSchema");
const resetPasswordSchema = require("../../schemas/resetPasswordSchema");
const emailSchema = require("../../schemas/emailSchema");

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

router.post(
  "/password-reset-link",
  validator(emailSchema),
  async (req, res, next) => {
    await authController.sendResetLink(req, res, next);
  }
);

router.get("/password-reset-link/:id/:token", async (req, res, next) => {
  await authController.verifyResetLink(req, res, next);
});

router.patch(
  "/password-reset",
  validator(resetPasswordSchema),
  async (req, res, next) => {
    await authController.resetPassword(req, res, next);
  }
);

module.exports = router;
