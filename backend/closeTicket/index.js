const AWS = require('aws-sdk');

//Initialize a DynamoDB client
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    //Get the 'Ticket_Number' from event payload
    const { 'Ticket_Number': ticketNumber } = event;

    //Bad Request: No 'Ticket_Number' in request body
    if (!ticketNumber) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing parameter: Ticket_Number'}),
        };
    }

    //Query record with 'Ticket_Number' and set 'Status' = 'Closed'
    const params = {
        TableName: 'Tickets',
        Key: {
            'Ticket_Number': ticketNumber
        },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: {
            '#status': 'Status'
        },
        ExpressionAttributeValues: {
            ':status': 'Closed'
        },
        ReturnValues: 'UPDATED_NEW'
    };

    //Based on the result of the update, return operation success/failure
    try {
        const result = await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Ticket status updated successfully',
                updatedAttributes: result.Attributes
            }),
        };
    } catch (error) {
        console.error('Error updating ticket status:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error updating ticket status',
                error: error.message
            }),
        };
    }
};
