import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();

  const loginAction = async (data) => {
    try {
      const response = await fetch(`https://664c5f8535bbda109880179d.mockapi.io/users`, {
        method: "GET",
      });
      const users = await response.json();
      const user = users.find(
        (user) =>
          user.email === data.email && user.password === data.password
      );

      if (user && user.role === data.role) {
        setUser(user.email);
        setToken(user.token);
        setRole(user.role);
        localStorage.setItem("site", user.token);
        localStorage.setItem("role", user.role);
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
    localStorage.removeItem("site");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
