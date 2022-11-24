import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedAuthRoute = ({ isAuth, redirectPath = '/', children }) => {
  // console.log('user:', isAuth);
  if (isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
