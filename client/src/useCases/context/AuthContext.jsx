// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../apiHandling/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [token, setToken] = useState(localStorage.getItem("site") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [departName, setDepartName] = useState(localStorage.getItem("departName") || "");
  const [userData, setUserData] = useState([]);
  const [department, setDepartment] = useState([]);
  const [studentAttendanceRecords, setStudentAttendanceRecords] = useState([]); // Renamed for clarity
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("user", user);
  }, [user]);

  // Fetch departments
  const getDeparts = async () => {
    try {
      const response = await axiosInstance.get("/departments");
      setDepartment(response.data);
    } catch (error) {
      console.error("Error Fetching Departments: ", error);
    }
  };

  // Fetch all users
  const getUserData = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUserData(response.data);
    } catch (error) {
      console.error("Error Fetching Users: ", error);
    }
  };

  // Fetch attendance records for a specific student
  const getStudentAttendanceRecords = async (studentId) => {
    try {
      const response = await axiosInstance.get(`/attendance?studentId=${studentId}`);
      setStudentAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error Fetching Attendance Records: ", error);
    }
  };

  // Fetch all attendance records (for admin/owner)
  const getAllAttendanceRecords = async () => {
    try {
      const response = await axiosInstance.get("/attendance");
      setStudentAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error Fetching All Attendance Records: ", error);
    }
  };

  // Fetch leave requests (filtered by department for admin)
  const getLeaveRequests = async (department) => {
    try {
      const url = department ? `/leave/requests?department=${department}` : "/leave/requests";
      const response = await axiosInstance.get(url);
      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Error Fetching Leave Requests: ", error);
    }
  };

  // Check-in
  const checkIn = async (studentId, latitude, longitude) => {
    try {
      const response = await axiosInstance.post("/attendance/checkin", {
        studentId,
        date: new Date().toISOString().split("T")[0],
        latitude,
        longitude,
      });
      await getStudentAttendanceRecords(studentId); // Refresh records
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to check in." };
    }
  };

  // Check-out
  const checkOut = async (studentId) => {
    try {
      const response = await axiosInstance.post("/attendance/checkout", {
        studentId,
        date: new Date().toISOString().split("T")[0],
      });
      await getStudentAttendanceRecords(studentId); // Refresh records
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to check out." };
    }
  };

  // Request a leave
  const requestLeave = async (studentId, startDate, endDate, reason) => {
    try {
      const response = await axiosInstance.post("/leave/request", {
        studentId,
        startDate,
        endDate,
        reason,
      });
      await getLeaveRequests(departName); // Refresh leave requests
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to request leave." };
    }
  };

  // Approve/Reject leave (admin)
  const updateLeaveRequest = async (leaveId, status) => {
    try {
      const response = await axiosInstance.put(`/leave/requests/${leaveId}`, { status });
      await getLeaveRequests(departName); // Refresh leave requests
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update leave request." };
    }
  };

  useEffect(() => {
    getDeparts();
    getUserData();
    if (userId && role === "student") {
      getStudentAttendanceRecords(userId);
      getLeaveRequests();
    } else if (role === "admin") {
      getAllAttendanceRecords();
      getLeaveRequests(departName);
    } else if (role === "owner") {
      getAllAttendanceRecords();
      getLeaveRequests();
    }
  }, [userId, role, departName]);

  const createStudent = async (name, email, password, department) => {
    try {
      const response = await axiosInstance.post("/users", { name, email, password, department });
      await getUserData();
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create student.");
      return { success: false };
    }
  };

  const createDepartment = async (name, admin, email, password) => {
    setError("");
    try {
      const response = await axiosInstance.post("/departments", { name, admin, email, password });
      await getDeparts();
      await getUserData();
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create department.");
      return { success: false };
    }
  };

  const loginAction = async (data) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users`, { method: "GET" });
      const users = await response.json();
      const user = users.find(
        (u) => u.email === data.email && u.password === data.password && u.department === data.department
      );
      if (user && user.role === data.role) {
        setUser(user.email);
        setToken(user.token);
        setRole(user.role);
        setDepartName(user.department);
        setUserName(user.name);
        setUserId(user.id);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("site", user.token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("user", user.email);
        localStorage.setItem("departName", user.department);
        localStorage.setItem("userName", user.name);
        navigate("/dashboard");
        return;
      }
      throw new Error("Invalid credentials or role");
    } catch (err) {
      console.error("Login action error:", err);
      alert("Login failed: " + err.message);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    setRole("");
    setUserId(null);
    setUserName("");
    localStorage.removeItem("userId");
    localStorage.removeItem("site");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("departName");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        userId,
        userName,
        department,
        departName,
        studentAttendanceRecords,
        leaveRequests,
        error,
        loginAction,
        logOut,
        createDepartment,
        userData,
        createStudent,
        checkIn,
        checkOut,
        requestLeave,
        updateLeaveRequest,
        getStudentAttendanceRecords, // Expose for manual refresh if needed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};