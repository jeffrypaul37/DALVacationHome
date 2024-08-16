import React from 'react';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { styled } from '@mui/system';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const BreadcrumbContainer = styled(Box)(({ backgroundImage }) => ({
  width: '100%',
  height: '350px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  textAlign: 'center',
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
}));

const CustomLink = styled(RouterLink)({
  textDecoration: 'none',
  color: 'inherit',
  fontSize: '15px',
  position: 'relative',
  '&::after': {
    content: "''",
    display: 'block',
    width: '0',
    height: '2px',
    backgroundColor: 'currentColor',
    transition: 'width 0.3s',
    position: 'absolute',
    bottom: '-4px',
    left: '0',
  },
  '&:hover::after': {
    width: '100%',
  },
});

const capitalize = s => {
  if (!s) return s;
  if (s[0] !== s[0].toUpperCase()) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  return s;
};

const BreadcrumbSection = ({ sectionName, backgroundImage }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <BreadcrumbContainer backgroundImage={backgroundImage}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        align="center"
        color={'white'}
      >
        {sectionName}
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ color: '#fff' }}>
        <CustomLink color="inherit" to="/">
          Home
        </CustomLink>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return last ? (
            <Typography color="inherit" key={to}>
              {capitalize(decodeURIComponent(value).replace(/%20/g, ' '))}
            </Typography>
          ) : (
            <CustomLink color="inherit" to={to} key={to}>
              {capitalize(decodeURIComponent(value).replace(/%20/g, ' '))}
            </CustomLink>
          );
        })}
      </Breadcrumbs>
    </BreadcrumbContainer>
  );
};

export default BreadcrumbSection;
