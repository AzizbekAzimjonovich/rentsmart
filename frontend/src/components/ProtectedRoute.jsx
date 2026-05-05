import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

export default function ProtectedRoute({ children }) {
  const { user, token, status } = useSelector((s) => s.auth);
  const location = useLocation();

  if (status === 'loading' && token) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
