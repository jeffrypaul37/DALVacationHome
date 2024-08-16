import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/system';

const NavLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  marginRight: '20px',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        px: 4,
        bgcolor: '#1f2937',
        color: 'white',
      }}
    >
      <Typography variant="body2" color="inherit">
        &copy; 2024 DAL Vacation Home. All rights reserved.
      </Typography>
      <Box>
        <NavLink href="#" color="inherit">
          Terms of Service
        </NavLink>
        <NavLink href="#" color="inherit">
          Privacy
        </NavLink>
      </Box>
    </Box>
  );
};

export default Footer;
