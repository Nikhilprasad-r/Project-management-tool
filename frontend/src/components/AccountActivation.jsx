import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const apiUrl = import.meta.env.VITE_API_URL;

const AccountActivation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setError("Invalid activation link.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${apiUrl}/auth/activate/${token}`);
        console.log("Account activated:", response.data);
        setTimeout(() => navigate("/signin", { replace: true }), 3000); // Redirect after 3 seconds
        setLoading(false);
      } catch (err) {
        console.error(
          "Activation error:",
          err.response?.data?.msg || "Server error"
        );
        setError(err.response?.data?.msg || "Failed to activate account.");
        setLoading(false);
      }
    };

    activateAccount();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-lg text-blue-500">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-lg text-red-500">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <h1 className="text-lg text-green-500">
        Your account has been successfully activated. Redirecting to login...
      </h1>
    </div>
  );
};

export default AccountActivation;
