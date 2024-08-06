import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, roleRequired, ...rest }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in
  const userRole = localStorage.getItem('role'); // Get the user role

  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (roleRequired && userRole !== roleRequired) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
