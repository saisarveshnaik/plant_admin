// src/pages/Logout.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove authToken from localStorage
    localStorage.removeItem("authToken");

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return null; // No UI needed for logout
};

export default Logout;
