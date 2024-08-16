const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { email, questions, answers, passphrase, shiftValue } = JSON.parse(event.body);

    const encodePassphrase = (str, shift) => {
        return str.replace(/[a-z]/gi, char => {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(
                start + ((char.charCodeAt(0) - start + shift) % 26)
            );
        });
    };

    const encodedPassphrase = encodePassphrase(passphrase, shiftValue);

    const params = {
        TableName: 'UserSecurityQuestions',
        Item: {
            email,
            questions,
            answers,
            passphrase,
            encodedPassphrase,
            shiftValue
        }
    };

    try {
        await dynamo.put(params).promise();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({ message: 'Security questions and passphrase saved successfully!' })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({ message: 'Failed to save security questions and passphrase.' })
        };
    }
};
