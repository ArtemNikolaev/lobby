const { Router } = require("express");
const adminController = require("./adminController");

const router = Router();

router.get("/", async (req, res, next) => {
  await adminController.getProfile(req, res, next);
});

module.exports = router;
