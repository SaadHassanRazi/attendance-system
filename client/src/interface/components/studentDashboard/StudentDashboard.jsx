import React, { useEffect, useState } from "react";
import { useAuth } from "../../../useCases/context/AuthContext";
import axios from "axios";

const StudentDashboard = () => {
  const { studentRecord, user, userData, userId } = useAuth();

  const [studentData, setStudentData] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [liveDuration, setLiveDuration] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [studentId, setStudentId] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0];

  // Set studentId using authenticated userId and validate against userData
  const determineStudentId = () => {
    if (userId === null || userId === undefined) {
      console.error("No authenticated userId provided.");
      return;
    }

    // Verify userId corresponds to a student in userData
    const currentUser = userData?.find(
      (u) => u.id === parseInt(userId) && u.role === "student"
    );
    if (currentUser) {
      setStudentId(currentUser.id);
      console.log("Student ID set from authenticated userId:", userId);
    } else {
      console.error(
        "Authenticated userId does not correspond to a student:",
        userId
      );
    }
  };

  // Fetch updated student records from the API
  const fetchStudentRecords = async () => {
    if (studentId !== null && studentId !== undefined) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/attendance?studentId=${studentId}`
      );
      setStudentData(response.data);
    } catch (error) {
      console.error("Failed to fetch student records:", error);
    }
  };

  // Initialize timer based on current session
  const initializeSession = () => {
    const activeRecord = studentData.find(
      (record) =>
        record.date === currentDate &&
        record.checkInTime &&
        !record.checkOutTime
    );
    if (activeRecord) {
      setTimerActive(true);
      const checkInTime = new Date(activeRecord.checkInTime).getTime();
      const now = new Date().getTime();
      setLiveDuration(Math.floor((now - checkInTime) / 1000));
    } else {
      setTimerActive(false);
      setLiveDuration(0);
    }
  };

  // Calculate total duration
  const calculateTotalDuration = () => {
    const total = studentData.reduce(
      (sum, record) => sum + (record.duration || 0),
      0
    );
    setTotalDuration(total);
  };

  // Handle check-in
  const handleCheckIn = async () => {
    if (!studentId) {
      alert(
        "Student ID not found. Please ensure you are logged in as a student."
      );
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/attendance/checkin",
        {
          studentId,
          date: currentDate,
        }
      );
      alert(response.data.message);
      await fetchStudentRecords();
      setTimerActive(true);
      setLiveDuration(0);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to check in.");
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    if (!studentId) {
      alert(
        "Student ID not found. Please ensure you are logged in as a student."
      );
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/attendance/checkout",
        {
          studentId,
          date: currentDate,
        }
      );
      alert(response.data.message);
      await fetchStudentRecords();
      setTimerActive(false);
      setLiveDuration(0);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to check out.");
    }
  };

  // Timer effect
  useEffect(() => {
    if (!timerActive) return;
    
    const checkInTime = studentData.find(
      (record) => record.date === currentDate && record.checkInTime && !record.checkOutTime
    )?.checkInTime;
  
    if (!checkInTime) return;
  
    const updateDuration = () => {
      const now = Date.now();
      setLiveDuration(Math.floor((now - new Date(checkInTime).getTime()) / 1000));
    };
  
    updateDuration(); // Initial calculation
    const interval = setInterval(updateDuration, 1000);
  
    return () => clearInterval(interval);
  }, [timerActive, studentData]);
  
  // Set studentId on mount or when userId/userData changes
  useEffect(() => {
    determineStudentId();
  }, [userId, userData]);

  // Fetch records once studentId is set
  useEffect(() => {
    if (studentId) {
      fetchStudentRecords();
    }
  }, [studentId]);

  // Update total duration and session state when studentData changes
  useEffect(() => {
    calculateTotalDuration();
    initializeSession();
  }, [studentData]);

  // Format live duration
  const formatLiveDuration = () => {
    const minutes = Math.floor(liveDuration / 60);
    const seconds = liveDuration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <h1 className="text-center">Student Dashboard</h1>
      <div className="mb-3 text-center">
        <button
          className="btn btn-success me-2"
          onClick={handleCheckIn}
          disabled={timerActive}
        >
          Check In
        </button>
        <button
          className="btn btn-danger"
          onClick={handleCheckOut}
          disabled={!timerActive}
        >
          Check Out
        </button>
      </div>
      {timerActive && (
        <div className="text-center mb-3">
          <h5>Current Session Time: {formatLiveDuration()}</h5>
        </div>
      )}
      <table className="table rounded table-primary table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Email</th>
            <th scope="col">Date</th>
            <th scope="col">Check-In Time</th>
            <th scope="col">Check-Out Time</th>
            <th scope="col">Duration (minutes)</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((data, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{data.email}</td>
              <td>{data.date}</td>
              <td>
                {data.checkInTime
                  ? new Date(data.checkInTime).toLocaleTimeString()
                  : "-"}
              </td>
              <td>
                {data.checkOutTime
                  ? new Date(data.checkOutTime).toLocaleTimeString()
                  : "-"}
              </td>
              <td>{data.duration || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row justify-content-center">
        <div className="col d-flex justify-content-center">
          <div className="card text-center" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">Total Time Spent (minutes)</h5>
              <p className="card-text">{totalDuration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
