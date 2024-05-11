import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";

const Home = () => {
  const { user } = useApp();
  useEffect(() => {
    if (user) {
    } else {
      useNavigate("/login");
    }
  }, []);

  return <div>Home</div>;
};

export default Home;
