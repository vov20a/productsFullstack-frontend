import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedAdminRoute = ({ isAdmin, redirectPath = '/', adminPath, children }) => {
  if (!isAdmin) {
    window.localStorage.setItem('adminPath', adminPath);

    return <Navigate to={redirectPath} replace />;
  }

  window.localStorage.removeItem('adminPath');
  return children ? children : <Outlet />;
};
