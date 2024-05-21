import React from "react";
import "./RegisterForm.css";
import { Button, Col, Container, InputGroup, Row } from "react-bootstrap";
import CalenderImg from "../../../assets/img/undraw_calendar_re_ki49.svg";

import Form from "react-bootstrap/Form";

function RegisterForm() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student", // Default role
  });
  const auth = useAuth();

  const submitHandler = (e) => {
    e.preventDefault();
    if (input.email !== "" && input.password !== "") {
      auth.loginAction(input);
    } else {
      alert("Please provide valid credentials");
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div></div>
      <Container className="py-3 align-content-center">
        <Row className="mx-auto gap-4">
          <Col className="mx-auto align-content-center" lg>
            <h1 className="fw-bold display-4 text-center text-lg-start ">
              Sign in to Web Attendance System
            </h1>
            <img
              src={CalenderImg}
              className="img-fluid d-none d-lg-block"
              alt=""
            />
          </Col>
          <Col className="mx-auto align-content-center " lg>
            {" "}
            <h2>Select Your Role</h2>
            <Form onSubmit={submitHandler}>
              {["radio"].map((type) => (
                <div key={`inline-${type}`} className="mb-3">
                  <Form.Check
                    inline
                    label="Admin"
                    name="role"
                    value="admin"
                    type={type}
                    checked={input.role === "admin"}
                    onChange={inputHandler}
                    id={`inline-${type}-1`}
                  />
                  <Form.Check
                    inline
                    label="Student"
                    name="role"
                    value="student"
                    type={type}
                    checked={input.role === "student"}
                    onChange={inputHandler}
                    id={`inline-${type}-2`}
                  />
                  <InputGroup size="md" className="mb-3">
                    <Form.Control
                      type="email"
                      name="email"
                      onChange={inputHandler}
                      value={input.email}
                      placeholder="Enter Username"
                      aria-label="Username"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </InputGroup>
                  <br />
                  <InputGroup className="mb-3">
                    <Form.Control
                      aria-label="Password"
                      type="password"
                      name="password"
                      onChange={inputHandler}
                      value={input.password}
                      placeholder="Enter Password"
                      aria-describedby="inputGroup-sizing-default"
                    />
                  </InputGroup>
                  <Button
                    className="mx-auto d-flex btn-danger"
                    onClick={SubmitHandler}
                  >
                    Login
                  </Button>
                </div>
              ))}
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RegisterForm;
