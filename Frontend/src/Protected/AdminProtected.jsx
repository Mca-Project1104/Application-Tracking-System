import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";

const AdminProtected = () => {
  const admin = localStorage.getItem("admin_token");
  const userRole = localStorage.getItem("userRole");
  const { navigate } = useAppContext();

  console.log(userRole);
  if (userRole !== "admin") {
    navigate("/");
  } else {
    navigate("/admin");
  }

  return admin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminProtected;
