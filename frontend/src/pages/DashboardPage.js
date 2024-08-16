import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import { AddHome, LibraryBooks } from '@mui/icons-material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import ProfileUpdateForm from '../components/ProfileUpdateForm';
import AddRoomForm from '../components/AddRoomForm';
import Bookings from '../components/Bookings';
import AdminRoomsPage from './AdminRoomsPage';
import EditRoomDetails from '../components/EditRoomDetails';
import AdminAnalytics from '../components/AdminAnalytics';

const LeftPanel = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '10px',
  color: theme.palette.primary.contrastText,
  height: 'calc(100vh - 20px)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(1),
}));

const RightPanel = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 20px)',
  padding: theme.spacing(2),
  overflowY: 'auto',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const ProfileLinks = styled(List)(({ theme }) => ({
  width: '100%',
}));

const ProfileLink = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#e6effc',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 40,
  height: 40,
}));

const DashboardPage = () => {
  const { userDetails } = useAuth();
  const [selectedPage, setSelectedPage] = useState('Profile');
  const [openRooms, setOpenRooms] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleMenuClick = page => {
    setSelectedPage(page);
  };

  const handleRoomsClick = () => {
    setOpenRooms(!openRooms);
  };

  const renderPageContent = () => {
    switch (selectedPage) {
      case 'Profile':
        return <ProfileUpdateForm />;
      case 'Bookings':
        return <Bookings />;
      case 'Dashboard':
        return <AdminAnalytics />;
      case 'AddRooms':
        return <AddRoomForm handleMenuClick={handleMenuClick} />;
      case 'EditRooms':
        return (
          <EditRoomDetails
            room={selectedRoom}
            handleMenuClick={handleMenuClick}
          />
        );
      case 'ViewRooms':
        return (
          <AdminRoomsPage
            role={userDetails.role}
            setSelectedRoom={setSelectedRoom}
            handleMenuClick={handleMenuClick}
          />
        );
      default:
        return <Typography variant="h4">Page Not Found</Typography>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item xs={2}>
          <Box>
            <LeftPanel>
              <ProfileLinks>
                <ProfileLink button onClick={() => handleMenuClick('Profile')}>
                  <ListItemIcon>
                    <IconBox>
                      <AccountCircleIcon
                        style={{ color: theme.palette.primary.main }}
                      />
                    </IconBox>
                  </ListItemIcon>
                  <ListItemText
                    primary="My Profile"
                    secondary="Account Details"
                    primaryTypographyProps={{
                      variant: 'body1',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                    secondaryTypographyProps={{
                      variant: 'body1',
                      color: 'wheat',
                    }}
                  />
                </ProfileLink>
                {userDetails.role === 'Property Agent' ? (
                  <ProfileLink
                    button
                    onClick={() => handleMenuClick('Dashboard')}
                  >
                    <ListItemIcon>
                      <IconBox>
                        <DashboardIcon
                          style={{ color: theme.palette.primary.main }}
                        />
                      </IconBox>
                    </ListItemIcon>
                    <ListItemText
                      primary="Dashboard"
                      secondary="Room Analytics"
                      primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                      secondaryTypographyProps={{
                        variant: 'body1',
                        color: 'wheat',
                      }}
                    />
                  </ProfileLink>
                ) : null}
                {userDetails.role === 'Customer' ? (
                  <ProfileLink
                    button
                    onClick={() => handleMenuClick('Bookings')}
                  >
                    <ListItemIcon>
                      <IconBox>
                        <LibraryBooks
                          style={{ color: theme.palette.primary.main }}
                        />
                      </IconBox>
                    </ListItemIcon>
                    <ListItemText
                      primary="My Bookings"
                      secondary="Booking Details"
                      primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                      secondaryTypographyProps={{
                        variant: 'body1',
                        color: 'wheat',
                      }}
                    />
                  </ProfileLink>
                ) : null}
                {userDetails.role === 'Property Agent' ? (
                  <Box>
                    <ProfileLink button onClick={handleRoomsClick}>
                      <ListItemIcon>
                        <IconBox>
                          <HomeIcon
                            style={{ color: theme.palette.primary.main }}
                          />
                        </IconBox>
                      </ListItemIcon>
                      <ListItemText
                        primary="Rooms"
                        primaryTypographyProps={{
                          variant: 'body1',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                      />
                      {openRooms ? <ExpandLess /> : <ExpandMore />}
                    </ProfileLink>
                    <Collapse in={openRooms} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ProfileLink
                          button
                          sx={{ pl: 4 }}
                          onClick={() => handleMenuClick('ViewRooms')}
                        >
                          <ListItemIcon>
                            <IconBox>
                              <AddHome
                                style={{ color: theme.palette.primary.main }}
                              />
                            </IconBox>
                          </ListItemIcon>
                          <ListItemText
                            primary="View Rooms"
                            primaryTypographyProps={{
                              variant: 'body1',
                              fontWeight: 'bold',
                              color: 'white',
                            }}
                          />
                        </ProfileLink>
                        <ProfileLink
                          button
                          sx={{ pl: 4 }}
                          onClick={() => handleMenuClick('AddRooms')}
                        >
                          <ListItemIcon>
                            <IconBox>
                              <AddHome
                                style={{ color: theme.palette.primary.main }}
                              />
                            </IconBox>
                          </ListItemIcon>
                          <ListItemText
                            primary="Add Rooms"
                            primaryTypographyProps={{
                              variant: 'body1',
                              fontWeight: 'bold',
                              color: 'white',
                            }}
                          />
                        </ProfileLink>
                      </List>
                    </Collapse>
                  </Box>
                ) : null}
              </ProfileLinks>
            </LeftPanel>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <RightPanel>{renderPageContent()}</RightPanel>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default DashboardPage;
