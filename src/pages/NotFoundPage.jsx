import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>NotFoundPage 404</h1>
      <button
        onClick={() => {
          navigate('/');
        }}>
        Go Back
      </button>
    </div>
  );
};

export default NotFoundPage;
