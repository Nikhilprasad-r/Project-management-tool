import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, apiUrl, isAuthenticated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [user]);

  return <div>Home</div>;
};

export default Home;
