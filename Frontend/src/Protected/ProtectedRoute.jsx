// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated, role, userRole }) => {
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && role !== userRole) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
