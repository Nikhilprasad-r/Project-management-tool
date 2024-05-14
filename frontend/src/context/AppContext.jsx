import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppContext = createContext({
  isAuthenticated: false,
  user: null,
  signIn: () => {},
  signOut: () => {},
  apiUrl: "",
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [formMode, setFormMode] = useState();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const signIn = async (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);

    if (userData.isadmin) {
      navigate("/admin");
    } else if (userData.role === "tl") {
      navigate("/teamleader");
    } else {
      navigate("/developer");
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/auth/validatetoken`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.status === 200;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && user) {
      validateToken(token).then((isValid) => {
        if (!isValid) signOut();
      });
    }
  }, [user]);
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "token" && !event.newValue) {
        signOut();
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        signIn,
        signOut,
        apiUrl,
        formMode,
        setFormMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
