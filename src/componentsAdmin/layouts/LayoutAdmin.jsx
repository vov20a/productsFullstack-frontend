import { Container, Grid } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import SideBar from '../SideBar';

const LayoutAdmin = () => {
  const location = useLocation();

  if (!window.location.pathname.includes(location.pathname)) {
    window.history.pushState(null, null, location.pathname);
  }
  return (
    <div>
      <Header />

      <Container maxWidth="xl" sx={{ mt: '1rem', padding: '0 !important' }}>
        <Grid container sx={{}}>
          <SideBar />
          <Outlet />
        </Grid>
      </Container>
    </div>
  );
};

export default LayoutAdmin;
