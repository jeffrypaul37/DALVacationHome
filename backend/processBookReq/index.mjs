import AWS from "aws-sdk";
import axios from "axios";

const sqs = new AWS.SQS();

export const handler = async (event) => {
  const queueUrl =
    "https://sqs.us-east-1.amazonaws.com/974751462886/bookingReq";

  const newBookingAPI_URL =
    "https://7sp8f37yv2.execute-api.us-east-1.amazonaws.com/prod/NewBooking";
  try {
    for (const record of event.Records) {
      const messageId = record.messageId;
      const messageBody = JSON.parse(record.body);

      console.log(messageBody);

      const transformedBody = {
        body: JSON.stringify({
          room: messageBody.room_no,
          startDate: messageBody.start_date,
          endDate: messageBody.end_date,
          userId: messageBody.user_id,
          userName: messageBody.user_name,
          userEmail: messageBody.user_email,
          roomName: messageBody.room_name,
          roomImage: messageBody.room_image,
          roomDesc: messageBody.room_desc,
          price: messageBody.price,
        }),
      };
      console.log(transformedBody);

      try {
        const response = await axios.post(newBookingAPI_URL, transformedBody);

        if (response.data.body === "Booking successful!") {
          console.log(`MessageID: ${messageId} - Booking successful`);
        } else if (
          response.data.body === "Room is not available for the selected dates."
        ) {
          console.log(
            `MessageID: ${messageId} - Booking failed: Room is not available for the selected dates.`
          );
        } else {
          console.log(
            `MessageID: ${messageId} - Booking failed with unexpected response: ${response.data.body}`
          );
        }
      } catch (error) {
        console.error(
          `MessageID: ${messageId} - Booking failed with error: ${error.message}`
        );
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify("All booking requests processed successfully"),
    };
  } catch (error) {
    console.error(
      `Failed to process booking requests with error: ${error.message}`
    );
    return {
      statusCode: 500,
      body: JSON.stringify("Failed to process booking requests"),
    };
  }
};
