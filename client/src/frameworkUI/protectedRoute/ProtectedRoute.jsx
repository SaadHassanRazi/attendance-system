import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../useCases/context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { role } = useAuth(); // Get the role from AuthContext

  // Check if the user's role is allowed to access this route
  if (allowedRoles.includes(role)) {
    return <Outlet />;
  } else {
    // If not allowed, navigate to a login page or home
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
