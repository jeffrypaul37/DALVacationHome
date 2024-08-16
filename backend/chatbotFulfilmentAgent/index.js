const axios = require('axios');

// Url of bookings API
const bookingsAPI_url = 'https://l15fomtb6d.execute-api.us-east-1.amazonaws.com/prod/getAllBookings';

exports.handler = async (event) => {
    // Get intent and parameters from the request made by the agent
    const intentName = event.queryResult.intent.displayName;

    /*
    INTENT: BOOKING DETAILS INTENT
    */
    if (intentName === "Booking Details Intent") {
        const parameters = event.queryResult.parameters;

        console.log(parameters)

        // Get the booking_id and detail_type from the request payload
        const bookingId = parameters.booking_id;
        const detailType = parameters.booking_detail_type;

        try {
            // Send a GET request to the bookings API to fetch booking details
            const response = await axios.get(bookingsAPI_url);

            // If booking data is found, extract it and send it for processing based on detail_type
            if (response.status === 200 && response.data && response.data.body && response.data.body.bookings) {
                const bookings = response.data.body.bookings;
                const booking = bookings.find(b => b.booking_id === bookingId);

                // If a booking exists with given booking id, return appropriate response
                if (booking) {
                    return generateResponse(booking, detailType);
                } else {
                    return bookingNotFound();
                }
            } else {
                return bookingNotFound();
            }
        } catch (error) {
            console.error('Error making API request:', error);
            return { fulfillmentText: "Error occurred while fetching booking details." };
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

// 'Booking not found' message if booking was not found
function bookingNotFound() {
    return {
        fulfillmentText: "No booking found for the given booking id."
    };
}

// 'User request cannot be fulfilled due to error
function cannotFulfillReq(){
    return {
        fulfillmentText: "Cannot fulfill the request at the moment."
    };
}

// Calculate duration of stay
function calculateDuration(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
