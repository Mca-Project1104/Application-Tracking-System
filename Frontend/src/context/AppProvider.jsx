import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create context
export const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    }
  }, [token]);

  const navigate = useNavigate();

  const value = { navigate, user };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook
export const useAppContext = () => {
  return useContext(AppContext);
};
