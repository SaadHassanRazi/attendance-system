import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useAuth } from "../../../utilities/authContext/AuthProvider";
import AdminDashboard from "../adminDashboard/AdminDashboard";
import WaveAnimation from "../../waveAnimation/WaveAnimation";
import StudentDashboard from "../studentDashboard/StudentDashboard";
import axios from "axios";

const Dashboard = () => {
  const { user, role } = useAuth();
 
 
  return (
    <div className="main-container">
      <WaveAnimation />
      <div className="content">
        <div className="border align-content-center shadow shadow-lg py-2 w-75 mx-auto bg-white rounded">
          <Row className="d-flex text-center text-md-start justify-content-between mx-auto">
            <Col md>
              <h3>Dashboard</h3>
            </Col>
            <Col className="" md>
              <div className="d-flex float-md-end">
                <PersonCircle className="h2 m-auto" />
                <h4 className="m-auto">{user}</h4>
              </div>
            </Col>
          </Row>
        </div>
        <div className="text-center display-4 text-white">Attendance System</div>
        <div>
          {role === "admin" ? (
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
