import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "us-east-1" });

const mapDynamoDBItemToPlainObject = (item) => {
  return {
    room_no: item.room_no.S,
    user_name: item.user_name.S,
    comment: item.comment.S,
    rating: parseFloat(item.rating.N),
  };
};

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (!event.pathParameters || !event.pathParameters.room_no) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request: room_no is required" }),
    };
  }

  const room_no = event.pathParameters.room_no;
  
  console.log("Room Number:", room_no);

  const params = {
    TableName: "Reviews",
    IndexName: "room_no-index",
    KeyConditionExpression: "room_no = :room_no",
    ExpressionAttributeValues: {
      ":room_no": { S: room_no },
    },
  };

  try {
    const data = await ddbClient.send(new QueryCommand(params));
    
    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No Reviews found for this room" }),
      };
    }
    
    const reviews = data.Items.map(mapDynamoDBItemToPlainObject);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ room_no, reviews }),
    };
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ message: "Failed to fetch reviews", error: err.message }),
    };
  }
};
