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
  const [message, setMessage] = useState(null);
  const [companydata, setCompanyData] = useState({});
  const [isloading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const userdata = JSON.parse(localStorage.getItem("user"));
      setUser(userdata);
    }
  }, [token]);

  const fetchCandidateData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      setLoading(true);
      const response = await api.get(`/api/candidates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidate(response.data.data);
    } catch (err) {
      console.error("Error fetching candidate data:", err);
      setError("Failed to load candidate data. Please try again later.");
      setCandidate(dummyCandidate); // Use dummy data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "candidate" && token) {
      fetchCandidateData();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("api/company/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanyData(response.data?.companyData);
      localStorage.setItem(
        "company_id",
        JSON.stringify(response.data.companyData.company._id),
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({
        text: "Failed to load profile data. Please refresh the page.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const url = userRole === "company" ? "company" : "candidate";
      try {
        setLoading(true);
        const res = await api.get(`/api/jobs/${url}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          console.log(res);
          setJobs(res.data.data);
          // setLoading(false);
        }
      } catch (error) {
        console.log(error);
        // setLoading(false);
      }
    };
    if (token) {
      fetchJobs();
    }
  }, [token, userRole]);

  useEffect(() => {
    if (userRole === "company" && token) {
      fetchProfile();
    }
  }, [token]);

  const value = {
    navigate,
    user,
    candidate,
    loading,
    error,
    currency,
    message,
    isloading,
    jobs,
    companydata,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook
export const useAppContext = () => {
  return useContext(AppContext);
};
