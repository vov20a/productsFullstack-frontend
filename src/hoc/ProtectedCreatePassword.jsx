import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedCreatePassword = ({ isEmail, redirectPath = '/login', children }) => {
  //   console.log('user:', isAuth);
  if (!isEmail) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};
