import React from "react";
import "./Sidebar.css";
import { X } from "react-bootstrap-icons";
import { useAuth } from "../../../utilities/authContext/AuthProvider";

const Sidebar = ({ isOpen, toggle }) => {
  const { logOut } = useAuth();

  return (
    <div className={`sidebar ${isOpen ? "open" : ""} rounded` } style={{zIndex:'999'}}>
      <button className="sidebar-toggle" onClick={toggle}>
        <X className="h2 m-auto rounded bg-danger" />
      </button>
      <ul>
        <li>Link 1</li>
        <li>Link 2</li>
        <li>Link 3</li>
        <button onClick={logOut} className="btn btn-danger">LogOut</button>
      </ul>
    </div>
  );
};

export default Sidebar;
