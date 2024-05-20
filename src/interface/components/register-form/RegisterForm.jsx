import React from "react";
import "./RegisterForm.css";
import { ArrowRight } from "react-bootstrap-icons";
import { Button, Col, Container, InputGroup, Row } from "react-bootstrap";
import CalenderImg from "../../../assets/img/undraw_calendar_re_ki49.svg";

import Form from "react-bootstrap/Form";

function RegisterForm(props) {
  return (
    <>
      <div></div>
      <Container className="py-3 align-content-center">
        <Row className="mx-auto gap-4">
          <Col className="mx-auto align-content-center" lg>
            <h1 className="fw-bold display-4 text-center text-lg-start ">
              Sign in to Web Attendance System
            </h1>
            <img src={CalenderImg} className="img-fluid d-none d-lg-block" alt="" />
          </Col>
          <Col className="mx-auto align-content-center " lg>
            {" "}
            <h2>Select Your Role</h2>
            <div>{CheckInlineExample()}</div>
           
          </Col>
        </Row>
      </Container>
    </>
  );
}

function CheckInlineExample() {
  return (
    <Form>
      {["radio"].map((type) => (
        <div key={`inline-${type}`} className="mb-3">
          <Form.Check
            inline
            label="Admin"
            name="role"
            value="admin"
            type={type}
            id={`inline-${type}-1`}
          />
          <Form.Check
            inline
            label="Student"
            name="role"
            value="student"
            type={type}
            id={`inline-${type}-2`}
          />
          <InputGroup size="md" className="mb-3">
            <Form.Control
            placeholder="Enter Username"
              aria-label="Username"
              aria-describedby="inputGroup-sizing-sm"
            />
          </InputGroup>
          <br />
          <InputGroup className="mb-3">
            <Form.Control
              aria-label="Password"
              placeholder="Enter Password"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
          <Button className="mx-auto d-flex btn-danger">Login</Button>
        </div>
      ))}
    </Form>
  );
}

export default RegisterForm;
