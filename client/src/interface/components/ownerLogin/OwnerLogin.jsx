import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../useCases/context/AuthContext";

const OwnerLogin = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "owner", // Default role
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
      <h1 className="text-center text-white">Welcome Owner</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            value={input.email}
            onChange={inputHandler}
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
            className="form-control"
            id="exampleInputPassword1"
            value={input.password}
            onChange={inputHandler}
            
          />
        </div>
        <button type="submit" className="btn btn-primary d-flex mx-auto">
          Submit
        </button>
      </form>
    </div>
  );
};

export default OwnerLogin;
