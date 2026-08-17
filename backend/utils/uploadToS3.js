const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/aws");

const uploadToS3 = async (file) => {
  const key = `${Date.now()}-${path.basename(file.originalname)}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  console.log("========== S3 Upload Start ==========");
  console.log("File Name:", file.originalname);
  console.log("S3 Key:", key);

  const result = await s3.send(command);

  console.log("S3 Upload Success");
  console.log(result);

  return {
    key,
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};

module.exports = uploadToS3;