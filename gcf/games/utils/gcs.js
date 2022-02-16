const { Storage } = require("@google-cloud/storage");
const { randomBytes } = require("crypto");
const { bucketName } = require("../config");
const path = require("path");

const keyFilename = path.join(__dirname, "../keyfile.json");
const storage = new Storage({
  projectId: "lobby-serverless",
  keyFilename,
});

const bucket = storage.bucket(bucketName);

async function uploadToGCS({ filepath, filename, mimeType }) {
  const key = `images/${randomBytes(24).toString("hex")}.${filename
    .split(".")
    .pop()}`;

  await bucket.upload(filepath, {
    metadata: {
      contentType: mimeType,
      cacheControl: "public,max-age=3600",
    },
    destination: key,
  });

  return `https://storage.googleapis.com/${bucketName}/${key}`;
}

async function deleteFromGCS(fileName) {
  await bucket.file(fileName).delete();
}

module.exports = { uploadToGCS, deleteFromGCS };
