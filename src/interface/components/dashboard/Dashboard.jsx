import { Button, Col, Row } from "react-bootstrap";
import React from "react";
import { PersonCircle } from "react-bootstrap-icons";

function Dashboard() {
  return (
    <>
      <div className="border align-content-center shadow shadow-lg py-2 w-75 mx-auto bg-white rounded">
        <Row className="d-flex text-center text-md-start justify-content-between mx-auto">
          <Col md>
            <h3>Dashboard</h3>
          </Col>
          <Col className="" md>
            <div className="d-flex float-md-end">
            <PersonCircle className="h2 "/>
            <h4 className="m-auto">Admin</h4>
            
            </div>
            
          </Col>
        </Row>
      </div>
      <div className="text-center display-4">Attendance System</div>
      <Button className="btn btn-primary btn-lg d-flex m-auto">
        Mark Attendance
      </Button>
    </>
  );
}

export default Dashboard;
