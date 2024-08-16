const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
    const { email } = JSON.parse(event.body);
    const message = `Welcome back, ${email}!`;

    const subscribeParams = {
        Protocol: 'email',
        TopicArn: 'arn:aws:sns:us-east-1:731881833705:LoginNotification', 
        Endpoint: email,
    };

    const notifyParams = {
        Message: message,
        TopicArn: 'arn:aws:sns:us-east-1:731881833705:LoginNotification', 
        Subject: 'Login Successful'
    };

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    try {
        await sns.subscribe(subscribeParams).promise();
        await sns.publish(notifyParams).promise();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Login notification sent successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Failed to send login notification', error })
        };
    }
};
