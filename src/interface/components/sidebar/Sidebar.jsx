import React from "react";
import "./Sidebar.css";
import { X } from "react-bootstrap-icons";
import { useAuth } from "../../../utilities/authContext/AuthProvider";
import { Link } from "react-router-dom";

const Sidebar = ({
  isOpen,
  toggle,
  link1,
  link2,
  link3,
  path1,
  path2,
  path3,
}) => {
  const { logOut } = useAuth();

  return (
    <div
      className={`sidebar ${isOpen ? "open" : ""} rounded`}
      style={{ zIndex: "999" }}
    >
      <button className="sidebar-toggle" onClick={toggle}>
        <X className="h2 m-auto rounded bg-danger" />
      </button>
      <ul>
        <Link to={path1}>{link1}</Link>
        <Link to={path2}>{link2}</Link>
        <Link to={path3}>{link3}</Link>

        <button onClick={logOut} className="btn btn-danger">
          LogOut
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;
