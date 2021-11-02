const { Router } = require("express");
const upload = require("../../middlewares/upload");
const gameController = require("./gameController");

const router = Router();

router.post("/", upload.single("image"), async (req, res, next) => {
  await gameController.create(req, res, next);
});

router.delete("/:id", async (req, res, next) => {
  await gameController.delete(req, res, next);
});

module.exports = router;
