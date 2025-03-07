import React, { useEffect, useState } from "react";
import { useAuth } from "../../../useCases/context/AuthContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { studentRecord, departName, userData} = useAuth();
  console.log(studentRecord);
  
  const [departmetStudentRecord, setDepartmentStudentRecord] = useState([]);
  const [departmentStudents, setDepartmentStudents] = useState([]);
  const filterStudentRecords = () => {
    const filteredData = studentRecord.filter(
      (item) => item.department === departName
    );
    setDepartmentStudentRecord(filteredData);
  };

  const getUserNames = () => {
    const filteredData = userData.filter(
      (item) => item.department === departName && item.role === "student"
    );
    setDepartmentStudents(filteredData);
  };
  useEffect(() => {
    filterStudentRecords();
    getUserNames();
  }, [studentRecord, departName]);

  return (
    <div>
      <h1 className="text-center">
        Total Students ({departmentStudents.length})
      </h1>
      <table className="table rounded table-primary table-striped">
        <thead className="">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Email</th>
            <th scope="col">Department</th>
            <th scope="col">Attendance</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>
          {studentRecord.filter((data)=>data.department === departName).map((data, index) => (
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

      <Link className="btn  btn-success" to={'/create-student'}>Create Student Account</Link>
    </div>
  );
};

export default AdminDashboard;
