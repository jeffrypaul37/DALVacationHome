import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Typography,
  Button,
  Avatar,
  Box,
  Grid,
  TextField,
  Divider,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { getCurrentUser } from '../utils/getCurrentUser';
import axios from 'axios';
import theme from '../theme';

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '1rem',
  padding: '12px 24px',
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
}));

const CameraIconButton = styled(IconButton)({
  position: 'absolute',
  bottom: 150,
  right: 150,
  backgroundColor: 'white',
  borderRadius: '50%',
  padding: '5px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const fetchUserDetails = async userId => {
  try {
    const response = await axios.get(
      `https://5bgt4gkzk8.execute-api.us-east-1.amazonaws.com/prod/users/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user details: ', error);
    throw error;
  }
};

const ProfileUpdateForm = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const getUserDetails = async () => {
      const attributes = await getCurrentUser();
      const userId = attributes.sub;
      setUserId(userId); // Example userId; replace with dynamic value as needed
      try {
        const user = await fetchUserDetails(userId);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setPhone(user.phone || '');
        setAddress(user.address || '');
        setAvatar(user.avatarUrl || '');
      } catch (error) {
        console.error('Error fetching user details: ', error);
      }
    };

    getUserDetails();
  }, []);

  const handleAvatarChange = async e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async event => {
        const base64data = event.target.result.split(',')[1];

        try {
          const response = await axios.post(
            'https://gl92e5468a.execute-api.us-east-1.amazonaws.com/prod/updateUserPhoto',
            {
              userId: userId,
              fileName: file.name,
              fileContent: base64data,
            }
          );
          const data = JSON.parse(response.data.body);
          setAvatar(data.imageUrl);
        } catch (error) {
          console.error('Error uploading avatar: ', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      userId,
      phone,
      address,
    };

    try {
      const response = await axios.post(
        'https://ocr0x3pt96.execute-api.us-east-1.amazonaws.com/prod/updateUserProfile',
        payload
      );
      const message = JSON.parse(response.data.body).message;
      alert(message);
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h4">My Profile</Typography>
      <Box width="100%" mt={2}>
        <Box
          sx={{
            mx: 'auto',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: '20px',
            boxShadow: 3,
          }}
        >
          <Grid container spacing={4}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <Box
                textAlign="center"
                mb={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Avatar
                  src={avatar}
                  sx={{
                    width: 250,
                    height: 250,
                    mb: 2,
                  }}
                />
                <CameraIconButton component="label">
                  <CameraAltIcon />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />
                </CameraIconButton>
                <Typography variant="h3" fontWeight="bold" mt={2}>
                  {name}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {email}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {role}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box mt={4}>
                <Typography variant="h4" fontWeight={600} gutterBottom mt={1}>
                  Personal Information
                </Typography>
                <Divider />
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled
                      label="Name"
                      name="name"
                      value={name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled
                      label="Email"
                      name="email"
                      value={email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      type="number"
                      name="phone"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSubmit}
                    >
                      Update Profile
                    </CustomButton>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box width="100%">
        <Box
          sx={{
            mx: 'auto',
            mt: 3,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: '20px',
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Change Password
          </Typography>
          <Divider />
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="New Password" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Confirm New Password" />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomButton variant="contained" color="primary" fullWidth>
                Update Password
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ProfileUpdateForm;
