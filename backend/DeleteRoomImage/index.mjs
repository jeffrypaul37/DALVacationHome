import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
  console.log(event);
  try {
    const { roomNumber, fileName } = event;

    const params = {
      Bucket: "dal-vac-room-images",
      Key: `${roomNumber}/${fileName}`
    };

    await s3Client.send(new DeleteObjectCommand(params));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ message: "Image deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
