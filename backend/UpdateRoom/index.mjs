import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    const { roomNumber, maxGuest, roomAmenities, roomDesc, roomImages, roomName, roomPrice } = event;

    const params = {
      TableName: "Rooms",
      Key: {
        RoomNumber: { N: roomNumber.toString() },
      },
      UpdateExpression: "set MaxGuest = :mg, RoomAmenities = :ra, RoomDesc = :rd, RoomImages = :ri, RoomName = :rn, RoomPrice = :rp",
      ExpressionAttributeValues: {
        ":mg": { N: maxGuest.toString() },
        ":ra": { L: roomAmenities.map(amenity => ({ S: amenity })) },
        ":rd": { S: roomDesc },
        ":ri": { L: roomImages.map(image => ({ S: image })) },
        ":rn": { S: roomName },
        ":rp": { N: roomPrice.toString() },
      },
      ReturnValues: "UPDATED_NEW"
    };

    await dynamoClient.send(new UpdateItemCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Room updated successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
