import makeStyles from '@emotion/styled';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import * as moment from 'moment';
import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from '../../../../axios';
import Loader from '../../../../components/loader/Loader';
import Pagination from '../../../../componentsAdmin/pagination';
import { pagesCount } from '../../../../utils/pagesCount';

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

const typesValue = ['тонкое', 'традиционное'];

const AllProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const DeleteProduct = React.useRef(false);
  const [isProductCreated, setProductCreated] = React.useState(false);
  const [isProductEditted, setProductEditted] = React.useState(false);
  const [sort, setSort] = React.useState('rating');
  const [countProducts, setCountProducts] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 10;

  if (location.pathname !== '/admin/all-products') {
    DeleteProduct.current = true;
  }
  React.useEffect(() => {
    if (location.state === 'Product created!') {
      setProductCreated(true);
    }
    if (location.state === 'Product editted!') {
      setProductEditted(true);
    }
  }, []);

  React.useEffect(() => {
    axios
      .get(`/products/count`)
      .then(({ data }) => {
        setCountProducts(data);
        setPageCount(pagesCount(data, limit));
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении countProducts');
      });
  }, [countProducts]);

  const { id } = useParams();

  const [products, setProducts] = React.useState([]);
  const [isLoader, setLoader] = React.useState(true);
  const [isDeleted, setDelete] = React.useState(false);
  const [isActiveLabel, setActiveLabel] = React.useState('rating');
  // console.log(DeleteUser.current, location.pathname);

  React.useEffect(() => {
    setLoader(true);
    const startProduct = page * limit - limit;
    axios
      .get(`/products/?sort=${sort}&startProduct=${startProduct}&limit=${limit}`)
      .then(({ data }) => {
        setProducts(data);
        setLoader(false);
        DeleteProduct.current = false;
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении products');
      });
  }, [id, sort, page]);

  React.useEffect(() => {
    try {
      if (DeleteProduct.current) {
        if (window.confirm('Are you sure?')) {
          axios.delete(`/products/${id}`).then(() => {
            setDelete(true);
            setCountProducts(countProducts - 1);
            setPage(1);
          });
          navigate('/admin/all-products');
          DeleteProduct.current = false;
        }
        navigate('/admin/all-products');
        return;
      }
    } catch (err) {
      console.warn(err);
      alert('Ошибка при удалении товара');
    }
  }, [DeleteProduct.current]);

  const classes = useStyles();

  const sortHandle = (sort) => {
    setSort(sort);
    setActiveLabel(sort);
  };

  const changePage = (page) => {
    setPage(page);
  };
  // console.log(products);
  return (
    <Grid item xs={12} md={9} sx={{ border: '2px solid teal' }}>
      {isDeleted && (
        <Alert
          onClose={() => {
            setDelete(false);
          }}>
          Product deleted! — close this message!
        </Alert>
      )}
      {isProductCreated && (
        <Alert
          onClose={() => {
            setProductCreated(false);
            navigate('/admin/all-products', { state: '' });
          }}>
          {location.state} — close this message!
        </Alert>
      )}
      {isProductEditted && (
        <Alert
          onClose={() => {
            setProductEditted(false);
            navigate('/admin/all-products', { state: '' });
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
                <TableCell
                  onClick={() => sortHandle('title')}
                  sx={
                    isActiveLabel === 'title'
                      ? { color: '#0ff', cursor: 'Pointer' }
                      : { color: '#fff', cursor: 'Pointer' }
                  }
                  align="left">
                  Title
                </TableCell>
                <TableCell sx={{ color: '#fff' }} align="right">
                  Image
                </TableCell>
                <TableCell sx={{ color: '#fff' }} align="left">
                  Type
                </TableCell>
                <TableCell sx={{ color: '#fff' }} align="right">
                  Size,см
                </TableCell>
                <TableCell
                  onClick={() => sortHandle('price')}
                  sx={
                    isActiveLabel === 'price'
                      ? { color: '#0ff', cursor: 'Pointer' }
                      : { color: '#fff', cursor: 'Pointer' }
                  }
                  align="right">
                  Price,Р
                </TableCell>
                <TableCell
                  onClick={() => sortHandle('rating')}
                  sx={
                    isActiveLabel === 'rating'
                      ? { color: '#0ff', cursor: 'Pointer' }
                      : { color: '#fff', cursor: 'Pointer' }
                  }
                  align="right">
                  Rating
                </TableCell>
                <TableCell sx={{ color: '#fff' }} align="left">
                  Category
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
              {products.map((product, index) => (
                <TableRow
                  key={product._id}
                  sx={!(index % 2) ? { backgroundColor: '#eee' } : { backgroundColor: '#fff' }}>
                  <TableCell component="th" scope="row">
                    {page * limit - limit + index + 1}
                  </TableCell>
                  <TableCell align="left">{product.title}</TableCell>
                  <TableCell align="right">
                    {product.productUrl ? (
                      <img
                        src={process.env.REACT_APP_API_URL + '/uploads/' + product.productUrl}
                        style={{ height: 50 }}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ height: 50 }} />
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {product.types.map((type) => (
                      <span key={type}>{typesValue[type]} </span>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    {product.sizes.map((size) => (
                      <span key={size}>{size} </span>
                    ))}
                  </TableCell>
                  <TableCell align="right">{product.price}</TableCell>
                  <TableCell align="right">{product.rating}</TableCell>
                  <TableCell align="left">{product.categoryId.title}</TableCell>

                  <TableCell align="right">
                    {moment(product.createdAt).format('DD.MM.YYYY')}
                  </TableCell>
                  <TableCell align="right">
                    <Link to={`/admin/all-products/${product._id}`}>{<CancelOutlinedIcon />}</Link>
                    <Link to={`/admin/edit-product/${product._id}`}>{<EditRoundedIcon />}</Link>
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

export default AllProducts;
