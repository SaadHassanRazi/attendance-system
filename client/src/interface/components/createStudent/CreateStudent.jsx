import React, { useState } from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../../useCases/context/AuthContext";

const CreateStudent = () => {
  const { createStudent,departName } = useAuth();

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setstudentPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!studentEmail || !studentName || !studentPassword) {
      alert("Please fill in all required fields.");
      return;
    }
    const result = createStudent(studentName, studentEmail, studentPassword,departName);
    if (result.success) {
      alert("Student created successfully!");
      studentName("");
      studentEmail("");
      studentPassword("");
    }
  };
  return (
    <div>
      <Link to={"/dashboard"}>
        <ArrowLeft className="h2" />
      </Link>

      <h1>Create Student</h1>
      <form onSubmit={submitHandler}>
        <div class="mb-3">
          <label htmlFor="exampleInputName" className="form-label">
            Student Name
          </label>
          <input
            type="text"
            className="form-control"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            id="exampleInputName"
            required
          />
        </div>
        <div class="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Student Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            aria-describedby="emailHelp"
            required
          />
          <div id="emailHelp" className="form-text text-secondary">
            Enter Student Email Address
          </div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            value={studentPassword}
            onChange={(e) => setstudentPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateStudent;
