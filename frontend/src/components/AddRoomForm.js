import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Chip,
  Select,
  OutlinedInput,
  ListItemText,
  Checkbox,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/system';
import theme from '../theme';
import Button from '@mui/material/Button';
import axios from 'axios';

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

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #b0b0b0',
  borderRadius: '10px',
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  height: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const AddRoomForm = ({ handleMenuClick }) => {
  const [roomNumber, setRoomNumber] = useState(0);
  const [maxGuest, setMaxGuest] = useState(0);
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [roomDesc, setRoomDesc] = useState('');
  const [roomImages, setRoomImages] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomPrice, setRoomPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const amenitiesOptions = [
    'King Bed',
    'Queen Bed',
    'Double Bed',
    'Single Bed',
    'Sofa Bed',
    'Free WiFi',
    'Mini Bar',
    'Air Conditioning',
    'Private Balcony',
    'Flat Screen TV',
    'Coffee Maker',
    'Microwave',
    'Jacuzzi',
    'Work Desk',
    'Tea/Coffee Maker',
  ];

  const validate = () => {
    let tempErrors = {};
    tempErrors.roomNumber =
      !roomNumber || isNaN(roomNumber) || roomNumber <= 0
        ? 'Room Number must be a positive number'
        : '';
    tempErrors.roomName = roomName ? '' : 'Room Name is required';
    tempErrors.roomPrice =
      !roomPrice || isNaN(roomPrice) || roomPrice <= 0
        ? 'Room Price must be a positive number'
        : '';
    tempErrors.maxGuest =
      !maxGuest || isNaN(maxGuest) || maxGuest <= 0
        ? 'Max Guest must be a positive number'
        : '';
    tempErrors.roomDesc = roomDesc ? '' : 'Room Description is required';
    setErrors(tempErrors);

    return Object.values(tempErrors).every(x => x === '');
  };

  const handleFileUpload = async event => {
    if (!validate()) {
      return;
    }
    const files = Array.from(event.target.files);
    setLoading(true);

    const uploadPromises = files.map(async file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          const base64data = reader.result.split(',')[1];
          try {
            const response = await axios.post(
              'https://c3041wz9g9.execute-api.us-east-1.amazonaws.com/prod/uploadRoomImage',
              {
                roomNumber: roomNumber,
                fileName: file.name,
                fileContent: base64data,
              }
            );
            const url = JSON.parse(response.data.body).url;
            resolve(url);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
      });
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      console.log(uploadedUrls);
      setRoomImages(prevImages => [...prevImages, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading files: ', error);
    }

    setLoading(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post(
        'https://ndc09m3rmb.execute-api.us-east-1.amazonaws.com/prod/addRoom',
        {
          roomNumber,
          maxGuest,
          roomAmenities,
          roomDesc,
          roomImages,
          roomName,
          roomPrice,
        }
      );
      alert('Room Added Successfully');
      console.log('Room added successfully:', response.data);
      handleMenuClick('ViewRooms');
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Add Room
      </Typography>
      <Box
        sx={{
          mx: 'auto',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: '20px',
          boxShadow: 3,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room Number"
                type="number"
                onChange={e => setRoomNumber(Number(e.target.value))}
                error={!!errors.roomNumber}
                helperText={errors.roomNumber}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room Name"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                error={!!errors.roomName}
                helperText={errors.roomName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room Price"
                type="number"
                onChange={e => setRoomPrice(Number(e.target.value))}
                error={!!errors.roomPrice}
                helperText={errors.roomPrice}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Guest"
                type="number"
                onChange={e => setMaxGuest(Number(e.target.value))}
                error={!!errors.maxGuest}
                helperText={errors.maxGuest}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.roomAmenities}>
                <InputLabel>Room Amenities</InputLabel>
                <Select
                  multiple
                  value={roomAmenities}
                  onChange={e => setRoomAmenities(e.target.value)}
                  input={<OutlinedInput label="Room Amenities" />}
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(value => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {amenitiesOptions.map(amenity => (
                    <MenuItem key={amenity} value={amenity}>
                      <Checkbox checked={roomAmenities.indexOf(amenity) > -1} />
                      <ListItemText primary={amenity} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room Description"
                value={roomDesc}
                onChange={e => setRoomDesc(e.target.value)}
                multiline
                rows={4}
                error={!!errors.roomDesc}
                helperText={errors.roomDesc}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {roomImages.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                  {roomImages.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={image}
                      alt={`Room Image ${index + 1}`}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <label
                  htmlFor="upload-button"
                  onClick={e => {
                    if (roomNumber <= 0 || isNaN(roomNumber)) {
                      e.preventDefault();
                      setErrors(prev => ({
                        ...prev,
                        roomNumber: 'Room Number must be a positive number',
                      }));
                    }
                  }}
                >
                  <UploadBox>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Drag and drop images here, or click to select files
                      </Typography>
                    )}
                  </UploadBox>
                  <input
                    id="upload-button"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </Grid>
            <Grid item xs={12}>
              <CustomButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Add Room
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default AddRoomForm;
