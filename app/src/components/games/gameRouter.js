const { Router } = require("express");
const upload = require("../../middlewares/upload");
const gameController = require("./gameController");

const router = Router();

router.post("/", upload.single("image"), async (req, res, next) => {
  await gameController.create(req, res, next);
});

module.exports = router;
