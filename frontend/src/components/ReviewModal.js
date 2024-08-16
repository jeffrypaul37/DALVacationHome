import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Rating,
  Modal,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import axios from 'axios';

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '1.5rem',
  padding: '5px 10px',
  border: '2px solid transparent',
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

const ReviewModal = ({ open, handleClose, selectedBooking, name }) => {
  const [reviewComment, setReviewComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleReviewSubmit = async () => {
    const reviewData = {
      user_name: name,
      room_no: selectedBooking.room_no,
      comment: reviewComment,
      rating: rating,
    };

    try {
      const response = await axios.post(
        'https://iixkp1fan8.execute-api.us-east-1.amazonaws.com/prod/updateRoomReviewPolarity',
        reviewData
      );
      if (response.status === 200) {
        console.log('Review submitted successfully:', response.data);
      }
      handleClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {selectedBooking && (
          <>
            <Grid container spacing={2} alignItems="center">
              <Grid
                item
                xs={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h4" component="h2" textAlign={'center'}>
                  Leave a Review
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={0.5}>
              <Grid item xs={12} sm={4} md={4}>
                <Avatar
                  variant="rounded"
                  src={selectedBooking.room_image}
                  alt={selectedBooking.room_name}
                  sx={{
                    width: '100%',
                    height: 200,
                    borderRadius: '10px',
                    my: 2,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <Typography variant="h5" component="h2" mt={2} fontWeight={600}>
                  {selectedBooking.room_name}
                </Typography>
                <Typography variant="h6" component="h2" fontWeight={100}>
                  {selectedBooking.room_desc}
                </Typography>
                <Rating
                  name="simple-controlled"
                  size="large"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  sx={{ mt: 2, fontSize: '2.5rem' }}
                />
              </Grid>
            </Grid>
            <TextField
              label="Review Comment"
              multiline
              rows={4}
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <CustomButton
              variant="contained"
              color="primary"
              onClick={handleReviewSubmit}
              fullWidth
            >
              Submit Review
            </CustomButton>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ReviewModal;
