import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import HIREFLOWLOGO from "../assets/HIRE_FLOW.png";

// Create context
export const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  //  Separate loading states for each operation
  const [jobsLoading, setJobsLoading] = useState(false);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [appsLoading, setAppsLoading] = useState(false);

  //  Jobs initialized as empty array (NOT undefined)
  const [jobs, setJobs] = useState([]);

  const [user, setUser] = useState(null);
  const [candidate, setCandidate] = useState(null); // ✅ null instead of {}
  const [applications, setApplications] = useState([]);
  const [companydata, setCompanyData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  //  Combined loading state for convenience
  const isInitialLoading = jobsLoading && !jobs.length;

  // Load user from localStorage (sync)
  useEffect(() => {
    if (token) {
      try {
        const userdata = JSON.parse(localStorage.getItem("user"));
        setUser(userdata);
      } catch {
        setUser(null);
      }
    }
  }, [token]);

  //  Fetch Jobs - FIXED dependency array
  const fetchJobs = useCallback(async () => {
    if (!token || !userRole) return;

    const url = userRole === "company" ? "company" : "candidate";

    try {
      setJobsLoading(true);
      const res = await api.get(`/api/jobs/${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setJobs(res.data.data || []); //  Fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]); //  Reset to empty on error
    } finally {
      setJobsLoading(false); // ALWAYS reset loading
    }
  }, [token, userRole]); //  FIXED: Proper array dependency

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]); // ✅ Runs when token OR userRole changes

  // Fetch Candidate Data
  const fetchCandidateData = useCallback(async () => {
    if (!token) return;

    try {
      setCandidateLoading(true);
      const response = await api.get(`/api/candidates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidate(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching candidate data:", err);
      setError("Failed to load candidate data.");
      setCandidate(null);
    } finally {
      setCandidateLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (userRole === "candidate" && token) {
      fetchCandidateData();
    }
  }, [userRole, token, fetchCandidateData]);

  //  Fetch Applications - Only runs AFTER candidate has _id
  const fetchApplications = useCallback(
    async (candidateId) => {
      if (!candidateId || !token) return;

      try {
        setAppsLoading(true);
        const response = await api.post(
          "/api/applications/find/application",
          { candidateId },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setApplications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      } finally {
        setAppsLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    //  Only fetch if candidate exists AND has _id
    if (userRole === "candidate" && candidate?._id) {
      fetchApplications(candidate._id);
    }
  }, [userRole, candidate?._id, fetchApplications]); // ✅ Depends on _id specifically

  //  Fetch Company Profile
  const fetchProfile = useCallback(async () => {
    if (!token) return;

    try {
      setProfileLoading(true);
      const response = await api.get("api/company/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanyData(response.data?.companyData);
      if (response.data?.companyData?.company?._id) {
        localStorage.setItem(
          "company_id",
          JSON.stringify(response.data.companyData.company._id),
        );
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({
        text: "Failed to load profile data.",
        type: "error",
      });
    } finally {
      setProfileLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (userRole === "company" && token) {
      fetchProfile();
    }
  }, [userRole, token, fetchProfile]);

  // Theme handling
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "true") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = {
    navigate,
    user,
    setUser,
    candidate,
    setCandidate,

    // Separate loading states
    jobsLoading,
    candidateLoading,
    profileLoading,
    appsLoading,
    isInitialLoading,

    // Refetch functions exposed
    refetchJobs: fetchJobs,
    refetchCandidate: fetchCandidateData,
    refetchApplications: () =>
      candidate?._id && fetchApplications(candidate._id),
    refetchProfile: fetchProfile,

    error,
    setError,
    theme,
    setTheme,
    currency,
    message,
    setMessage,
    HIREFLOWLOGO,
    applications,
    jobs,
    companydata,
    token,
    userRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
