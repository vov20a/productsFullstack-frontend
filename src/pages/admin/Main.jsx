import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsCount } from '../../redux/slices/productsSlice';
import { fetchOrdersCount } from '../../redux/slices/ordersSlice';
import MainItem from './MainItem';

import { Grid, Skeleton } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { fetchUsersCount } from '../../redux/slices/usersSlice';

const arr = [1, 2, 3];

const Main = () => {
  const dispatch = useDispatch();
  const productsCount = useSelector((state) => state.products.productsCount);
  const ordersCount = useSelector((state) => state.orders.ordersCount);
  const usersCount = useSelector((state) => state.users.usersCount);
  const isLoadingProduct = useSelector((state) => state.products.productsStatus);
  const isLoadingOrder = useSelector((state) => state.orders.ordersStatus);
  const isLoadingUser = useSelector((state) => state.users.usersStatus);
  const loadProduct = isLoadingProduct === 'loading' ? true : false;
  const loadOrder = isLoadingOrder === 'loading' ? true : false;
  const loadUser = isLoadingUser === 'loading' ? true : false;
  // console.log(isLoadingProduct, isLoadingOrder);

  React.useEffect(() => {
    dispatch(fetchProductsCount({ search: '' }));
    dispatch(fetchOrdersCount());
    dispatch(fetchUsersCount());
  }, []);

  const mainInfo = [
    {
      value: ordersCount,
      name: 'Orders count',
      itemIcon: <ShoppingCartIcon style={{ fontSize: 80, display: 'flex', margin: '0 auto' }} />,
    },
    {
      value: productsCount,
      name: 'Products count',
      itemIcon: <CardGiftcardIcon style={{ fontSize: 80, display: 'flex', margin: '0 auto' }} />,
    },
    {
      value: usersCount,
      name: 'Users count',
      itemIcon: <PersonIcon style={{ fontSize: 80, display: 'flex', margin: '0 auto' }} />,
    },
  ];
  return (
    <Grid item xs={12} md={9} sx={{ pl: 2 }}>
      <Grid container sx={{ mt: '0px' }} justifyContent={'space-between'}>
        {loadOrder || loadProduct || loadUser ? (
          <>
            {arr.map((_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                variant="rect"
                sx={{ ml: 3, width: 230, height: 230 }}
              />
            ))}
          </>
        ) : (
          mainInfo.map((item) => <MainItem key={item.name} {...item} />)
        )}
      </Grid>
    </Grid>
  );
};

export default Main;
