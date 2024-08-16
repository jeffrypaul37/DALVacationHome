const axios = require("axios");
const nodemailer = require("nodemailer");

const Agents_API_URL =
  "https://1i8w3pbgsb.execute-api.us-east-1.amazonaws.com/prod/getPropertyAgents";

const Bookings_API_URL =
  "https://l15fomtb6d.execute-api.us-east-1.amazonaws.com/prod/getAllBookings";

const demoemail = "help.dalvacationhome@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "help.dalvacationhome@gmail.com",
    pass: "lgju pghl kpmt pgpz",
  },
});

exports.handler = async (event) => {
  for (const record of event.Records) {
    if (
      record.eventName === "MODIFY" &&
      record.dynamodb.NewImage.Status.S === "Open"
    ) {
      const newImage = record.dynamodb.NewImage;

      const agentId = newImage.Agent_Id.S;
      const ticketNumber = newImage.Ticket_Number.S;
      const bookingId = newImage.Booking_Id.S;
      const concern = newImage.Concern.S || "No specific concern provided";

      const agents = await fetchAgents();
      const agent = agents.find((a) => a.userId === agentId);

      if (agent) {
        const agentName = agent.name;
        const agentEmail = agent.email;

        const bookings = await fetchBookings();
        const booking = bookings.find((b) => b.booking_id === bookingId);

        if (booking) {
          const customerEmail = booking.user_email;
          const customerName = booking.user_name;
          const userId = booking.user_id;

          const customerEmailOptions = {
            from: "help.dalvacationhome@gmail.com",
            to: [demoemail, customerEmail],
            subject: `Agent Assigned to Ticket Number ${ticketNumber}`,
            text: `Dear ${customerName},\n\nWe are pleased to inform you that an agent has been assigned to your ticket (Ticket Number: ${ticketNumber}) associated with Booking ID: ${bookingId}.\n\nAgent Details:\nName: ${agentName}\nEmail: ${agentEmail}\n\nThe agent will reach out to you within the next 2 business days. If you do not hear from the agent within this timeframe, please feel free to contact them directly at their email address, ensuring to include the ticket number in your correspondence.\n\nThank you for your patience.\n\nBest regards,\nDAL Vacation Home`,
          };

          const agentEmailOptions = {
            from: "help.dalvacationhome@gmail.com",
            to: [demoemail, agentEmail],
            subject: `Ticket Number ${ticketNumber} Assigned to You`,
            text: `Dear ${agentName},\n\nYou have been assigned a new ticket for resolution. Please find the details below:\n\nTicket Number: ${ticketNumber}\nBooking ID: ${bookingId}\nConcern: ${concern}\n\nCustomer Details:\nUser ID: ${userId}\nName: ${customerName}\nEmail: ${customerEmail}\n\nBooking Details:\nRoom Number: ${booking.room_no}\nRoom Name: ${booking.room_name}\nStart Date: ${booking.start_date}\nEnd Date: ${booking.end_date}\n\nPlease contact the customer within the next 2 business days to address their concerns.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nDAL Vacation Home`,
          };

          try {
            await transporter.sendMail(customerEmailOptions);
            console.log(`Email sent to customer ${customerEmail}`);

            await transporter.sendMail(agentEmailOptions);
            console.log(`Email sent to agent ${agentEmail}`);
          } catch (error) {
            console.error("Error sending email", error);
          }
        } else {
          console.log("No booking found with the specified bookingId");
        }
      } else {
        console.log("No agent found with the specified agentId");
      }
    } else {
      console.log("Agent_Id not updated");
    }
  }
};

//Fetch all property agent details in the system
const fetchAgents = async () => {
  try {
    const response = await axios.get(Agents_API_URL);
    return response.data.body.PropertyAgents;
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error;
  }
};

//Fetch all booking details
const fetchBookings = async () => {
  try {
    const response = await axios.get(Bookings_API_URL);
    return response.data.body.bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};
