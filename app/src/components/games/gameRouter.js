const { Router } = require("express");
const checkAuth = require("../../middlewares/checkAuth");
const upload = require("../../middlewares/upload");
const gameController = require("./gameController");

const router = Router();

router.post(
  "/",
  checkAuth("admin"),
  upload.single("image"),
  async (req, res, next) => {
    await gameController.create(req, res, next);
  }
);

router.delete("/:id", checkAuth("admin"), async (req, res, next) => {
  await gameController.delete(req, res, next);
});

router.get("/:id/tables", checkAuth("user"), async (req, res, next) => {
  await gameController.getTablesByGameId(req, res, next);
});

router.post("/:id/tables", checkAuth("user"), async (req, res, next) => {
  await gameController.createTable(req, res, next);
});

router.delete(
  "/:gameId/tables/:tableId",
  checkAuth("user"),
  async (req, res, next) => {
    await gameController.deleteTable(req, res, next);
  }
);

module.exports = router;
