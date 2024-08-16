import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
  console.log(event);
  try {
    const { roomNumber, fileName, fileContent } = event;

    const params = {
      Bucket: "dal-vac-room-images",
      Key: `${roomNumber}/${fileName}`,
      Body: Buffer.from(fileContent, "base64"),
      ContentType: "image/jpeg",
    };

    const data = await s3Client.send(new PutObjectCommand(params));
    const url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
