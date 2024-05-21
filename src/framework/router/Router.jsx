import React from "react";
import { Route, Routes } from "react-router";
import LoginPage from "../../interface/pages/LoginPage";
import DashboardPage from "../../interface/pages/DashboardPage";
import ProtectedRoute from "../protectedRoute/ProtectedRoute";

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute allowedRoles={["admin", "student"]} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
