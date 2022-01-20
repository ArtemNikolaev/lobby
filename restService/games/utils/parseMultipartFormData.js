const busboy = require("busboy");

module.exports = async (event) => {
  const contentType =
    event.headers["Content-Type"] || event.headers["content-type"];

  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: { "content-type": contentType } });

    let parsed = {};
    bb.on("file", async (fieldname, file, { filename, mimeType }) => {
      try {
        const buffer = await new Promise((resolve, reject) =>
          file
            .on("data", (data) => resolve(data))
            .on("error", (err) => reject(err))
        );

        parsed.filename = filename;
        parsed.mimeType = mimeType;
        parsed.buffer = buffer;
      } catch (error) {
        reject(error);
      }
    })
      .on("field", (fieldname, value) => {
        parsed[fieldname] = value;
      })
      .on("finish", () => resolve(parsed))
      .on("error", (error) => reject(error));

    bb.write(event.body, event.isBase64Encoded ? "base64" : "binary");
    bb.end();
  });
};
