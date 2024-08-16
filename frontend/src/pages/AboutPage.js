import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BreadcrumbSection from '../components/BreadcrumbSection';
import theme from '../theme';

const AboutPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BreadcrumbSection
        sectionName="About"
        backgroundImage={'/images/4.jpg'}
      />
    </ThemeProvider>
  );
};

export default AboutPage;
