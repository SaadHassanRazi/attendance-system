import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../../interface/pages/home/Home";
import OwnerLogin from "../../interface/components/ownerLogin/OwnerLogin";
import UserLogin from "../../interface/components/userLogin/UserLogin";
import DashboardPage from "../../interface/pages/dashboardPage/DashboardPage";
// Import OwnerDashboard
import ProtectedRoute from "../protectedRoute/ProtectedRoute";
import OwnerDashboard from "../../interface/components/ownerDashboard/OwnerDashboard";
import CreateDepartment from "../../interface/components/createDepartment/CreateDepartment";
import CreateStudent from "../../interface/components/createStudent/CreateStudent";

const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ownerlogin" element={<OwnerLogin />} />
        <Route path="/userlogin" element={<UserLogin />} />

        {/* Protect admin and student dashboard */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin", "student", "owner"]} />
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
          <Route path="/create-department" element={<CreateDepartment />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/create-student" element={<CreateStudent />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Router;
