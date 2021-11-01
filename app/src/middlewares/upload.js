const multer = require("multer");
const { existsSync, mkdirSync } = require("fs");
const { randomUUID } = require("crypto");
const { uploadsFolder } = require("../../config").app;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!existsSync(uploadsFolder)) mkdirSync(uploadsFolder);
    } catch (err) {
      throw new Error(err);
    }

    cb(null, `./${uploadsFolder}`);
  },
  filename: (req, file, cb) => {
    const arr = file.originalname.split(".");
    const name = randomUUID();
    cb(null, `${name}.${arr[arr.length - 1]}`);
  },
});

module.exports = multer({ storage });
