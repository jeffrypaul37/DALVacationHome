import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
const client = new DynamoDBClient();

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function caesarCipherEncrypt(str, shift) {
    // Ensure the shift is within the range of 0-25
    shift = shift % 26;

    // Convert the string to an array of characters
    const chars = str.split('');

    // Map each character to its encrypted form
    const encryptedChars = chars.map(char => {
        // Get the character code of the current character
        const charCode = char.charCodeAt(0);

        // Check if the character is an uppercase letter
        if (charCode >= 65 && charCode <= 90) {
            return String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
        }
        // Check if the character is a lowercase letter
        else if (charCode >= 97 && charCode <= 122) {
            return String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
        }
        // If the character is not a letter, return it as is
        else {
            return char;
        }
    });

    // Join the array of characters back into a string
    return encryptedChars.join('');
}


export const handler = async(event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  if(event.request.challengeName !== "CUSTOM_CHALLENGE"){
    return event;
  }
  
  if(event.request.session.length === 2){
    event.response.publicChallengeParameters = {};
    event.response.privateChallengeParameters = {};
    try {
      const input = {
        TableName: 'Users',
        Key: {
          'userId' : { S: event.userName }
        }
      }
      const command = new GetItemCommand(input);
      const response = await client.send(command);
      const userData = unmarshall(response.Item);
      event.response.publicChallengeParameters.type = "SECURITY_QUESTION";
      event.response.publicChallengeParameters.securityQuestion = userData.securityQuestion;
      event.response.privateChallengeParameters.answer = userData.answer;
      event.response.challengeMetadata = "SECURITY_QUESTION";
    }catch(error){
      throw new Error("Error Fetching Data: ", error)
    }
  }
  
  if(event.request.session.length === 3){
    const code = ['CODE', 'ROOT', 'PASS', 'USER', 'SAFE', 'HACK', 'LOCK'];
    const random_index = getRandomNumber(0,code.length);
    event.response.publicChallengeParameters = {};
    event.response.privateChallengeParameters = {};
    try {
      const input = {
        TableName: 'Users',
        Key: {
          'userId' : { S: event.userName }
        }
      }
      const command = new GetItemCommand(input);
      const response = await client.send(command);
      const userData = unmarshall(response.Item);
      event.response.publicChallengeParameters.type = "CAESAR";
       event.response.publicChallengeParameters.name = userData.name;
        event.response.publicChallengeParameters.email = userData.email;
         event.response.publicChallengeParameters.role = userData.role;
      event.response.publicChallengeParameters.securityQuestion = caesarCipherEncrypt(code[random_index], userData.cipherKey);
      event.response.publicChallengeParameters.cipherKey = userData.cipherKey;
      event.response.privateChallengeParameters.answer = code[random_index];
      event.response.challengeMetadata = "CAESAR";
    }catch(error){
      throw new Error("Error Fetching Data: ", error)
    }
  }
  
  return event;
}