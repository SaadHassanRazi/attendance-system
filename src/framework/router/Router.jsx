import React, { useState } from "react";
import LoginPage from "../../interface/pages/LoginPage";
import { Route, Routes } from "react-router";
import DashboardPage from "../../interface/pages/DashboardPage";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </>
  );
}

export default Router;
