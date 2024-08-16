import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import Grid from '@mui/material/Unstable_Grid2';
import RoomCard from '../components/RoomCard';
import { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

const AdminRoomsPage = ({ role, setSelectedRoom, handleMenuClick }) => {
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

  const hideScrollbarStyle = {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Rooms
      </Typography>
      <Box sx={{ overflow: 'auto', ...hideScrollbarStyle, maxHeight: '80vh' }}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ margin: '0 auto', maxWidth: '1800px', overflow: 'hidden' }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            featuredRooms.map(room => (
              <Grid xs={12} sm={6} lg={4} key={room.RoomNumber}>
                {
                  <RoomCard
                    room={room}
                    role={role}
                    setSelectedRoom={setSelectedRoom}
                    handleMenuClick={handleMenuClick}
                  />
                }
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default AdminRoomsPage;
