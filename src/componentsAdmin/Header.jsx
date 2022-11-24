import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Avatar, Badge, IconButton, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { dataUser } from '../redux/slices/authSlice';

const Header = () => {
  const admin = useSelector(dataUser);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography color="inherit" variant="h6" component="span" sx={{ flexGrow: 1 }}>
          Admin
        </Typography>
        <Link to="/">
          <Typography color="#fff" variant="h6" component="span" sx={{ pl: 2, pr: 2 }}>
            SITE
          </Typography>
        </Link>
        <Typography color="#fff" variant="h6" component="span">
          {admin.email}
        </Typography>
        {/* <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"> */}
        {/* <AccountCircle /> */}
        <Avatar alt="Remy Sharp" src={admin.avatarUrl} />
        {/* </IconButton> */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
