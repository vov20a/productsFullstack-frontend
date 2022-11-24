import React from 'react';
import * as moment from 'moment';
import Loader from '../../../../components/loader/Loader';
import axios from '../../../../axios';
import { useParams } from 'react-router-dom';

import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';

import makeStyles from '@emotion/styled';

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
  tr: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#eee',
    },
  },
});

const OneOrder = () => {
  const { id } = useParams();

  const [order, setOrder] = React.useState([]);
  const [isLoader, setLoader] = React.useState(true);

  React.useEffect(() => {
    axios
      .get(`/orders/${id}`)
      .then(({ data }) => {
        setOrder(data);
        setLoader(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении Order');
      });
  }, [id]);

  const classes = useStyles();

  console.log(order);
  return (
    <Grid item xs={12} md={9} sx={{ border: '2px solid teal' }}>
      {isLoader ? (
        <Loader />
      ) : (
        <>
          <Typography sx={{ color: 'teal', fontSize: 24, textAlign: 'center' }}>
            Общие данные
          </Typography>
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', marginTop: 5 }}>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    OrderId
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Заказчик
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Email
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Phone
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    TotalPrice
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Created At
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ backgroundColor: '#fff' }}>
                  <TableCell align="right">{order._id}</TableCell>
                  <TableCell align="right">{order.fullName}</TableCell>
                  <TableCell align="right">{order.email}</TableCell>
                  <TableCell align="right">{order.phone}</TableCell>
                  <TableCell align="right"> {order.totalPrice}</TableCell>
                  <TableCell align="right">
                    {moment(order.createdAt).format('DD.MM.YYYY')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography sx={{ color: 'teal', fontSize: 24, textAlign: 'center' }}>
            Данные Заказчика
          </Typography>
          <TableContainer sx={{ mt: 1 }}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', marginTop: 5 }}>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    FullName
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Email
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Avatar
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ backgroundColor: '#fff' }}>
                  <TableCell align="right">{order.userId.fullName}</TableCell>
                  <TableCell align="right">{order.userId.email}</TableCell>
                  <TableCell align="right">
                    <img
                      width="50"
                      height={'50'}
                      src={order.userId.avatarUrl}
                      alt={order.userId.avatarUrl}
                    />{' '}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography sx={{ color: 'teal', fontSize: 24, textAlign: 'center' }}>
            Данные заказа
          </Typography>
          <TableContainer sx={{ mt: 1 }}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', marginTop: 5 }}>
                  <TableCell sx={{ color: '#fff' }} align="left">
                    №
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="left">
                    Title
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Price
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="left">
                    Type
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Size
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Count
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }} align="right">
                    Image
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.products.map((product, index) => (
                  <TableRow
                    key={index}
                    sx={!(index % 2) ? { backgroundColor: '#eee' } : { backgroundColor: '#fff' }}>
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">{product.title}</TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                    <TableCell align="left">{product.type}</TableCell>
                    <TableCell align="right">{product.size}</TableCell>
                    <TableCell align="right">{product.count}</TableCell>
                    <TableCell align="right">
                      <img
                        width="50"
                        height={'50'}
                        src={product.productUrl}
                        alt={product.productUrl}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Grid>
  );
};

export default OneOrder;
