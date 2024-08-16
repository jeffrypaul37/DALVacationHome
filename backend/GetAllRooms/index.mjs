import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDBClient();

const mapDynamoDBItemToPlainObject = (item) => {
  const result = {
    RoomNumber: item.RoomNumber.N,
    RoomName: item.RoomName.S,
    RoomDesc: item.RoomDesc.S,
    RoomPrice: item.RoomPrice.N,
    MaxGuest: item.MaxGuest.N,
    RoomImages: item.RoomImages.L.map(image => image.S),
    RoomAmenities: item.RoomAmenities.L.map(amenity => amenity.S)
  };

  if (item.Polarity && item.Polarity.S) result.Polarity = item.Polarity.S;

  return result;
};

export const handler = async (event) => {
    const params = {
        TableName: "Rooms" 
    };

    try {
        const data = await dbClient.send(new ScanCommand(params));
        const rooms = data.Items.map(mapDynamoDBItemToPlainObject);
        console.log("Success - data retrieved", rooms);
        return {
            statusCode: 200,
            body: { rooms },
            headers: {
                "Content-Type": "application/json",
            }
        };
    } 
    catch (err) {
        console.error("Failure - unable to retrieve data", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to retrieve data" }),
            headers: {
                "Content-Type": "application/json",
            }
        };
    }
};
