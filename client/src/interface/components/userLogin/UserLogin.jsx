import React, { useState } from "react";
import { useAuth } from "../../../useCases/context/AuthContext";

const UserLogin = () => {
  const { department } = useAuth();

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student",
    department: "Computer Science", // Default role
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
    <div className="container">
      <h1 className="text-center">User Login</h1>
      <form className="" onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            onChange={inputHandler}
            value={input.email}
            placeholder="Enter Email"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text text-white">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>

          <input
            type="password"
            name="password"
            onChange={inputHandler}
            value={input.password}
            placeholder="Enter Password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <h4 className="text-center">You are logging in as: </h4>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="role" // Corrected name attribute to "role"
            id="flexRadioDefault1"
            checked={input.role === "admin"}
            onChange={inputHandler}
            value="admin"
          />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            Admin
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="role" // Corrected name attribute to "role"
            id="flexRadioDefault2"
            checked={input.role === "student"}
            onChange={inputHandler}
            value="student"
          />
          <label className="form-check-label" htmlFor="flexRadioDefault2">
            Student
          </label>
        </div>
        <h4 className="text-center">Select Your Department</h4>
        {department.map((depart, index) => {
          return (
            <div className="form-check" key={index}>
              <input
                className="form-check-input"
                type="radio"
                name="department" // Corrected name attribute to "role"
                id={index}
                checked={input.department === depart.name}
                onChange={inputHandler}
                value={depart.name}
              />
              <label className="form-check-label" htmlFor={`dept-${index}`}>
                {depart.name}
              </label>
            </div>
          );
        })}
        <button type="submit" className="btn btn-primary d-flex mx-auto">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
