import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    const { roomNumber, maxGuest, roomAmenities, roomDesc, roomImages, roomName, roomPrice } = event;

    const params = {
      TableName: "Rooms",
      Item: {
        RoomNumber: { N: roomNumber.toString() },
        MaxGuest: { N: maxGuest.toString() },
        RoomAmenities: { L: roomAmenities.map(amenity => ({ S: amenity })) },
        RoomDesc: { S: roomDesc },
        RoomImages: { L: roomImages.map(image => ({ S: image })) },
        RoomName: { S: roomName },
        RoomPrice: { N: roomPrice.toString() },
      },
    };

    await dynamoClient.send(new PutItemCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Room added successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
