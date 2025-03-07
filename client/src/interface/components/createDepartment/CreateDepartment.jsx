import React, { useState } from "react";
import { useAuth } from "../../../useCases/context/AuthContext";
import { Arrow90degLeft, ArrowBarLeft, ArrowClockwise, ArrowLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const CreateDepartment = () => {
  const { createDepartment, error } = useAuth(); // Use createDepartment and error from context
  const [departmentName, setDepartmentName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminName,setAdminName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (!departmentName || !adminName  || !adminEmail || !adminPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    const result = await createDepartment(departmentName,adminName, adminEmail, adminPassword);
    if (result.success) {
      alert("Department and Admin created successfully!");
      setDepartmentName("");
      setAdminEmail("");
      setAdminPassword("");
    }
  };

  return (
    <div>
      <h1>Create Department</h1>
      <form onSubmit={handleSubmit} className="bg-dark p-5 rounded">
        <Link to={"/dashboard"}>
        <ArrowLeft className="h2 text-danger"/>
        </Link>
        {error && <p className="text-danger">{error}</p>} {/* Display error from context */}
        <div className="mb-3">
          <label htmlFor="departmentName" className="form-label">Name of Department</label>
          <input
            type="text"
            className="form-control"
            id="departmentName"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required // HTML required attribute for accessibility
          />
        </div>
        <div className="mb-3">
          <label htmlFor="adminEmail" className="form-label">Admin Email Address</label>
          <input
            type="email"
            className="form-control"
            id="adminEmail"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />
          <div id="emailHelp" className="form-text text-white">
            Type the email of the Admin
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="adminName" className="form-label">Admin Email Address</label>
          <input
            type="text"
            className="form-control"
            id="adminName"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            required
          />
          <div id="emailHelp" className="form-text text-white">
            Type the Name of the Admin
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="adminPassword" className="form-label">Admin Password</label>
          <input
            type="password"
            className="form-control"
            id="adminPassword"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CreateDepartment;
