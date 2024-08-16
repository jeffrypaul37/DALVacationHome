import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "us-east-1" });

const mapDynamoDBItemToPlainObject = (item) => {
  return {
    user_id: item.user_id.S,
    booking_id: item.booking_id.S,
    room_no: item.room_no.S,
    start_date: item.start_date.S,
    end_date: item.end_date.S,
    room_name: item.room_name.S,
    price: parseFloat(item.price.N),
    room_image: item.room_image.S,
    room_desc: item.room_desc.S,
  };
};

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (!event.pathParameters || !event.pathParameters.userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request: userId is required" }),
    };
  }

  const userId = event.pathParameters.userId;
  
  console.log("UserId:", userId);

  const params = {
    TableName: "Bookings",
    IndexName: "user_id-index",
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": { S: userId },
    },
  };

  try {
    const data = await ddbClient.send(new QueryCommand(params));
    
    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No bookings found for this user" }),
      };
    }
    
    const bookings = data.Items.map(mapDynamoDBItemToPlainObject);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ bookings }),
    };
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ message: "Failed to fetch bookings", error: err.message }),
    };
  }
};
