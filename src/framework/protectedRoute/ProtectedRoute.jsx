import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../utilities/authContext/AuthProvider";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
