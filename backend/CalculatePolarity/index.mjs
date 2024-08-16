import axios from 'axios';

export const handler = async (event) => {
    let body = event.body;
    if (typeof body === 'string') {
        body = JSON.parse(body);
    }
    if (!body.reviews) {
        console.error("Reviews data is missing");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No reviews provided" })
        };
    }
  
    const review_comments = body.reviews.map(review => review.comment);
    const room_no = body.room_no;
  
    try {
        const response = await axios.post(
            'https://us-central1-csci5410t30.cloudfunctions.net/feedbackPolarity',
            { textArray: review_comments }
        );
        // Include room_no in the response
        return {
            statusCode: 200,
            body: JSON.stringify({
                room_no: room_no,
                polarityData: response.data
            })
        };
    } catch (error) {
        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
