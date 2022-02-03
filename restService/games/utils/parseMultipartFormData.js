const busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

module.exports = async (req) => {
  const tmpDir = os.tmpdir();

  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });

    let parsed = {};
    bb.on("file", async (fieldname, file, { filename, mimeType }) => {
      try {
        const filepath = path.join(tmpDir, filename);
        parsed.filepath = filepath;
        parsed.mimeType = mimeType;
        parsed.filename = filename;

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        await new Promise((resolve, reject) => {
          file.on("end", () => {
            writeStream.end();
          });
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        });
      } catch (error) {
        reject(error);
      }
    })
      .on("field", (fieldname, value) => {
        parsed[fieldname] = value;
      })
      .on("finish", () => resolve(parsed))
      .on("error", (error) => reject(error));

    bb.end(req.rawBody);
  });
};
