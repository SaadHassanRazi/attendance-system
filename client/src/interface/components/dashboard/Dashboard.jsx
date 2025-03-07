import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useAuth } from "../../../useCases/context/AuthContext";
import AdminDashboard from "../adminDashboard/AdminDashboard";
import StudentDashboard from "../studentDashboard/StudentDashboard";
import OwnerDashboard from "../ownerDashboard/OwnerDashboard";

const Dashboard = () => {
  const { user, role, logOut, departName,userName } = useAuth();

  return (
    <div>
      <div>
        <div className=" shadow shadow-lg py-2 w-75 mx-auto bg-white rounded">
          <Row className=" mx-auto ">
            <Col className="text-center mx-auto  " md>
              <h3 className="text-dark">Dashboard</h3>
              <h5 className={role === "owner" ? "d-hidden" : "text-dark"}>
                Welcome To {departName} Department {userName}
              </h5>
              <button onClick={logOut} className="btn btn-danger">
                Logout
              </button>
            </Col>
            <Col className="" md>
              <div className="d-flex text-dark my-auto float-md-end">
                <PersonCircle className="h2  m-auto" />
                <h4 className="m-auto">{user}</h4>
              </div>
            </Col>
          </Row>
        </div>
        <div className="text-center display-4 text-white">
          Attendance System
        </div>
        <div>
          {role === "owner" ? (
            <OwnerDashboard />
          ) : role === "admin" ? (
            <AdminDashboard />
          ) : (
            <StudentDashboard />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
