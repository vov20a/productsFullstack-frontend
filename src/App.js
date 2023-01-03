import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/layouts/Layout';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import FullPizza from './pages/FullPizza';
import CreateOrder from './pages/CreateOrder';
import NotFoundPage from './pages/NotFoundPage';
import Register from './pages/Register';
import {
  dataUser,
  dataStatus,
  fetchAuthMe,
  selectIsAuth,
  setStatus,
} from './redux/slices/authSlice';
import Remember from './pages/Remember';
import CreatePassword from './pages/CreatePassword';
import { ProtectedAuthRoute } from './hoc/ProtectedAuthRoute';
import { ProtectedCreatePassword } from './hoc/ProtectedCreatePassword';
import { ProtectedAdminRoute } from './hoc/ProtectedAdminRoute';
import LayoutAdmin from './componentsAdmin/layouts/LayoutAdmin';
import Main from './pages/admin/Main';
import AllUsers from './pages/admin/users/AllUsers';
import AddUser from './pages/admin/users/AddUser';
import AllProducts from './pages/admin/products/AllProducts';
import AddProduct from './pages/admin/products/AddProduct';
import AllOrders from './pages/admin/orders/AllOrders';
import AddOrder from './pages/admin/orders/AddOrder';
import OneOrder from './pages/admin/orders/OneOrder';
import Loader from './components/loader/Loader';

import './scss/app.scss';

function App() {
  //auto login
  const dispatch = useDispatch();
  const location = useLocation();

  React.useEffect(() => {
    dispatch(fetchAuthMe()).then(() => dispatch(setStatus('loaded')));
  }, []);

  const isAuth = useSelector(selectIsAuth);
  const user = useSelector(dataUser);

  const isAdmin = React.useMemo(() => {
    // if (window.localStorage.getItem('adminPath')) {
    //   location.pathname = window.localStorage.getItem('adminPath');
    // }
    return user?.role === 'admin';
  }, [user]);

  const email = window.localStorage.getItem('restoreEmail');
  const isEmail = email ? true : false;

  if (useSelector(dataStatus) === 'loading') {
    return <Loader />;
  }
  // console.log('render');
  return (
    <div className="wrapper">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          {/* <Route
            path="remember"
            element={
              <ProtectedAuthRoute isAuth={isAuth}>
                <Remember />
              </ProtectedAuthRoute>
            }
          /> */}
          {!isAuth ? (
            <Route path="remember" element={<Remember />} />
          ) : (
            <Route path="remember" element={<NotFoundPage />} />
          )}
          {/* <Route
            path="password"
            element={
              <ProtectedCreatePassword isEmail={isEmail}>
                <CreatePassword />
              </ProtectedCreatePassword>
            }
          /> */}
          {/* {isEmail ? ( */}
          <Route path="password" element={<CreatePassword />} />
          // ) : ( // <Route path="password" element={<NotFoundPage />} />
          // )}
          <Route path="cart" element={<Cart />} />
          <Route path="single/:id" element={<FullPizza />} />
          <Route path="add-order" element={<CreateOrder />} />
          {/* <Route
            path="admin"
            element={
              <ProtectedAdminRoute isAdmin={isAdmin} adminPath={location.pathname}>
                <LayoutAdmin />
              </ProtectedAdminRoute>
            }>
            <Route index element={<Main />} />
            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-users/:id" element={<AllUsers />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="edit-user/:id" element={<AddUser />} />
            <Route path="all-products" element={<AllProducts />} />
            <Route path="all-products/:id" element={<AllProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="edit-product/:id" element={<AddProduct />} />
            <Route path="all-orders" element={<AllOrders />} />
            <Route path="all-orders/:id" element={<AllOrders />} />
            <Route path="add-order" element={<AddOrder />} />
            <Route path="one-order/:id" element={<OneOrder />} />
          </Route> */}
          {isAdmin ? (
            <Route path="/admin" element={<LayoutAdmin />}>
              <Route index element={<Main />} />
              <Route path="all-users" element={<AllUsers />} />
              <Route path="all-users/:id" element={<AllUsers />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="edit-user/:id" element={<AddUser />} />
              <Route path="all-products" element={<AllProducts />} />
              <Route path="all-products/:id" element={<AllProducts />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="edit-product/:id" element={<AddProduct />} />
              <Route path="all-orders" element={<AllOrders />} />
              <Route path="all-orders/:id" element={<AllOrders />} />
              <Route path="add-order" element={<AddOrder />} />
              <Route path="one-order/:id" element={<OneOrder />} />
            </Route>
          ) : (
            <Route path="/admin" element={<NotFoundPage />} />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
