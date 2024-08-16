import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/system';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import theme from '../theme';
import BreadcrumbSection from '../components/BreadcrumbSection';

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

const ContactPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BreadcrumbSection
        sectionName="Contact Us"
        backgroundImage={'/images/4.jpg'}
      />
      <Box width="100%" py={6} px={4}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                borderRadius: '20px',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PhoneIcon fontSize="large" color="primary" />
                <Typography variant="h6" gutterBottom>
                  Make A Call
                </Typography>
                <Typography variant="body1">
                  This is the dolor sit amet consectetur adipisicing elit. In,
                  quis!
                </Typography>
                <Typography variant="h6" color="primary" mt={2}>
                  +91 (123) 4560 789
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                borderRadius: '20px',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <EmailIcon fontSize="large" color="primary" />
                <Typography variant="h6" gutterBottom>
                  Send An Email
                </Typography>
                <Typography variant="body1">
                  This is the dolor sit amet consectetur adipisicing elit. In,
                  quis!
                </Typography>
                <Typography variant="h6" color="primary" mt={2}>
                  example@gmail.com
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                borderRadius: '20px',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <LocationOnIcon fontSize="large" color="primary" />
                <Typography variant="h6" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body1">
                  125, This is the, dolor sit amet, consectetur, quister 253
                  254!
                </Typography>
                <Typography variant="h6" color="primary" mt={2}>
                  United States Of America
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box mt={6}>
          <Card sx={{ borderRadius: '20px' }}>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" gutterBottom>
                    Get In Touch With Us
                  </Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    This is the dolor consectetur adipisicing elit. Deleniti
                    quam exercitationem a expedita natus quisquam. Deleniti
                    Facere exercitationem ratione nihil Deleniti delectus
                    possimus!
                  </Typography>
                  <form noValidate autoComplete="off">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Your Name*"
                          variant="outlined"
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Your Email*"
                          variant="outlined"
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label="Your Subject*"
                      variant="outlined"
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Message*"
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                    />
                    <Box mt={2}>
                      <CustomButton variant="contained" color="primary">
                        Send Message
                      </CustomButton>
                    </Box>
                  </form>
                </Grid>
                <Grid item xs={12} md={6}>
                  <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.8777354868343!2d72.83106681490273!3d21.208246685906447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be051c4c9d438b3%3A0x9b1b9eb22f7e5a91!2sMota%20Varachha%2C%20Surat%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sus!4v1618303180146!5m2!1sen!2sus"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ContactPage;
