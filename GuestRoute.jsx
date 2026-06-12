import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from './LoadingSpinner.jsx';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage message="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
