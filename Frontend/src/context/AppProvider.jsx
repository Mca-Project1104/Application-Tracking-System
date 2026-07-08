import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import HIREFLOWLOGO from "../assets/HIRE_FLOW.png";
import api from "../api/axios";
import { AppWindow } from "lucide-react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("admin_token");
  const userRole = localStorage.getItem("userRole");
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [jobsLoading, setJobsLoading] = useState(false);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [appsLoading, setAppsLoading] = useState(false);
  const searchRef = useRef(null);

  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState({});
  const [candidate, setCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [companydata, setCompanyData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  const [stats, setStats] = useState({});
  const [recentapplications, setRecentApplications] = useState([]);
  const [pipelinestages, setPipelineStages] = useState([]);
  const [jobpostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [subscription, setSubscription] = useState({
    plan: "FREE",
    status: "ACTIVE",
    endDate: null,
    limits: { maxJobs: 3, activeJobs: 0 },
  });

  const isInitialLoading = jobsLoading && !jobs.length;

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("user"));
    setUser(userdata);
  }, [token, adminToken]);

  const fetchJobs = useCallback(async () => {
    if (!token || !userRole) return;
    const url = userRole === "company" ? "company" : "candidate";

    try {
      setJobsLoading(true);
      const res = await api.get(`/api/v1/jobs/${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setJobs(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const fetchCandidateData = useCallback(async () => {
    if (!token) return;

    try {
      setCandidateLoading(true);
      const response = await api.get(`/api/v1/candidates`, {
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

  const fetchApplications = useCallback(
    async (candidateId) => {
      if (!candidateId || !token) return;

      try {
        setAppsLoading(true);
        const response = await api.post(
          "/api/v1/applications/find/application",
          {
            candidateId,
          },
          {
            headers: {
              Authorization: `Bearer ${token ? token : {}}`,
            },
          },
        );
        setApplications(response.data.data || []);
      } catch (error) {
        setApplications([]);
      } finally {
        setAppsLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.key === "/") {
        event.preventDefault();
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  useEffect(() => {
    if (userRole === "candidate" && candidate?._id) {
      fetchApplications(candidate._id);
    }
  }, [userRole, candidate?._id, fetchApplications]);

  const fetchProfile = useCallback(async () => {
    if (!token) return;

    try {
      setProfileLoading(true);
      const response = await api.get("/api/v1/company/profile", {
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
      console.error(error);
      setMessage({
        text: "Failed to load profile data.",
        type: "error",
      });
    } finally {
      setProfileLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "true") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleClose = () => {
    if (window.opener) {
      window.close();
    } else {
      navigate("/");
    }
  };

  const fetchCompanyDashbord = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/api/v1/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response?.data?.stats);
      setRecentApplications(response?.data?.recentApplications);
      setPipelineStages(response?.data?.pipeline);
      setJobPostings(response?.data?.jobs);

      if (response?.data?.company) {
        setSubscription(response.data.company.subscription);
        setSubscription((prev) => ({
          ...prev,
          limits: response.data.company.limits,
        }));
      } else if (response?.data?.subscription) {
        setSubscription(response.data.subscription);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userRole === "company" && token) {
      fetchCompanyDashbord();
      fetchProfile();
    }
  }, [userRole, token]);

  const value = {
    navigate,
    user,
    setUser,
    candidate,
    setCandidate,

    jobsLoading,
    candidateLoading,
    profileLoading,
    appsLoading,
    isInitialLoading,

    refetchJobs: fetchJobs,
    refetchCandidate: fetchCandidateData,
    refetchDashboard: fetchCompanyDashbord,
    refetchApplications: () =>
      candidate?._id && fetchApplications(candidate._id),
    refetchProfile: fetchProfile,

    error,
    setError,
    theme,
    handleClose,
    setTheme,
    currency,
    message,
    setMessage,
    HIREFLOWLOGO,
    applications,
    searchRef,
    jobs,
    companydata,
    token,
    userRole,
    stats,
    setStats,
    recentapplications,
    setRecentApplications,
    pipelinestages,
    setPipelineStages,
    jobpostings,
    setJobPostings,
    loading,
    subscription,
    setSubscription,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
