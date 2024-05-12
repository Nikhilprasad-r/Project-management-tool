import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [user, setUser] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const signIn = async (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.isadmin) {
      useNavigate("/admin");
    } else if (userData.role === "tl") {
      useNavigate("/teamleader");
    } else {
      useNavigate("/developer");
    }

    setIsAuthenticated(true);
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/auth/validatetoken`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      validateToken(token).then((isValid) => {
        if (isValid) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          signOut();
        }
      });
    }
  }, []);

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "token" && !event.newValue) {
        signOut();
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        signIn,
        signOut,
        apiUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
