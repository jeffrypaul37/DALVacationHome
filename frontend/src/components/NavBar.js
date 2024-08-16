import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';
import logo from '../assets/logo_full.svg';
import { useAuth } from '../context/AuthContext';

const NavLink = styled('a')({
  textDecoration: 'none',
  color: 'inherit',
  marginRight: '20px',
  fontSize: '18px',
  position: 'relative',
  '&::after': {
    content: "''",
    display: 'block',
    width: '0',
    height: '2px',
    backgroundColor: '#a1b3cc',
    transition: 'width 0.3s',
    position: 'absolute',
    bottom: '-4px',
    left: '0',
  },
  '&:hover::after': {
    width: '100%',
  },
});

const LoginButton = styled(Button)({
  borderRadius: '45px',
  color: '#1f2937',
  borderColor: '#1f2937',
  backgroundColor: '#fff',
  padding: '5px 20px',
  fontSize: '16px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const UserButton = styled(Button)({
  color: 'inherit',
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '45px', // Rounded corners
  padding: '5px 5px',
  paddingInlineStart: '15px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const NavBar = () => {
  const { isLoggedIn, logout, userDetails } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const userButtonRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(null);

  useEffect(() => {
    if (userButtonRef.current) {
      setMenuWidth(userButtonRef.current.offsetWidth);
    }
  }, [userButtonRef.current]);

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="home">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '200px',
              height: 'auto',
              filter: 'invert(1)',
            }}
          />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/rooms">Rooms</NavLink>
        </Box>
        {isLoggedIn ? (
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <UserButton onClick={handleMenuOpen} ref={userButtonRef}>
              <Typography
                color="inherit"
                variant="h6"
                component="span"
                sx={{ mr: 1 }}
              >
                {userDetails.name}
              </Typography>
              <Avatar alt="User Avatar" />
            </UserButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  width: menuWidth,
                },
              }}
            >
              <MenuItem component={RouterLink} to="/dashboard">
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <LoginButton variant="outlined" component={RouterLink} to="/login">
            Login
          </LoginButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
