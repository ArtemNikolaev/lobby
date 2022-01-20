const { randomBytes } = require("crypto");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client();
const backetName = process.env.BUCKET_NAME;

async function uploadToS3({ buffer, filename, mimeType }) {
  const key = `images/${randomBytes(24).toString("hex")}.${filename
    .split(".")
    .pop()}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: backetName,
      Key: key,
      ContentType: mimeType,
      Body: buffer,
    })
  );

  return `https://${backetName}.s3.amazonaws.com/${key}`;
}

async function deleteFromS3(key) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: backetName,
      Key: key,
    })
  );
}

module.exports = { uploadToS3, deleteFromS3 };
