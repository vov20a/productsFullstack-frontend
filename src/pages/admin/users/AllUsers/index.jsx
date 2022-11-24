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

const AllUsers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const DeleteUser = React.useRef(false);
  const [isUserCreated, setUserCreated] = React.useState(false);
  const [isUserEditted, setUserEditted] = React.useState(false);
  const [countUsers, setCountUsers] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 3;
  if (location.pathname !== '/admin/all-users') {
    DeleteUser.current = true;
  }
  React.useEffect(() => {
    if (location.state === 'User created!') {
      setUserCreated(true);
    }
    if (location.state === 'User editted!') {
      setUserEditted(true);
    }
  }, []);

  React.useEffect(() => {
    axios
      .get(`/auth/count`)
      .then(({ data }) => {
        setCountUsers(data);
        setPageCount(pagesCount(data, limit));
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении countUsers');
      });
  }, [countUsers]);

  const { id } = useParams();

  const [users, setUsers] = React.useState([]);
  const [isLoader, setLoader] = React.useState(true);
  const [isDeleted, setDelete] = React.useState(false);
  // console.log(DeleteUser.current, location.pathname);

  React.useEffect(() => {
    const startUser = page * limit - limit;
    axios
      .get(`/auth/users/?startUser=${startUser}&limit=${limit}`)
      .then(({ data }) => {
        setUsers(data);
        setLoader(false);
        DeleteUser.current = false;
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении users');
      });
  }, [id, page]);

  React.useEffect(() => {
    try {
      if (DeleteUser.current) {
        if (window.confirm('Are you sure?')) {
          axios.delete(`/auth/${id}`).then(() => {
            setDelete(true);
            setCountUsers(countUsers - 1);
            setPage(1);
          });
          navigate('/admin/all-users');
          DeleteUser.current = false;
        }
        navigate('/admin/all-users');
        return;
      }
    } catch (err) {
      console.warn(err);
      alert('Ошибка при удалении пользователя');
    }
  }, [DeleteUser.current]);

  const classes = useStyles();

  const changePage = (page) => {
    setPage(page);
  };

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
      {isUserCreated && (
        <Alert
          onClose={() => {
            setUserCreated(false);
            navigate('/admin/all-users', { state: '' });
          }}>
          {location.state} — close this message!
        </Alert>
      )}
      {isUserEditted && (
        <Alert
          onClose={() => {
            setUserEditted(false);
            navigate('/admin/all-users', { state: '' });
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
                  Name
                </TableCell>
                <TableCell sx={{ color: '#fff' }} align="right">
                  Email
                </TableCell>
                <TableCell sx={{ color: '#fff' }} align="right">
                  Role
                </TableCell>
                <TableCell sx={{ color: '#fff' }} align="right">
                  Avatar
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
              {users.map((user, index) => (
                <TableRow
                  key={user._id}
                  sx={!(index % 2) ? { backgroundColor: '#eee' } : { backgroundColor: '#fff' }}>
                  <TableCell component="th" scope="row">
                    {page * limit - limit + index + 1}
                  </TableCell>
                  <TableCell align="right">{user.fullName}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.role}</TableCell>
                  <TableCell align="right">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} style={{ height: 50 }} />
                    ) : (
                      <AccountCircleIcon sx={{ height: 50 }} />
                    )}
                  </TableCell>
                  <TableCell align="right">{moment(user.createdAt).format('DD.MM.YYYY')}</TableCell>
                  <TableCell align="right">
                    <Link to={`/admin/all-users/${user._id}`}>{<CancelOutlinedIcon />}</Link>
                    <Link to={`/admin/edit-user/${user._id}`}>{<EditRoundedIcon />}</Link>
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

export default AllUsers;
