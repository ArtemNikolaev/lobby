const { Router } = require("express");
const checkAuth = require("../../middlewares/checkAuth");
const pageController = require("./pageController");

const router = Router();

router.get("/user", checkAuth("user"), async (req, res, next) => {
  await pageController.getPage(req, res, next);
});

// so far, requesting data on the admin and on the user pages is the same
router.get("/admin", checkAuth("admin"), async (req, res, next) => {
  await pageController.getPage(req, res, next);
});

module.exports = router;
