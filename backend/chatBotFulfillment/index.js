const axios = require('axios');

const USER_ID = "0448f478-40e1-7089-7b28-2d2c6e001ae2";

//Url of ticket API
const ticketAPI_URL = 'https://tnllxndel1.execute-api.us-east-1.amazonaws.com/Dev';

//Url of bookings API
const bookingsAPI_url = "https://zto2h5nvo7.execute-api.us-east-1.amazonaws.com/prod/bookings";

exports.handler = async (event) => {

// Get intent and parameters from the request made by the agent
const intentName = event.queryResult.intent.displayName;

/*
INTENT: BOOKING DETAILS INTENT
*/
if (intentName === "Booking Details Intent") {
        const parameters = event.queryResult.parameters;

        // Get the booking_id and detail_type from the request payload
        const bookingId = parameters.booking_id;
        const detailType = parameters.detail_type;


        try {
            // Send a GET request to the bookings API to fetch booking details for the user
            const response = await axios.get(`${bookingsAPI_url}/${USER_ID}`);

            // If booking data is found, extract it and send it for processing based on detail_type
            if (response.status === 200 && response.data) {
                const bookings = response.data.bookings;
                const booking = bookings.find(b => b.booking_id === bookingId);


            //If a booking exists with given booking id and user id, return appropriate response 
                if (booking && booking.user_id === USER_ID) {
                    return generateResponse(booking, detailType);
                } 
                
                else {
                    return bookingNotFound();
                }
            } 
            
            else {
                return bookingNotFound();
            }

            //Log any error that occured while making API call
        } catch (error) {
            console.error('Error making API request:', error);
            return { fulfillmentText: "Error occurred while fetching booking details." };
        }
    }

/*
INTENT: BOOKING CONCERN INTENT - YES
*/
if (intentName === "Booking Concern Intent - yes") {
        // Extract booking_id and concern from the context
        const contexts = event.queryResult.outputContexts;
        let bookingId, concern;

        // Retrieve parameters from the context
        contexts.forEach(context => {
            if (context.parameters && context.parameters.booking_id && context.parameters.concern) {
                bookingId = context.parameters.booking_id;
                concern = context.parameters.concern;
            }
        });

        console.log(bookingId);
        console.log(concern);

        // Check if user has sent invalid parameters
        if (!bookingId || !concern) {
            return {
                fulfillmentText: "Error: Missing parameters. Please try again."
            };
        }

    //Query bookings to check if booking id exists
        try {
            const response = await axios.get(`${bookingsAPI_url}/${USER_ID}`);

            if (response.status === 200 && response.data) {
                const bookings = response.data.bookings;
                const booking = bookings.find(b => b.booking_id === bookingId);

                if (!booking || booking.user_id !== USER_ID) {
                    return bookingNotFound();
                }
            } else {
                return bookingNotFound();
            }

            //Generate a ticket number
            const ticketNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

            //Create a ticket object with attributes
            const ticket_details = {
                Ticket_Number: ticketNumber,
                Booking_Id: bookingId,
                User_Id: USER_ID,
                Concern: concern,
                Agent_Id: '',           //Intitaly when ticket created, no agent is assigned
                Status: 'Open'
            };

            //Log the created ticket in the database
            await axios.post(`${ticketAPI_URL}/ticket`, ticket_details);

            //Reset the context in the dialogflow agent
            const resetContext = {
                name: `${event.session}/contexts/bookingconcern-followup`,
                lifespanCount: 2,
                parameters: {}
            };

            //Return the ticket number to the customers
            return {
                fulfillmentText: `A ticket number ${ticketNumber} has been generated for your concern. An agent will contact you shortly to assit you.`,
                outputContexts: [resetContext]
            };
        } catch (error) {
            console.error(error);
          return cannotFulfillReq();
        }
    }

    return cannotFulfillReq();
};

/* 
UTILITY METHODS
*/

// Return fulfillment text based on the type of detail {'room number','duration of stay', 'booking details'}
function generateResponse(booking, detailType) {
    const bookingData = booking;
    const durationInDays = calculateDuration(new Date(bookingData.start_date), new Date(bookingData.end_date));

    switch (detailType) {
        case 'duration of stay':
            return {
                fulfillmentText: `Booking ID: ${bookingData.booking_id}\nStart Date: ${bookingData.start_date}\nEnd Date: ${bookingData.end_date}\nDuration of Stay (days): ${durationInDays}`
            };
        case 'room name':
            return {
                fulfillmentText: `Booking ID: ${bookingData.booking_id}\nRoom Name: ${bookingData.room_name}\nRoom Number: ${bookingData.room_no}`
            };
        case 'booking details':
            return {
                fulfillmentText: `Booking ID: ${bookingData.booking_id}\nRoom Name: ${bookingData.room_name}\nRoom Number: ${bookingData.room_no}\nStart Date: ${bookingData.start_date}\nEnd Date: ${bookingData.end_date}\nDuration of Stay (days): ${durationInDays}`
            };
        default:
            return {
                fulfillmentText: `Invalid detail type requested: ${detailType}`
            };
    }
}

//'Booking not found' message if booking was not found
function bookingNotFound() {
    return {
        fulfillmentText: "No booking found for the given booking id."
    };
}

//'User request cannot be fulfilled due to error
function cannotFulfillReq(){
    return {
        fulfillmentText: "No booking found for the given booking id."
    };
}

//Calculation duration of stay
function calculateDuration(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}


