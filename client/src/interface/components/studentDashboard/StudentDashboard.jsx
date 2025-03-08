import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../useCases/context/AuthContext";
import axios from "axios";

const StudentDashboard = () => {
  const { studentRecord, user, userData, userId } = useAuth();
  const [studentData, setStudentData] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [liveDuration, setLiveDuration] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false); // Prevent multiple simultaneous calls

  const currentDate = new Date().toISOString().split("T")[0];

  // Set studentId using authenticated userId and validate against userData
  const determineStudentId = useCallback(() => {
    if (userId === null || userId === undefined) {
      console.error("No authenticated userId provided.");
      return;
    }
    const currentUser = userData?.find((u) => u.id === parseInt(userId) && u.role === "student");
    if (currentUser) {
      setStudentId(currentUser.id);
      console.log("Student ID set from authenticated userId:", userId);
    } else {
      console.error("Authenticated userId does not correspond to a student:", userId);
    }
  }, [userId, userData]);

  // Fetch updated student records from the API
  const fetchStudentRecords = async () => {
    if (!studentId) return; // Fixed condition
    try {
      const response = await axios.get(`http://localhost:3000/api/attendance?studentId=${studentId}`);
      setStudentData(response.data);
    } catch (error) {
      console.error("Failed to fetch student records:", error);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
          (error) => reject(new Error(`Location access denied: ${error.message}`)),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    });
  };

  // Initialize timer based on current session
  const initializeSession = useCallback(() => {
    const activeRecord = studentData.find(
      (record) => record.date === currentDate && record.checkInTime && !record.checkOutTime
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
  }, [studentData, currentDate]);

  // Calculate total duration
  const calculateTotalDuration = useCallback(() => {
    const total = studentData.reduce((sum, record) => sum + (record.duration || 0), 0);
    setTotalDuration(total);
  }, [studentData]);

  // Handle check-in with location
  const handleCheckIn = useCallback(async () => {
    if (!studentId) {
      alert("Student ID not found. Please ensure you are logged in as a student.");
      return;
    }
    if (isCheckingIn) {
      console.log("Check-in already in progress, ignoring additional call.");
      return;
    }

    setIsCheckingIn(true);
    console.log("handleCheckIn called", new Date().toISOString());

    try {
      const { latitude, longitude } = await getCurrentLocation();
      const response = await axios.post("http://localhost:3000/api/attendance/checkin", {
        studentId,
        date: currentDate,
        latitude,
        longitude,
      });
      alert(response.data.message);
      await fetchStudentRecords();
      setTimerActive(true);
      setLiveDuration(0);
      setLocationError(null);
    } catch (error) {
      if (error.message.includes("Location access denied")) {
        setLocationError("Please enable location access to check in.");
        alert("Please enable location access to check in.");
      } else {
        alert(error.response?.data?.error || "Failed to check in.");
      }
    } finally {
      setIsCheckingIn(false);
    }
  }, [studentId, currentDate]);

  // Handle check-out
  const handleCheckOut = useCallback(async () => {
    if (!studentId) {
      alert("Student ID not found. Please ensure you are logged in as a student.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/api/attendance/checkout", {
        studentId,
        date: currentDate,
      });
      alert(response.data.message);
      await fetchStudentRecords();
      setTimerActive(false);
      setLiveDuration(0);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to check out.");
    }
  }, [studentId, currentDate]);

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

    updateDuration();
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [timerActive, studentData, currentDate]);

  // Set studentId on mount or when userId/userData changes
  useEffect(() => {
    determineStudentId();
  }, [determineStudentId]);

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
  }, [studentData, calculateTotalDuration, initializeSession]);

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
          disabled={timerActive || isCheckingIn}
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
      {locationError && (
        <div className="text-center mb-3 text-danger">
          <p>{locationError}</p>
        </div>
      )}
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
              <td>{data.checkInTime ? new Date(data.checkInTime).toLocaleTimeString() : "-"}</td>
              <td>{data.checkOutTime ? new Date(data.checkOutTime).toLocaleTimeString() : "-"}</td>
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