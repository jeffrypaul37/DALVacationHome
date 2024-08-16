const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = "Tickets";

exports.handler = async (event) => {
  const agentId = event.Agent_Id;

  console.log(agentId);

  const params = {
    TableName: tableName,
    FilterExpression: "Agent_Id = :agent_id AND #status = :status",
    ExpressionAttributeNames: {
      "#status": "Status",
    },
    ExpressionAttributeValues: {
      ":agent_id": agentId,
      ":status": "Open",
    },
  };

  try {
    const data = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve tickets" }),
    };
  }
};
