const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { LanguageServiceClient } = require('@google-cloud/language');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();


const languageClient = new LanguageServiceClient({
    keyFilename: './csci-5410-serverless-428300-ab31a78fbab7.json', 
});

exports.handler = async (event) => {
    let feedbackMessage;
    let username;

    try {
        const body = JSON.parse(event.body);
        if (!body || !body.feedbackMessage || !body.username) {
            throw new Error("Missing feedbackMessage or username in request body");
        }
        feedbackMessage = body.feedbackMessage;
        username = body.username;
    } catch (error) {
        console.error("Error parsing event body: ", error.message);
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'Invalid request body' })
        };
    }

    const params = {
        UserPoolId: 'us-east-1_5jGdf9JTb', 
        Username: username
    };

    let role;
    try {
        const user = await cognito.adminGetUser(params).promise();
        const roleAttribute = user.UserAttributes.find(attr => attr.Name === 'custom:role');
        role = roleAttribute ? roleAttribute.Value : null;
    } catch (error) {
        console.error('Error retrieving user details:', error.message);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'Failed to retrieve user details' })
        };
    }

    if (role !== 'registered_customer') {
        return {
            statusCode: 403,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'Only registered customers can submit feedback' })
        };
    }

    let sentimentScore;
    let sentimentMagnitude;
    try {
        const document = {
            content: feedbackMessage,
            type: 'PLAIN_TEXT',
        };
        const [result] = await languageClient.analyzeSentiment({ document });
        sentimentScore = result.documentSentiment.score;
        sentimentMagnitude = result.documentSentiment.magnitude;
    } catch (error) {
        console.error('Error analyzing sentiment:', error.message);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'Failed to analyze sentiment' })
        };
    }

    const feedbackId = uuidv4();
    const feedbackDetails = {
        feedbackId,
        username,
        feedbackMessage,
        sentimentScore,
        sentimentMagnitude,
    };

    const paramsDynamoDb = {
        TableName: 'UserFeedback',
        Item: feedbackDetails,
    };

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    try {
        await dynamoDb.put(paramsDynamoDb).promise();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Feedback submitted successfully', feedbackId })
        };
    } catch (error) {
        console.error('Error saving to DynamoDB: ', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Failed to submit feedback', error })
        };
    }
};
