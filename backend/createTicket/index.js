const AWS = require('aws-sdk');

//Initialize DynamoDB Client
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Extract the ticket details from the event payload
    const { Ticket_Number, User_Id, Booking_Id, Agent_Id, Concern, Status } = event;

    //Item to be inserted in 'Tickets' table
    const item = {
        Ticket_Number, User_Id, Booking_Id, Agent_Id, Concern, Status 
    };

    //Set the parameters
    const putParams = {
        TableName: 'Tickets',
        Item: item
    };

    //Based of the result of the insert operation, return success or failure
    try {
        await dynamoDb.put(putParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Ticket created successfully', ticket: item })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error creating ticket', error: error.message })
        };
    }
};
