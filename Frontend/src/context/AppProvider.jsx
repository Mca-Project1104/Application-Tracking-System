import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Create context
export const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const name = "hello world";

  const navigate = useNavigate();

  const value = { name, navigate };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook
export const useAppContext = () => {
  return useContext(AppContext);
};
