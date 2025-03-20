// StudentDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../useCases/context/AuthContext";

const StudentDashboard = () => {
  const {
    studentAttendanceRecords,
    userId,
    userData,
    leaveRequests,
    checkIn,
    checkOut,
    requestLeave,
  } = useAuth();
  const [totalDuration, setTotalDuration] = useState(0);
  const [liveDuration, setLiveDuration] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ startDate: "", endDate: "", reason: "" });

  const currentDate = new Date().toISOString().split("T")[0];

  // Set studentId
  const determineStudentId = useCallback(() => {
    if (!userId) {
      console.error("No authenticated userId provided.");
      return;
    }
    const currentUser = userData?.find((u) => u.id === parseInt(userId) && u.role === "student");
    if (currentUser) {
      setStudentId(currentUser.id);
    } else {
      console.error("Authenticated userId does not correspond to a student:", userId);
    }
  }, [userId, userData]);

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

  // Initialize timer
  const initializeSession = useCallback(() => {
    const activeRecord = studentAttendanceRecords.find(
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
  }, [studentAttendanceRecords, currentDate]);

  // Calculate total duration
  const calculateTotalDuration = useCallback(() => {
    const total = studentAttendanceRecords.reduce((sum, record) => sum + (record.duration || 0), 0);
    setTotalDuration(total);
  }, [studentAttendanceRecords]);

  // Handle check-in
  const handleCheckIn = useCallback(async () => {
    if (!studentId) {
      alert("Student ID not found. Please ensure you are logged in as a student.");
      return;
    }
    if (isCheckingIn) return;

    setIsCheckingIn(true);
    try {
      const { latitude, longitude } = await getCurrentLocation();
      const data = await checkIn(studentId, latitude, longitude);
      alert(data.message);
      setTimerActive(true);
      setLiveDuration(0);
      setLocationError(null);
    } catch (error) {
      if (error.error?.includes("Location access denied")) {
        setLocationError("Please enable location access to check in.");
        alert("Please enable location access to check in.");
      } else {
        alert(error.error || "Failed to check in.");
      }
    } finally {
      setIsCheckingIn(false);
    }
  }, [studentId, checkIn]);

  // Handle check-out
  const handleCheckOut = useCallback(async () => {
    if (!studentId) {
      alert("Student ID not found. Please ensure you are logged in as a student.");
      return;
    }
    try {
      const data = await checkOut(studentId);
      alert(data.message);
      setTimerActive(false);
      setLiveDuration(0);
    } catch (error) {
      alert(error.error || "Failed to check out.");
    }
  }, [studentId, checkOut]);

  // Handle leave request
  const handleLeaveRequest = async (e) => {
    e.preventDefault();
    if (!studentId) {
      alert("Student ID not found.");
      return;
    }
    try {
      const data = await requestLeave(studentId, leaveForm.startDate, leaveForm.endDate, leaveForm.reason);
      alert(data.message);
      setLeaveForm({ startDate: "", endDate: "", reason: "" });
    } catch (error) {
      alert(error.error || "Failed to submit leave request.");
    }
  };

  // Filter leave requests for the current student
  const studentLeaveRequests = leaveRequests.filter((request) => request.studentId === parseInt(studentId));

  // Timer effect
  useEffect(() => {
    if (!timerActive) return;
    const checkInTime = studentAttendanceRecords.find(
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
  }, [timerActive, studentAttendanceRecords, currentDate]);

  // Set studentId and initialize
  useEffect(() => {
    determineStudentId();
  }, [determineStudentId]);

  useEffect(() => {
    calculateTotalDuration();
    initializeSession();
  }, [studentAttendanceRecords, calculateTotalDuration, initializeSession]);

  const formatLiveDuration = () => {
    const minutes = Math.floor(liveDuration / 60);
    const seconds = liveDuration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Student Dashboard</h1>

      {/* Check In/Out Buttons */}
      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-success me-3"
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

      {/* Location Error */}
      {locationError && (
        <div className="alert alert-danger text-center mb-4" role="alert">
          {locationError}
        </div>
      )}

      {/* Live Duration */}
      {timerActive && (
        <div className="text-center mb-4">
          <h5 className="text-muted">Current Session Time: <span className="fw-bold">{formatLiveDuration()}</span></h5>
        </div>
      )}

      {/* Leave Request Form */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Request a Leave</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleLeaveRequest}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="startDate" className="form-label">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="endDate" className="form-label">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="reason" className="form-label">Reason</label>
              <textarea
                id="reason"
                className="form-control"
                rows="3"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit Leave Request</button>
          </form>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Attendance Records</h3>
        </div>
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-primary">
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
              {studentAttendanceRecords.map((data, index) => (
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
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">My Leave Requests</h3>
        </div>
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Reason</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentLeaveRequests.length > 0 ? (
                studentLeaveRequests.map((request, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{request.startDate}</td>
                    <td>{request.endDate}</td>
                    <td>{request.reason}</td>
                    <td>
                      <span
                        className={`badge ${
                          request.status === "approved"
                            ? "bg-success"
                            : request.status === "rejected"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No leave requests submitted yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Duration Card */}
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Time Spent (minutes)</h5>
              <p className="card-text fs-4">{totalDuration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;