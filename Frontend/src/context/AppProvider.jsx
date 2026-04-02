import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyCandidate } from "../assets/dummydata";
import api from "../api/axios";

// Create context
export const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [candidate, setCandidate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const userdata = JSON.parse(localStorage.getItem("user"));
      setUser(userdata);
    }
  }, []);

  // console.log("runnig");  Every time reload all function that's  fetch updated data

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/candidates/${dummyCandidate._id}`);
        console.log(response);
        setCandidate(response.data.data);
      } catch (err) {
        console.error("Error fetching candidate data:", err);
        setError("Failed to load candidate data. Please try again later.");
        setCandidate(dummyCandidate); // Use dummy data on error
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, []);

  const navigate = useNavigate();

  const value = { navigate, user, candidate, loading, error };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook
export const useAppContext = () => {
  return useContext(AppContext);
};
