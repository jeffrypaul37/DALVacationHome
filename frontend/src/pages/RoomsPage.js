import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import BreadcrumbSection from '../components/BreadcrumbSection';
import Grid from '@mui/material/Unstable_Grid2';
import RoomCard from '../components/RoomCard';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

const RoomsPage = () => {
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
          setFeaturedRooms(data.body.rooms);
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BreadcrumbSection
        sectionName="Rooms"
        backgroundImage={'/images/4.jpg'}
      />
      <Grid
        container
        spacing={4}
        paddingTop="50px"
        paddingBottom="50px"
        justifyContent="center"
        sx={{ margin: '0 auto', maxWidth: '1500px' }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          featuredRooms.map(room => (
            <Grid xs={12} sm={6} lg={4} key={room.RoomNumber}>
              {<RoomCard room={room} />}
            </Grid>
          ))
        )}
      </Grid>
    </ThemeProvider>
  );
};

export default RoomsPage;
