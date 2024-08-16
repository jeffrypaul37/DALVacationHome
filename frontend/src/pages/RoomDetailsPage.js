import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/system';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from '../theme';
import BreadcrumbSection from '../components/BreadcrumbSection';
import dayjs from 'dayjs';
import Reviews from '../components/Reviews';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { getCurrentUser } from '../utils/getCurrentUser';
import axios from 'axios';
import { Chip } from '@mui/material';

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '1rem',
  padding: '12px 24px',
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
}));

const RoomDetailsPage = () => {
  const roomExtraDetails = {
    rules: [
      'No smoking inside the room',
      'Check-in: After 02:00pm',
      'Late checkout: Additional charge 50% of the room rate',
      'Checkout: Before 11:00am',
      'No Pets',
      'Identification document is must for hotel registration',
    ],
  };

  const location = useLocation();
  const room = location.state?.room;

  const [mainImage, setMainImage] = useState(room.RoomImages[0]);
  const [checkInDate, setCheckInDate] = useState(dayjs());
  const [checkOutDate, setCheckOutDate] = useState(dayjs());
  const guestOptions = Array.from({ length: room.MaxGuest }, (_, i) => i + 1);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [invoice, setInvoice] = useState({ subtotal: 0, tax: 0, total: 0 });
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { isLoggedIn } = useAuth();
  const [error, setError] = useState('');
  const [bookingDisabled, setBookingDisabled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getCurrentUser().then(async attributes => {
      setUserId(attributes.sub);
      setName(attributes.name);
      setEmail(attributes.email);
    });

    const calculateTotal = () => {
      const subtotal = room.RoomPrice * numberOfRooms;
      const tax = subtotal * 0.15;
      const total = subtotal + tax;
      setInvoice({ subtotal, tax, total });
    };

    calculateTotal();
  }, [room.RoomPrice, numberOfRooms]);

  if (!room) {
    return <Typography variant="h4">Room not found</Typography>;
  }

  const handleImageClick = image => {
    setMainImage(image);
  };

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleBookingSubmit = async event => {
    event.preventDefault();

    if (checkInDate.isAfter(checkOutDate)) {
      setError('Check-in date cannot be later than Check-out date.');
      return;
    }

    if (checkOutDate.isBefore(checkInDate)) {
      setError('Check-out date cannot be earlier than Check-in date.');
      return;
    }

    const payload = {
      user_id: userId,
      user_name: name,
      user_email: email,
      room_no: room.RoomNumber,
      room_name: room.RoomName,
      room_image: mainImage,
      room_desc: room.RoomDesc,
      start_date: checkInDate.format('YYYY-MM-DD'),
      end_date: checkOutDate.format('YYYY-MM-DD'),
      price: invoice.total,
    };

    console.log(JSON.stringify(payload));
    try {
      const response = await axios.post(
        'https://8rez8wcsgd.execute-api.us-east-1.amazonaws.com/Development/booking-req',
        payload
      );
      alert('Booking Request Sent.');
      console.log('Booking Request Sent: ', response.data);
      setBookingDisabled(true);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleCheckingSubmit = async event => {
    event.preventDefault();

    if (checkInDate.isAfter(checkOutDate)) {
      setError('Check-in date cannot be later than Check-out date.');
      return;
    }

    if (checkOutDate.isBefore(checkInDate)) {
      setError('Check-out date cannot be earlier than Check-in date.');
      return;
    }

    const payload = {
      room_no: room.RoomNumber,
      room_name: room.RoomName,
      start_date: checkInDate.format('YYYY-MM-DD'),
      end_date: checkOutDate.format('YYYY-MM-DD'),
    };

    console.log('Payload:', payload);

    const formattedPayload = {
      body: JSON.stringify(payload),
    };

    try {
      const response = await axios.post(
        'https://xo4kowop7d.execute-api.us-east-1.amazonaws.com/prod/CheckAvailability',
        formattedPayload
      );

      const responseBody = JSON.parse(response.data.body);

      alert(`${responseBody.message}`);
      console.log('Availability Checked Successfully:', responseBody);
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking availability. Please try again.');
    }
  };

  const handleCheckInChange = newValue => {
    setCheckInDate(newValue);
    if (checkOutDate && newValue && newValue > checkOutDate) {
      setError('Check-in date cannot be later than Check-out date.');
    } else {
      setError('');
    }
  };

  const handleCheckOutChange = newValue => {
    setCheckOutDate(newValue);
    if (checkInDate && newValue && newValue < checkInDate) {
      setError('Check-out date cannot be earlier than Check-in date.');
    } else {
      setError('');
    }
  };

  const renderPolarityChip = theme => {
    console.log(theme.palette.chip.positive);
    if (!room.Polarity) {
      return (
        <Chip
          label="No Ratings"
          sx={{
            backgroundColor: theme.palette.chip.disabled,
            color: 'white',
          }}
        />
      );
    }

    let chipColor;
    switch (room.Polarity.toLowerCase()) {
      case 'positive':
      case 'overwhelmingly positive':
        chipColor = theme.palette.chip.positive;
        break;
      case 'negative':
      case 'overwhelmingly negative':
        chipColor = theme.palette.chip.negative;
        break;
      case 'neutral':
        chipColor = theme.palette.chip.neutral;
        break;
      default:
        chipColor = theme.palette.chip.disabled;
    }

    return (
      <Chip
        label={room.Polarity}
        sx={{
          backgroundColor: chipColor,
          fontWeight: 600,
          color: 'white',
        }}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BreadcrumbSection
        sectionName={room.RoomName}
        backgroundImage="/images/2.jpg"
      />
      <Box width="100%" py={6} px={4}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '500px',
                  overflow: 'hidden',
                  borderRadius: '20px',
                }}
              >
                <img
                  src={mainImage}
                  alt="Main Room"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Box
                mt={2}
                sx={{
                  overflowX: 'hidden',
                  width: '100%',
                }}
              >
                <Slider {...sliderSettings}>
                  {room.RoomImages.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: '100%',
                        padding: '0 5px',
                      }}
                    >
                      <Box
                        sx={{
                          height: '130px',
                          overflow: 'hidden',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          border: '2px solid transparent',
                          '&:hover': {
                            border: `2px solid ${theme.palette.primary.main}`,
                          },
                        }}
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={image}
                          alt={`Room Image ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Slider>
              </Box>
              <CardContent>
                <Typography variant="h5" fontWeight={600} gutterBottom mt={1}>
                  Description
                </Typography>
                <Divider />
                <Typography
                  variant="body1"
                  color="textSecondary"
                  paragraph
                  mt={1}
                >
                  {room.RoomDesc}
                </Typography>
                <Typography variant="h5" fontWeight={600} gutterBottom mt={2}>
                  Amenities
                </Typography>
                <Divider />
                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                  <Grid container spacing={2}>
                    {room.RoomAmenities.map((amenity, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <li>
                          <Typography variant="body1">{amenity}</Typography>
                        </li>
                      </Grid>
                    ))}
                  </Grid>
                </ul>
                <Typography variant="h5" fontWeight={600} gutterBottom mt={2}>
                  Rules & Regulations
                </Typography>
                <Divider />
                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                  {roomExtraDetails.rules.map((rule, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      <Typography variant="body1">{rule}</Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Check Availability
                </Typography>
                <Divider />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={6}>
                      <DatePicker
                        label="Check In"
                        value={checkInDate}
                        onChange={handleCheckInChange}
                        renderInput={params => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        label="Check Out"
                        value={checkOutDate}
                        onChange={handleCheckOutChange}
                        renderInput={params => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    </Grid>
                  </Grid>
                  {error && (
                    <Typography color="error" variant="body2" mt={2}>
                      {error}
                    </Typography>
                  )}
                </LocalizationProvider>

                <Box mt={4}>
                  <CustomButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleCheckingSubmit}
                  >
                    Check Now
                  </CustomButton>
                </Box>

                {isLoggedIn ? (
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      mt={4}
                    >
                      Book this Room
                    </Typography>
                    <Divider />
                    <TextField
                      fullWidth
                      label="Room"
                      select
                      defaultValue="1"
                      onChange={e => setNumberOfRooms(e.target.value)}
                      sx={{ mt: 2 }}
                    >
                      {[1, 2, 3, 4].map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label="No. of Guest"
                      select
                      defaultValue="1"
                      sx={{ mt: 2 }}
                    >
                      {guestOptions.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      mt={4}
                    >
                      Your Total
                    </Typography>
                    <Divider />
                    <Box mt={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body1">Subtotal:</Typography>
                        <Typography variant="body1">
                          ${invoice.subtotal.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body1">Tax (15%):</Typography>
                        <Typography variant="body1">
                          ${invoice.tax.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="h5">Total:</Typography>
                        <Typography variant="h5">
                          ${invoice.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box mt={4}>
                      <CustomButton
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleBookingSubmit}
                        disabled={bookingDisabled}
                      >
                        Book Now
                      </CustomButton>
                    </Box>
                  </Box>
                ) : null}
              </CardContent>
            </Card>
            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Reviews
                  </Typography>
                  {renderPolarityChip(theme)}
                </Box>
                <Divider />
                <Reviews room={room.RoomNumber} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default RoomDetailsPage;
