import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
      const response = await fetch(`${apiUrl}/auth/validatetoken`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        method: "GET",
      });
      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  const fetchProjects = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get(`${apiUrl}/api/projects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get(`${apiUrl}/api/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [isAuthenticated]);

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
        projects,
        tasks,
        setProjects,
        setTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
