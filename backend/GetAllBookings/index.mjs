import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "us-east-1" });

const mapDynamoDBItemToPlainObject = (item) => {
  return {
    booking_id: item.booking_id.S,
    room_no: item.room_no.S,
    room_name: item.room_name.S,
    room_image: item.room_image.S,
    room_desc: item.room_desc.S,
    user_id: item.user_id.S,
    user_name: item.user_name.S,
    user_email: item.user_email.S,
    start_date: item.start_date.S,
    end_date: item.end_date.S,
    price: parseFloat(item.price.N),
  };
};

export const handler = async (event) => {
    const params = {
      TableName: "Bookings" 
    };

  try {
    const data = await ddbClient.send(new ScanCommand(params));
    
    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No bookings Found." }),
      };
    }
    
    const bookings = data.Items.map(mapDynamoDBItemToPlainObject);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: { bookings },
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
