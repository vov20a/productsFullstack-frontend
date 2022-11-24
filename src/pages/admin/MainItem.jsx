import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider, Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const MainItem = ({ value, name, itemIcon }) => {
  const navigate = useNavigate();
  const partPath = name.includes('Orders')
    ? 'orders'
    : name.includes('Products')
    ? 'products'
    : name.includes('Users')
    ? 'users'
    : '';
  const handleClickButton = () => {
    navigate(`/admin/all-${partPath}`);
  };
  return (
    <Grid item xs={12} md={3} sx={{ ml: 3, border: '1px solid black' }}>
      <Card sx={{ minWidth: 180, bgcolor: '#eee' }}>
        {itemIcon}
        <Divider />
        <CardContent>
          <Typography variant="h6" component="h3">
            Information
          </Typography>
          <Typography variant="body1">
            {name}: {value}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" size="small" onClick={handleClickButton}>
            Open
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default MainItem;
