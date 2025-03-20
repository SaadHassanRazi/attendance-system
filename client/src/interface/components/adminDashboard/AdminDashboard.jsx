// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../useCases/context/AuthContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { studentAttendanceRecords, departName, userData, leaveRequests, updateLeaveRequest } = useAuth();
  const [departmentStudentRecords, setDepartmentStudentRecords] = useState([]);
  const [departmentStudents, setDepartmentStudents] = useState([]);

  const filterStudentRecords = () => {
    const filteredData = studentAttendanceRecords.filter((item) => item.department === departName);
    setDepartmentStudentRecords(filteredData);
  };

  const getUserNames = () => {
    const filteredData = userData.filter((item) => item.department === departName && item.role === "student");
    setDepartmentStudents(filteredData);
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      const data = await updateLeaveRequest(leaveId, status);
      alert(data.message);
    } catch (error) {
      alert(error.error || `Failed to ${status} leave request.`);
    }
  };

  useEffect(() => {
    filterStudentRecords();
    getUserNames();
  }, [studentAttendanceRecords, departName, userData]);

  return (
    <div>
      <h1 className="text-center">Total Students ({departmentStudents.length})</h1>
      <table className="table rounded table-primary table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Email</th>
            <th scope="col">Department</th>
            <th scope="col">Student Id</th>
          </tr>
        </thead>
        <tbody>
          {departmentStudents.map((data, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{data.email}</td>
              <td>{data.department}</td>
              <td>{data.id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5">
        <h1 className="text-center">Students Attendance Records ({departmentStudents.length})</h1>
        <table className="table rounded table-primary table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Department</th>
              <th scope="col">Attendance</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {departmentStudentRecords.map((data, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{data.email}</td>
                <td>{data.department}</td>
                <td>{data.date}</td>
                <td>{data.duration} minutes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <h1 className="text-center">Leave Requests</h1>
        <table className="table rounded table-primary table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Reason</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{request.email}</td>
                <td>{request.startDate}</td>
                <td>{request.endDate}</td>
                <td>{request.reason}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === "pending" && (
                    <>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleLeaveAction(request.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleLeaveAction(request.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link className="btn btn-success" to={"/create-student"}>Create Student Account</Link>
    </div>
  );
};

export default AdminDashboard;