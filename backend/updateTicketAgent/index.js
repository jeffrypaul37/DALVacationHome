const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(event);

  const { Ticket_Number, Agent_Id } = event;

  if (!Ticket_Number || !Agent_Id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Ticket_Number and Agent_Id are required",
      }),
    };
  }

  const updateParams = {
    TableName: "Tickets",
    Key: { Ticket_Number: Ticket_Number },
    UpdateExpression: "SET Agent_Id = :agent_id",
    ExpressionAttributeValues: { ":agent_id": Agent_Id },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDb.update(updateParams).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
