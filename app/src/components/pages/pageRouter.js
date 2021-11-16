const { Router } = require("express");
const checkAuth = require("../../middlewares/checkAuth");
const pageController = require("./pageController");

const router = Router();

router.get("/user-page", checkAuth("user"), async (req, res, next) => {
  await pageController.getPage(req, res, next);
});

// so far, requesting data on the admin and on the user pages is the same
router.get("/admin-page", checkAuth("admin"), async (req, res, next) => {
  await pageController.getPage(req, res, next);
});

router.get("/lobby/:gameId", checkAuth(), async (req, res, next) => {
  await pageController.getLobbyPage(req, res, next);
});

router.get("/table/:tableId", checkAuth(), async (req, res, next) => {
  await pageController.getTablePage(req, res, next);
});

module.exports = router;
