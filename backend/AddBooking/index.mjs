import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const dbClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
    
    console.log(JSON.stringify(event,null,2));
    
  const { roomName, user_id, user_name, user_email, room_no, room_name, room_image, start_date, end_date, price, room_desc } = event;

  const bookingId = uuidv4();

  const params = {
    TableName: "Bookings",
    Item: {
      booking_id: { S: bookingId },
      user_id: { S : user_id },
      user_name: { S : user_name },
      user_email: { S : user_email },
      room_no: { S: room_no },
      room_name: { S: room_name },
      room_image: { S: room_image },
      room_desc: { S: room_desc },
      start_date: { S: start_date },
      end_date: { S: end_date },
      price: { N: price.toString() },
    },
  };
  
  console.log(params);

  try {
    await dbClient.send(new PutItemCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking created successfully", bookingId }),
    };
  } catch (err) {
    console.error("Error adding booking:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to add booking", error: err.message }),
    };
  }
};
