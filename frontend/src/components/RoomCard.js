/* eslint-disable no-debugger */
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Grid,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const CustomLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  position: 'relative',
  fontSize: '20px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    '.MuiSvgIcon-root': {
      transform: 'translateX(5px)',
      transition: 'all 0.3s ease',
    },
  },
});

const CustomButton = styled(Button)(({ theme, color }) => ({
  fontSize: '1.1rem',
  padding: '8px 16px',
  border: `2px solid ${theme.palette[color].main}`,
  backgroundColor: theme.palette[color].main,
  borderRadius: '10px',
  color: theme.palette.getContrastText(theme.palette[color].main),
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette[color].main,
    borderColor: theme.palette[color].main,
  },
}));

const RoomCard = ({ room, role, setSelectedRoom, handleMenuClick }) => {
  const navigate = useNavigate();
  const displayImage =
    room.RoomImages && room.RoomImages.length > 0 ? room.RoomImages[0] : null;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handleMenuClick('ViewRooms');
    setOpen(false);
  };

  const handleViewDetails = () => {
    navigate(`/rooms/${encodeURIComponent(room.RoomName)}`, {
      state: { room },
    });
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://ocurbea0og.execute-api.us-east-1.amazonaws.com/prod/deleteRoom/${room.RoomNumber}`
      );
      console.log('Response:', response);
      if (response.status === 200) {
        alert(response.data.message);
        handleClose();
      } else {
        console.error('Failed to delete room:', response.data);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleUpdate = () => {
    setSelectedRoom(room);
    handleMenuClick('EditRooms');
  };

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        border: '2px solid #e0e7ff',
        borderRadius: '20px',
        padding: 2,
      }}
    >
      <Box
        sx={{
          height: '300px',
          overflow: 'hidden',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        <img
          src={displayImage}
          alt={room.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px',
          }}
        />
      </Box>
      <CardContent sx={{ textAlign: 'left' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {room.RoomName}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom mt={2}>
          {room.RoomDesc}
        </Typography>
        {role !== 'Property Agent' ? (
          <Box
            mt={4}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'left',
            }}
          >
            <CustomLink
              component="button"
              onClick={handleViewDetails}
              underline="always"
              color="primary"
              display="flex"
              alignItems="center"
            >
              View Details{' '}
              <ArrowForward fontSize="medium" sx={{ marginLeft: 0.5 }} />
            </CustomLink>
          </Box>
        ) : (
          <Box mt={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6} md={6}>
                <CustomButton
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={handleUpdate}
                >
                  <Edit fontSize="small" sx={{ marginRight: 0.5 }} />
                  Edit
                </CustomButton>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <CustomButton
                  color="error"
                  variant="contained"
                  fullWidth
                  onClick={handleClickOpen}
                >
                  <Delete fontSize="small" sx={{ marginRight: 0.5 }} /> Delete
                </CustomButton>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete Room'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this room?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RoomCard;
