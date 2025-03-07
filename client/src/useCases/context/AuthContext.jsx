import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../apiHandling/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [token, setToken] = useState(localStorage.getItem("site") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [departName, setDepartName] = useState(
    localStorage.getItem("departName") || ""
  );
  const [userData, setUserData] = useState([]);
  const [department, setDepartment] = useState([]);
  const [studentRecord, setStudentRecord] = useState([]);
  const [error, setError] = useState(""); // Error state for department creation
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("user", user);
  }, [user]);

  const getDeparts = async () => {
    try {
      const response = await axiosInstance.get("/departments");
      setDepartment(response.data);
    } catch (error) {
      console.error("Error Fetching Data: ", error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUserData(response.data);
    } catch (error) {
      console.error("Error Fetching Data", error);
    }
  };

  const getStudentRecords = async () => {
    try {
      const response = await axiosInstance.get("/attendance");
      setStudentRecord(response.data);
    } catch (error) {
      console.error("Error Fetching Data: ", error);
    }
  };

  useEffect(() => {
    getDeparts();
    getStudentRecords();
    getUserData();
  }, []);
  const createStudent = async (name, email, password,department) => {
    try {
      const response = await axiosInstance.post("/users", {
        name,
        email,
        password,
        department
      });
      await getUserData();
      return { success: true };
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Set error message
        console.log(error);
      } else {
        setError("Failed to create student.");
      }
      return { success: false };
    }
  };

  const createDepartment = async (name, admin, email, password) => {
    setError(""); // Reset error before the request

    try {
      const response = await axiosInstance.post("/departments", {
        name,
        admin,
        email,
        password,
      });

      // Reload department list from server to ensure up-to-date list
      await getDeparts();
      await getUserData();
      return { success: true };
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Set error message
      } else {
        setError("Failed to create department.");
      }
      return { success: false };
    }
  };

  const loginAction = async (data) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users`, {
        method: "GET",
      });
      const users = await response.json();
      const user = users.find(
        (user) =>
          user.email === data.email &&
          user.password === data.password &&
          user.department === data.department
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
    setUserName("")
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
        studentRecord,
        error, // Expose error state
        loginAction,
        logOut,
        createDepartment, // Expose createDepartment function
        userData,
        createStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
