import React from "react";
import "./Sidebar.css";
import { X } from "react-bootstrap-icons";

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""} rounded`}>
      <button className="sidebar-toggle" onClick={toggle}>
        <X className="h2 m-auto rounded bg-danger" />
      </button>
      <ul>
        <li>Link 1</li>
        <li>Link 2</li>
        <li>Link 3</li>
      </ul>
    </div>
  );
};

export default Sidebar;
