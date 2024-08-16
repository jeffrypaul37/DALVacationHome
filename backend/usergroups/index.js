const AWS = require('aws-sdk');
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const userPoolId = event.userPoolId;
    const username = event.userName;
    const userAttributes = event.request.userAttributes;
    const userEmail = userAttributes.email;

    const role = userAttributes['custom:role'];

    console.log('Role:', role);

    let groupName;
    if (role === 'registered_customer') {
        groupName = 'registered_customer';
    } else if (role === 'property_agent') {
        groupName = 'property_agent';
    }

    if (groupName) {
        const params = {
            GroupName: groupName,
            UserPoolId: userPoolId,
            Username: username
        };

        try {
            await cognitoIdentityServiceProvider.adminAddUserToGroup(params).promise();
            console.log(`User ${username} added to group ${groupName}`);
        } catch (error) {
            console.error(`Error adding user to group: ${error}`);
        }
    }

    return event;
};
