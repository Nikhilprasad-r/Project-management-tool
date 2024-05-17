import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  signIn: () => {},
  signOut: () => {},
  apiUrl: "",
  formMode: "",
  setFormMode: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [formMode, setFormMode] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const signIn = async (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setToken(token);

    if (userData.isAdmin) {
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
    setToken(null);
    navigate("/signin");
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

  const apiCall = async (method, url, data) => {
    try {
      const response = await axios({
        method,
        url: `${apiUrl}${url}`,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API call error:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        signIn,
        signOut,
        apiUrl,
        formMode,
        setFormMode,
        apiCall,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
