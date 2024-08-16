// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1f2937',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#e6effc',
      paper: '#f0f7ff',
    },
    text: {
      primary: 'hsl(339, 20%, 20%)',
      secondary: 'hsl(210, 22%, 22%)',
    },
    accent: {
      main: 'hsl(211, 86%, 70%)',
      contrastText: 'hsl(210, 22%, 22%)',
    },
    muted: {
      main: 'hsl(210, 100%, 95%)',
      contrastText: 'hsl(210, 22%, 22%)',
    },
    card: {
      main: 'hsl(210, 100%, 97%)',
      contrastText: 'hsl(210, 22%, 22%)',
    },
    chip: {
      positive: '#8DB600',
      negative: '#880808',
      neutral: '#0000FF',
      disabled: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: 'Manrope, Arial, sans-serif',
    h2: {
      fontWeight: 700,
      color: '#1f2937',
    },
    h3: {
      fontWeight: 700,
      color: '#1f2937',
    },
    h4: {
      fontWeight: 700,
      color: '#1f2937',
    },
    body1: {
      color: '#6b7280',
      fontFamily: 'Manrope, Arial, sans-serif',
    },
    body2: {
      color: '#6b7280',
      fontFamily: 'Manrope, Arial, sans-serif',
    },
    h5: {
      color: '#1f2937',
    },
    h6: {
      fontWeight: 600,
      color: '#1f2937',
      fontFamily: 'Manrope, Arial, sans-serif',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f0f7ff',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #e0e7ff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderRadius: '20px',
          color: '#1f2937',
          borderColor: '#1f2937',
          backgroundColor: '#ffffff',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        },
      },
    },
  },
});

export default theme;
