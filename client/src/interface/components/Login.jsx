import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div className="d-block">
        <h1 className="text-center">Attendance Management System</h1>
        <h3 className="text-center">Identify YourSelf</h3>
        <div className="d-flex">
          <Link to={"/ownerlogin"} className="mx-auto">
            <button className="btn btn-success btn-lg mx-auto">Owner</button>
          </Link>
          <Link to={"/userlogin"} className="mx-auto">
            <button className="btn btn-success btn-lg mx-auto">User</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
