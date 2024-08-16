import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const s3Client = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
  const roomNumber = event.pathParameters.roomNumber;

  const deleteDynamoDB = async () => {
    const params = {
      TableName: "Rooms",
      Key: {
        RoomNumber: { N: roomNumber.toString() },
      },
    };
    await dynamoClient.send(new DeleteItemCommand(params));
  };

  const deleteS3Folder = async () => {
    const listParams = {
      Bucket: "dal-vac-room-images",
      Prefix: `${roomNumber}/`,
    };
    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: "dal-vac-room-images",
      Delete: {
        Objects: listedObjects.Contents.map((file) => ({ Key: file.Key })),
      },
    };
    await s3Client.send(new DeleteObjectsCommand(deleteParams));

    if (listedObjects.IsTruncated) await deleteS3Folder();
  };

  try {
    await deleteDynamoDB();
    await deleteS3Folder();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "Room and associated images deleted successfully",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
