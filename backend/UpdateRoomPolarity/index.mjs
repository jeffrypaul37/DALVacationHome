import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  
  console.log("Received Event: " + JSON.stringify(event,null,2));
  
  try {
  
    let body = event.body;
    if (typeof body === 'string') {
        body = JSON.parse(body);
    }
    
    const { room_no, polarityData } = body; 
    
    console.log("Room Number: "+room_no);
    console.log("Polarity: "+polarityData.overallPolarity);

    const params = {
      TableName: "Rooms",
      Key: {
        RoomNumber: { N: room_no.toString() }
      },
      UpdateExpression: "SET Polarity = :p",
      ExpressionAttributeValues: {
        ":p": { S: polarityData.overallPolarity }
      },
      ReturnValues: "UPDATED_NEW"
    };

    const result = await dynamoClient.send(new UpdateItemCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Room updated successfully", updatedAttributes: result.Attributes }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
