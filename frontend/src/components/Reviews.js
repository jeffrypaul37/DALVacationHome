import React from 'react';
import { Box, Typography, Avatar, Grid, Divider, Rating } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = ({ room }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://vmw0hiavr5.execute-api.us-east-1.amazonaws.com/prod/reviews/${room}`
        );
        setReviews(response.data.reviews);
        console.log(response.data.reviews);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchReviews();
  }, [room]);

  return (
    <Box mt={2} height={387} sx={{ overflow: 'hidden', position: 'relative' }}>
      <Box
        sx={{
          height: '100%',
          overflowY: 'scroll',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '0px',
          },
        }}
      >
        {reviews.map((review, index) => (
          <Box key={index} mb={2}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar>{review.user_name.charAt(0)}</Avatar>
                    <Typography variant="subtitle1" fontWeight="bold" ml={1}>
                      {review.user_name}
                    </Typography>
                  </Box>
                  <Rating
                    name={`review-rating-${index}`}
                    value={review.rating}
                    readOnly
                  />
                </Box>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ textAlign: 'left' }}>
                  {review.comment}
                </Typography>
              </Grid>
            </Grid>
            {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Reviews;
