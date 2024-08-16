import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const dbClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
    
  console.log(JSON.stringify(event,null,2));
    
  const {room_no, user_name, comment, rating} = event;

  const reviewId = uuidv4();

  const params = {
    TableName: "Reviews",
    Item: {
      review_id: { S: reviewId },
      room_no: { S: room_no },
      user_name: { S: user_name },
      comment: { S: comment },
      rating: { N: rating.toString() },
    },
  };
  
  console.log(params);

  try {
    await dbClient.send(new PutItemCommand(params));
    return {
      statusCode: 200,
      room_no: room_no,
      body: JSON.stringify({ message: "Review Added successfully", reviewId }),
    };
  } catch (err) {
    console.error("Error adding booking:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to add Review", error: err.message }),
    };
  }
};
