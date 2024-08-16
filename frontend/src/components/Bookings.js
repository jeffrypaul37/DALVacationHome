import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TextField,
  Grid,
  Card,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import { getCurrentUser } from '../utils/getCurrentUser';
import ReviewModal from './ReviewModal';
import { RateReview } from '@mui/icons-material';

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

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [bookingReference, setBookingReference] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const attributes = await getCurrentUser();
        const userId = attributes.sub;
        setName(attributes.name);
        const response = await axios.get(
          `https://zto2h5nvo7.execute-api.us-east-1.amazonaws.com/prod/bookings/${userId}`
        );
        setBookings(response.data.bookings);
        console.log(response.data.bookings);
        setFilteredBookings(response.data.bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleFilter = () => {
    let filtered = bookings;

    if (checkInDate) {
      const formattedCheckInDate = checkInDate.format('YYYY-MM-DD');
      filtered = filtered.filter(
        booking => booking.start_date === formattedCheckInDate
      );
    }

    if (checkOutDate) {
      const formattedCheckOutDate = checkOutDate.format('YYYY-MM-DD');
      filtered = filtered.filter(
        booking => booking.end_date === formattedCheckOutDate
      );
    }

    if (bookingReference) {
      filtered = filtered.filter(booking =>
        booking.booking_id.includes(bookingReference)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleReset = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
    setBookingReference('');
    setFilteredBookings(bookings);
  };

  const handleOpen = booking => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h4" gutterBottom color="primary">
        My Bookings
      </Typography>
      <Box sx={{ p: 1 }}>
        <Card sx={{ mb: 2, p: 4, borderRadius: '10px' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Check-In Date"
                  value={checkInDate}
                  onChange={newValue => setCheckInDate(newValue)}
                  renderInput={params => <TextField {...params} fullWidth />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Check-Out Date"
                  value={checkOutDate}
                  onChange={newValue => setCheckOutDate(newValue)}
                  renderInput={params => <TextField {...params} fullWidth />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Booking Reference"
                  fullWidth
                  value={bookingReference}
                  onChange={e => setBookingReference(e.target.value)}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <CustomButton
                variant="contained"
                fullWidth
                onClick={handleFilter}
              >
                Filter
              </CustomButton>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomButton variant="contained" fullWidth onClick={handleReset}>
                Reset
              </CustomButton>
            </Grid>
          </Grid>
        </Card>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: '60vh',
            borderRadius: '10px',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          <Table stickyHeader aria-label="bookings table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderTopLeftRadius: '10px',
                  }}
                >
                  Room Image
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  Room Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  Room Number
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  Booking Reference Number
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  Check-In Date
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  Check-Out Date
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  Booking Amount
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderTopRightRadius: '10px',
                  }}
                >
                  Add Review
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map(booking => (
                <TableRow key={booking.booking_id}>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={booking.room_image}
                      alt={booking.room_name}
                      sx={{ width: 170, height: 100, borderRadius: '10px' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {booking.room_name}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {booking.room_no}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {booking.booking_id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {new Date(booking.start_date).toISOString().split('T')[0]}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {new Date(booking.end_date).toISOString().split('T')[0]}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    ${booking.price}
                  </TableCell>
                  <TableCell>
                    <CustomButton
                      variant="contained"
                      sx={{ fontWeight: 'bold' }}
                      fullWidth
                      onClick={() => handleOpen(booking)}
                    >
                      <RateReview sx={{ fontSize: '2rem' }} />
                    </CustomButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ReviewModal
          open={open}
          handleClose={handleClose}
          selectedBooking={selectedBooking}
          name={name}
        />
      </Box>
    </ThemeProvider>
  );
};

export default MyBookings;
