const AWS = require("aws-sdk");
const axios = require("axios");

const GCP_FUNCTION_URL =
  "https://us-central1-csci5410t30.cloudfunctions.net/receiveTicket";

exports.handler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName === "INSERT") {
      const newImage = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb.NewImage
      );

      const ticketDetails = {
        Ticket_Number: newImage.Ticket_Number,
        Concern: newImage.Concern,
        User_Id: newImage.User_Id,
        Booking_Id: newImage.Booking_Id,
      };
      console.log(ticketDetails);

      try {
        await axios.post(GCP_FUNCTION_URL, ticketDetails);
        console.log("Message sent to GCP Cloud Function");
      } catch (error) {
        console.error("Error sending message to GCP Cloud Function:", error);
      }
    }
  }

  console.log("Successful!!");
};
