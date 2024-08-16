// src/pages/HomePage.js

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import RoomCard from '../components/RoomCard';
import { CircularProgress, Divider } from '@mui/material';
import Slider from 'react-slick';
import { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DecorativeDivider = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        my: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          height: '3px',
          backgroundColor: '#a1b3cc',
          mx: 1,
        }}
      >
        <Divider sx={{ mx: 4, color: '#a1b3cc' }} />
      </Box>
      <Typography
        variant="h5"
        component="div"
        color="white"
        sx={{
          mx: 2,
        }}
      >
        Dalhousie Vacation Home & Resort
      </Typography>
      <Box
        sx={{
          flex: 1,
          height: '3px',
          backgroundColor: '#a1b3cc',
          mx: 1,
        }}
      >
        <Divider sx={{ mx: 4, color: '#a1b3cc' }} />
      </Box>
    </Box>
  );
};

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(
      'https://4idiu1l816.execute-api.us-east-1.amazonaws.com/prod/getAllRooms'
    )
      .then(response => response.json())
      .then(data => {
        if (data.statusCode === 200) {
          const rooms = data.body.rooms;
          // console.log('Rooms:', rooms);
          const filteredRooms = rooms.filter(room =>
            [101, 102, 203].includes(parseInt(room.RoomNumber))
          );
          // console.log('FeaturedRooms:', featuredRooms);
          setFeaturedRooms(filteredRooms);
        } else {
          console.error('Failed to fetch rooms:', data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching the rooms data: ', error);
        setLoading(false);
      });
  }, []);

  const reviewSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className="flex-1">
        <Box
          sx={{
            width: '100%',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: `url("/images/2.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            textAlign: 'center',
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1,
            },
            '& > *': {
              position: 'relative',
              zIndex: 2,
            },
          }}
        >
          <DecorativeDivider />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            color={'white'}
            fontWeight={600}
          >
            A Symphony of Comfort and Convenience.
          </Typography>
          <Box mt={3} display="flex" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              color="primary"
              href="/rooms"
              sx={{
                fontSize: '1.25rem',
                padding: '12px 24px',
                border: '2px solid transparent',
                borderRadius: '20px',
                transition: 'all 0.1s ease',
                textTransform: 'none',
                fontWeight: 700,
                backgroundColor: '#a1b3cc',
                color: '#1f2937',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#a1b3cc',
                  borderColor: '#a1b3cc',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                },
              }}
            >
              Rooms & Suites
            </Button>
          </Box>
        </Box>
        <Box width="100%" py={12} px={4} bgcolor="#e6f0ff">
          <Typography
            variant="h3"
            component="h5"
            align="center"
            color=""
            gutterBottom
          >
            Featured Rooms
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            align="center"
            paragraph
          >
            Discover our top-rated accommodations, each with its own unique
            charm and amenities.
          </Typography>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ margin: '0 auto', maxWidth: '1500px' }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              featuredRooms.map(room => (
                <Grid xs={12} sm={6} lg={4} key={room.title}>
                  {<RoomCard room={room} />}
                </Grid>
              ))
            )}
          </Grid>
        </Box>
        <Box width="100%" py={12} px={4} bgcolor="#d0e1ff">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            What Our Guests Say
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            align="center"
            paragraph
          >
            Hear from our satisfied customers about their experiences staying
            with us.
          </Typography>
          <Box
            sx={{ maxWidth: '1500px', margin: '0 auto', position: 'relative' }}
          >
            <Slider {...reviewSliderSettings}>
              {guestReviews.map(review => (
                <Box px={2} key={review.name}>
                  <Card
                    sx={{
                      p: 4,
                      backgroundColor: 'background.paper',
                      border: '1px solid #e0e7ff',
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box display="flex" justifyContent="center" mb={2}>
                        <Avatar
                          sx={{ bgcolor: '#e0e7ff', width: 56, height: 56 }}
                        >
                          <Typography variant="h5">
                            {review.name.charAt(0)}
                          </Typography>
                        </Avatar>
                      </Box>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {review.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {review.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        mt={2}
                        sx={{ fontStyle: 'italic', color: '#4a4a4a' }}
                      >
                        {review.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      </main>
    </ThemeProvider>
  );
};

const guestReviews = [
  {
    name: 'John Doe',
    title: 'Satisfied Customer',
    content:
      'The room was absolutely stunning, and the staff went above and beyond to make our stay unforgettable.',
  },
  {
    name: 'Jane Appleseed',
    title: 'Satisfied Customer',
    content:
      "The location was perfect, and the amenities were top-notch. We had an amazing time and can't wait to return.",
  },
  {
    name: 'Sarah Mclaughlin',
    title: 'Satisfied Customer',
    content:
      "The attention to detail and personalized service made our stay truly exceptional. We can't wait to come back!",
  },
];

export default HomePage;
