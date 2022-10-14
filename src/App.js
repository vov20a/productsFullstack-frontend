import React from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Categories from './components/Categories';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';
import Register from './pages/Register';
import { fetchAuthMe, setStatus } from './redux/slices/authSlice';

import './scss/app.scss';

function App() {
  //auto login
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchAuthMe()).then(() => dispatch(setStatus('loaded')));
  }, []);

  return (
    <div className="wrapper">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/categories/:title" element={<Home />} /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
