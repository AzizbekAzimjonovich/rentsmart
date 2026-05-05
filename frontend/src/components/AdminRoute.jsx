import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

export default function AdminRoute({ children }) {
  const user = useSelector((s) => s.auth.user);

  return (
    <ProtectedRoute>
      {user?.role === 'admin' ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  );
}
