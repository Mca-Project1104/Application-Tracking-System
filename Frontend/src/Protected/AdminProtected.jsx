import { Navigate, Outlet } from "react-router-dom";

const AdminProtected = ({ userRole }) => {
  const adminToken = localStorage.getItem("admin_token");

  if (!adminToken || userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtected;
