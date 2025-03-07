import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../useCases/context/AuthContext";

const OwnerDashboard = () => {
  const { department, user, userData } = useAuth();
  return (
    <div>
      <h1 className="text-center">Owner Dashboard</h1>
      <Link className="btn btn-success" to={"/create-department"}>
        Create Department
      </Link>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Department</th>
            <th scope="col">Admin</th>
          </tr>
        </thead>
        <tbody>
          {userData
            .filter((item) => item.role === "admin")
            .map((item, index) => {
              return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{item.department}</td>
                  <td>{item.name}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerDashboard;
