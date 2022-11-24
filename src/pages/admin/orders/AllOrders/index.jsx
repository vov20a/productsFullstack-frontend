import React from 'react';
import * as moment from 'moment';
import Loader from '../../../../components/loader/Loader';
import axios from '../../../../axios';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../../../componentsAdmin/pagination';
import { pagesCount } from '../../../../utils/pagesCount';
import {
  Alert,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import makeStyles from '@emotion/styled';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DoneIcon from '@mui/icons-material/Done';

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

const AllOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const DeleteOrder = React.useRef(false);
  const [isOrderCreated, setOrderCreated] = React.useState(false);
  const [isOrderEditted, setOrderEditted] = React.useState(false);
  const [countOrders, setCountOrders] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 3;

  const { id } = useParams();
  if (location.pathname !== '/admin/all-orders') {
    DeleteOrder.current = true;
  }

  React.useEffect(() => {
    if (location.state === 'Order created!') {
      setOrderCreated(true);
    }
  }, []);

  React.useEffect(() => {
    axios
      .get(`/orders/count`)
      .then(({ data }) => {
        setCountOrders(data);
        setPageCount(pagesCount(data, limit));
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении countOrders');
      });
  }, [countOrders]);

  const [orders, setOrders] = React.useState([]);
  const [isLoader, setLoader] = React.useState(true);
  const [isDeleted, setDelete] = React.useState(false);
  // console.log(DeleteUser.current, location.pathname);

  React.useEffect(() => {
    const startOrder = page * limit - limit;
    axios
      .get(`/orders/?startOrder=${startOrder}&limit=${limit}`)
      .then(({ data }) => {
        setOrders(data);
        setLoader(false);
        DeleteOrder.current = false;
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении Orders');
      });
  }, [id, page]);

  React.useEffect(() => {
    try {
      if (DeleteOrder.current) {
        if (window.confirm('Are you sure?')) {
          axios.delete(`/orders/${id}`).then(() => {
            setDelete(true);
            setCountOrders(countOrders - 1);
            setPage(1);
          });
          navigate('/admin/all-orders');
          DeleteOrder.current = false;
        }
        navigate('/admin/all-orders');
        return;
      }
    } catch (err) {
      console.warn(err);
      alert('Ошибка при удалении пользователя');
    }
  }, [DeleteOrder.current]);

  const classes = useStyles();

  const changePage = (page) => {
    setPage(page);
  };
  //   console.log(orders);
  return (
    <Grid item xs={12} md={9} sx={{ border: '2px solid teal' }}>
      {isDeleted && (
        <Alert
          onClose={() => {
            setDelete(false);
          }}>
          User deleted! — close this message!
        </Alert>
      )}
      {isOrderCreated && (
        <Alert
          onClose={() => {
            setOrderCreated(false);
            navigate('/admin/all-orders', { state: '' });
          }}>
          {location.state} — close this message!
        </Alert>
      )}
      {isLoader ? (
        <Loader />
      ) : (
        <TableContainer>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', marginTop: 5 }}>
                <TableCell sx={{ color: '#fff' }}>№</TableCell>
                <TableCell sx={{ color: '#fff' }} align="right">
                  FullName
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
                  Products
                </TableCell>
                <TableCell sx={{ color: '#fff' }} align="right">
                  Created At
                </TableCell>
                <TableCell sx={{ color: '#fff' }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow
                  key={order._id}
                  sx={!(index % 2) ? { backgroundColor: '#eee' } : { backgroundColor: '#fff' }}>
                  <TableCell component="th" scope="row">
                    {page * limit - limit + index + 1}
                  </TableCell>
                  <TableCell align="right">{order.fullName}</TableCell>
                  <TableCell align="right">{order.email}</TableCell>
                  <TableCell align="right">{order.phone}</TableCell>
                  <TableCell align="right"> {order.totalPrice}</TableCell>
                  <TableCell align="right">
                    {order.products.map((product, index) => (
                      <span key={index}>{product.title} </span>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    {moment(order.createdAt).format('DD.MM.YYYY')}
                  </TableCell>
                  <TableCell align="right">
                    <Link to={`/admin/all-orders/${order._id}`}>{<CancelOutlinedIcon />}</Link>
                    <Link to={`/admin/one-order/${order._id}`}>{<DoneIcon />}</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Pagination pageCount={pageCount} page={page} changePage={changePage} />
    </Grid>
  );
};

export default AllOrders;
