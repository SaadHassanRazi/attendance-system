import React, { useState } from "react";
import Dashboard from "../components/dashboard/Dashboard";
import Sidebar from "../components/sidebar/Sidebar";
import { ArrowLeft, LayoutSidebar } from "react-bootstrap-icons";
function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggleSidebar} />
      <button className="btn btn-outline-primary" onClick={toggleSidebar}>
        <LayoutSidebar className="h3 m-auto" />
      </button>
      <Dashboard />
    </>
  );
}

export default DashboardPage;
