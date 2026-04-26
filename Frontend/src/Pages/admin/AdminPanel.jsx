import React, { useEffect, useState, useMemo, useCallback } from "react";
import { PLANS, NAVIGATION } from "../../assets/dummydata";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Users from "./Users";
import { useAppContext } from "../../context/AppProvider";
import Setting from "./Setting";
import Loading from "../../Components/Loading/Loading";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- STATE FOR DATABASE DATA ---
  const [users, setUsers] = useState([]);
  const [company, setCompany] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [usersdata, setUsersData] = useState({});
  const [totaljobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  const { HIREFLOWLOGO, currency } = useAppContext();
  const { user } = useAppContext();

  // Subscription states
  const [subsCompanies, setSubsCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [planFilter, setPlanFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [subsStats, setSubsStats] = useState({
    free: 0,
    basic: 0,
    pro: 0,
    enterprise: 0,
    totalRevenue: 0,
  });

  // --- RESPONSIVENESS HOOK ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // --- DYNAMIC DATA FETCHING ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Users
        const usersRes = await api.get("/api/admin/allusers");
        if (usersRes.status === 200) {
          setUsers(usersRes.data.users || []);
          setUsersData(usersRes.data || {});
        }

        const companyRes = await api.get("/api/admin/allcompany");
        if (companyRes.status === 200) {
          const companies = companyRes.data.company || [];
          setCompany(companies);
          setTotalJobs(companyRes.data.totalJobs || 0);
        }

        try {
          const jobsRes = await api.get("/api/admin/alljobs");
          if (jobsRes.status === 200) {
            setJobs(jobsRes.data.data || jobsRes.data || []);
          }
        } catch (err) {
          console.log("Jobs endpoint error", err);
        }

        try {
          const appsRes = await api.get("/api/admin/allapplications");
          if (appsRes.status === 200) {
            setApplications(appsRes.data.data || appsRes.data || []);
          }
        } catch (err) {
          console.log("Applications endpoint error", err);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleUserStatus = async (id, newStatus) => {
    // Optimistic UI Update: Update the specific user in the 'users' state immediately
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u._id === id ? { ...u, status: newStatus } : u)),
    );

    try {
      const response = await api.put(`/api/admin/user/status/${id}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        // If the API returns the updated user object, sync it again to be safe
        if (response.data.user) {
          setUsers((prevUsers) =>
            prevUsers.map((u) => (u._id === id ? response.data.user : u)),
          );
        }
        console.log("Status updated successfully");
      }
    } catch (error) {
      console.log("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    if (company.length > 0) {
      const normalizedCompanies = company.map((comp) => {
        const planKey = comp.currentPlan || comp.plan || "free";

        const isExpired = comp.subscriptionEnd
          ? new Date(comp.subscriptionEnd) < new Date()
          : false;

        return {
          ...comp,
          currentPlan: planKey,
          jobsUsed: comp.jobsUsed ?? 0, // Default to 0 if undefined
          jobsLimit: comp.jobsLimit ?? (planKey === "enterprise" ? -1 : 3), // Default limit if undefined
          subscriptionStart: comp.subscriptionStart || comp.createdAt,
          subscriptionEnd: comp.subscriptionEnd || null,
          isExpired: isExpired,
          companyData: comp.companyData || comp,
        };
      });

      setSubsCompanies(normalizedCompanies);

      const stats = normalizedCompanies.reduce(
        (acc, comp) => {
          const plan = comp.currentPlan || "free";
          acc[plan] = (acc[plan] || 0) + 1;

          // Sum revenue for paid plans
          if (plan !== "free") {
            acc.totalRevenue += PLANS[plan]?.price || 0;
          }
          return acc;
        },
        { free: 0, basic: 0, pro: 0, enterprise: 0, totalRevenue: 0 },
      );
      setSubsStats(stats);
    } else {
      // Reset if no companies
      setSubsCompanies([]);
      setSubsStats({
        free: 0,
        basic: 0,
        pro: 0,
        enterprise: 0,
        totalRevenue: 0,
      });
    }
  }, [company]);

  const handleUserUpdated = useCallback((updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u._id === updatedUser._id ? updatedUser : u)),
    );
  }, []);

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      if (confirm("Are you sure delete this user ??")) {
        await api.delete(`/api/admin/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoading(true);
        const usersRes = await api.get("/api/admin/allusers");
        if (usersRes.status === 200) {
          setUsers(usersRes.data.users || []);
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // --- DATA CHART LOGIC (Now uses subsCompanies derived from real data) ---

  const applicationTrendsData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const data = months.map((m) => ({
      month: m,
      applications: 0,
      interviews: 0,
      hires: 0,
    }));

    applications.forEach((app) => {
      const date = new Date(app.createdAt || app.updatedAt);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (data[monthIndex]) {
          data[monthIndex].applications += 1;
          if (app.status === "interview") data[monthIndex].interviews += 1;
          if (app.status === "hired") data[monthIndex].hires += 1;
        }
      }
    });
    return data;
  }, [applications]);

  const jobCategoriesData = useMemo(() => {
    const categoryMap = {};
    jobs.forEach((job) => {
      const key = job.department || job.workMode || "General";
      if (!categoryMap[key]) categoryMap[key] = { name: key, value: 0 };
      categoryMap[key].value += 1;
    });
    const colors = [
      "#3B82F6",
      "#8B5CF6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#6366F1",
    ];
    return Object.values(categoryMap).map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
    }));
  }, [jobs]);

  const subscriptionTrendsData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const data = months.map((m) => ({
      month: m,
      free: 0,
      basic: 0,
      pro: 0,
      enterprise: 0,
    }));

    subsCompanies.forEach((comp) => {
      // Use subscriptionStart or fallback to createdAt
      const date = new Date(comp.subscriptionStart || comp.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (data[monthIndex] && comp.currentPlan) {
          data[monthIndex][comp.currentPlan] += 1;
        }
      }
    });
    return data;
  }, [subsCompanies]);

  const revenueData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const data = months.map((m) => ({ month: m, revenue: 0 }));

    subsCompanies.forEach((comp) => {
      if (comp.currentPlan !== "free") {
        const price = PLANS[comp.currentPlan]?.price || 0;
        const date = new Date(comp.subscriptionStart || comp.createdAt);
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          if (data[monthIndex]) {
            data[monthIndex].revenue += price;
          }
        }
      }
    });
    return data;
  }, [subsCompanies]);

  const monthlyUsersData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const data = months.map((m) => ({
      month: m,
      candidates: 0,
      recruiters: 0,
    }));

    users.forEach((u) => {
      const date = new Date(u.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (data[monthIndex]) {
          if (u.accountType === "company") {
            data[monthIndex].recruiters += 1;
          } else {
            data[monthIndex].candidates += 1;
          }
        }
      }
    });
    return data;
  }, [users]);

  const Logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      window.location.href = "/";
      localStorage.clear();
    }
  };

  const handleUpgradePlan = useCallback((companyId, newPlan) => {
    setSubsCompanies((prev) => {
      const updatedCompanies = prev.map((comp) =>
        comp._id === companyId
          ? {
              ...comp,
              currentPlan: newPlan,
              jobsLimit: PLANS[newPlan]?.jobLimit || 3,
              subscriptionStart: new Date().toISOString(),
              subscriptionEnd:
                newPlan === "free"
                  ? null
                  : new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
              isExpired: false,
            }
          : comp,
      );

      // Recalculate stats immediately
      const oldCompany = prev.find((c) => c._id === companyId);
      const oldPlan = oldCompany?.currentPlan || "free";
      setSubsStats((prevStats) => ({
        ...prevStats,
        [oldPlan]: Math.max(0, (prevStats[oldPlan] || 0) - 1),
        [newPlan]: (prevStats[newPlan] || 0) + 1,
        totalRevenue:
          prevStats.totalRevenue -
          (PLANS[oldPlan]?.price || 0) +
          (PLANS[newPlan]?.price || 0),
      }));
      return updatedCompanies;
    });

    setShowPlanModal(false);
    setSelectedCompany(null);
    alert(`Successfully changed plan to ${PLANS[newPlan]?.name}`);
  }, []);

  const handleResetJobs = useCallback((companyId) => {
    // NOTE: API call needed here: api.patch(`/api/admin/company/${companyId}/reset-jobs`)

    setSubsCompanies((prev) =>
      prev.map((comp) =>
        comp._id === companyId ? { ...comp, jobsUsed: 0 } : comp,
      ),
    );
    setShowDetailModal(false);
    alert("Job count reset successfully");
  }, []);

  const filteredCompanies = useMemo(() => {
    return subsCompanies.filter((comp) => {
      const matchesPlan =
        planFilter === "all" || comp.currentPlan === planFilter;
      const matchesSearch =
        (comp.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (comp.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (comp.companyName?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        );
      return matchesPlan && matchesSearch;
    });
  }, [subsCompanies, planFilter, searchQuery]);

  const getPlanBadge = useCallback((plan) => {
    const planConfig = PLANS[plan] || PLANS.free;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planConfig.badgeColor || "bg-gray-100 text-gray-800"}`}
      >
        {planConfig.name || "Free"}
      </span>
    );
  }, []);

  const getJobUsageBar = useCallback((used, limit) => {
    const safeUsed = typeof used === "number" ? used : 0;
    const safeLimit = typeof limit === "number" ? limit : 3;
    const percentage =
      safeLimit === -1 ? 0 : Math.min((safeUsed / safeLimit) * 100, 100);
    const isOverLimit = safeLimit !== -1 && safeUsed >= safeLimit;
    const barColor = isOverLimit
      ? "bg-red-500"
      : percentage > 75
        ? "bg-yellow-500"
        : "bg-green-500";

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600 dark:text-gray-400">
            {safeUsed} / {safeLimit === -1 ? "∞" : safeLimit} jobs
          </span>
          <span
            className={`font-medium ${isOverLimit ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}
          >
            {safeLimit === -1 ? "Unlimited" : `${Math.round(percentage)}%`}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div
            className={`${barColor} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {isOverLimit && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Limit reached! Upgrade required for new jobs.
          </p>
        )}
      </div>
    );
  }, []);

  if (loading) {
    return <Loading detail="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* MOBILE BACKDROP */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50
            bg-white dark:bg-gray-800
            border-r border-gray-200 dark:border-gray-700
            transition-all duration-300 ease-in-out
            flex flex-col
            ${
              isMobile
                ? `${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`
                : `${sidebarOpen ? "w-64" : "w-20"}`
            }
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div
              className={`flex items-center gap-3 transition-opacity duration-200 ${!sidebarOpen && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
            >
              <img src={HIREFLOWLOGO} alt="logo" className="h-8 w-8 rounded" />
              <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                Hire Flow
              </span>
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {NAVIGATION.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`
                  group flex items-center px-2 py-2.5 text-sm font-medium rounded-lg w-full transition-colors duration-150
                  ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                  ${!sidebarOpen && !isMobile ? "justify-center" : "justify-start"}
                `}
              >
                <svg
                  className={`${!sidebarOpen && !isMobile ? "" : "mr-3"} h-5 w-5 shrink-0`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
                <span
                  className={`${!sidebarOpen && !isMobile ? "hidden" : "block"}`}
                >
                  {item.name}
                </span>
              </button>
            ))}
          </nav>

          {/* Quick Stats */}
          {(sidebarOpen || isMobile) && activeTab === "subscriptions" && (
            <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Plan Distribution
              </p>
              <div className="space-y-2">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {plan.name}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {subsStats[key] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT WRAPPER */}
        <div
          className={`
            flex-1 flex flex-col overflow-hidden relative transition-all duration-300
            ${isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"}
          `}
        >
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                <h1 className="text-xl font-semibold text-gray-900 dark:text-white capitalize truncate">
                  {activeTab}
                </h1>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={Logout}
                  className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
                <button
                  onClick={Logout}
                  className="sm:hidden p-2 text-blue-600 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-2 sm:p-4 lg:p-">
            {/* ======================== DASHBOARD ======================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Users",
                      value: usersdata.totalUsers || users.length,
                      change: "+12%",
                      changeColor: "text-green-600",
                      iconBg: "bg-blue-100 dark:bg-blue-900/30",
                      iconColor: "text-blue-600",
                      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                    },
                    {
                      label: "Active Jobs",
                      value: totaljobs,
                      change: "+8%",
                      changeColor: "text-green-600",
                      iconBg: "bg-green-100 dark:bg-green-900/30",
                      iconColor: "text-green-600",
                      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                    },
                    {
                      label: "Total Applications",
                      value: applications.length || 0,
                      change: "+15%",
                      changeColor: "text-green-600",
                      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
                      iconColor: "text-yellow-600",
                      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                    {
                      label: "Avg. Time to Hire",
                      value: "24 days",
                      change: "-5%",
                      changeColor: "text-red-600",
                      iconBg: "bg-purple-100 dark:bg-purple-900/30",
                      iconColor: "text-purple-600",
                      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800 shadow rounded-lg p-5 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <div
                          className={`shrink-0 ${card.iconBg} rounded-md p-3`}
                        >
                          <svg
                            className={`h-6 w-6 ${card.iconColor}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={card.icon}
                            />
                          </svg>
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              {card.label}
                            </dt>
                            <dd className="text-lg font-bold text-gray-900 dark:text-white">
                              {card.value}
                            </dd>
                          </dl>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <span className={`${card.changeColor} font-medium`}>
                          {card.change}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          from last month
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Application Trends */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Application Trends
                  </h3>
                  <div className="h-64 sm:h-80 lg:h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={applicationTrendsData}>
                        <CartesianGrid
                          strokeDasharray="3 10"
                          stroke="gray"
                          vertical={false}
                        />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderRadius: "0.5rem",
                          }}
                          labelStyle={{ color: "#f3f4f6" }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="applications"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="Applications"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="interviews"
                          stroke="#10B981"
                          strokeWidth={2}
                          name="Interviews"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="hires"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          name="Hires"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Job Categories
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={jobCategoriesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {jobCategoriesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              borderRadius: "0.5rem",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Monthly User Registrations
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyUsersData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            vertical={false}
                          />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              borderRadius: "0.5rem",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="candidates"
                            fill="#3B82F6"
                            name="Candidates"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="recruiters"
                            fill="#8B5CF6"
                            name="Recruiters"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subscriptions" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    {
                      label: "Total Recruiters",
                      value: company.length,
                      bg: "bg-white",
                      border: "border-gray-200",
                    },
                    {
                      label: "Free Plan",
                      value: subsStats.free || 0,
                      bg: "bg-gray-50",
                      border: "border-gray-200",
                    },
                    {
                      label: "Basic Plan",
                      value: subsStats.basic || 0,
                      bg: "bg-blue-50",
                      border: "border-blue-200",
                    },
                    {
                      label: "Pro Plan",
                      value: subsStats.pro || 0,
                      bg: "bg-purple-50",
                      border: "border-purple-200",
                    },
                    {
                      label: "Enterprise",
                      value: subsStats.enterprise || 0,
                      bg: "bg-yellow-50",
                      border: "border-yellow-200",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className={`${stat.bg} border ${stat.border} dark:bg-gray-800 dark:border-gray-700 shadow rounded-lg p-4`}
                    >
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Monthly Recurring Revenue
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            vertical={false}
                          />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              borderRadius: "0.5rem",
                            }}
                            formatter={(value) => [`$${value}`, "Revenue"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ fill: "#10B981", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Plan Migration Trends
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subscriptionTrendsData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            vertical={false}
                          />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              borderRadius: "0.5rem",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="free"
                            fill="#9CA3AF"
                            name="Free"
                            stackId="a"
                          />
                          <Bar
                            dataKey="basic"
                            fill="#3B82F6"
                            name="Basic"
                            stackId="a"
                          />
                          <Bar
                            dataKey="pro"
                            fill="#8B5CF6"
                            name="Pro"
                            stackId="a"
                          />
                          <Bar
                            dataKey="enterprise"
                            fill="#F59E0B"
                            name="Enterprise"
                            stackId="a"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Recruiter Subscriptions
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-64"
                      />
                      <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-auto"
                      >
                        <option value="all">All Plans</option>
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {filteredCompanies.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                          No companies found
                        </p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Company
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Plan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-200">
                              Job Usage
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredCompanies.map((comp) => (
                            <tr
                              key={comp._id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 shrink-0">
                                    <img
                                      className="h-10 w-10 rounded-full object-cover bg-gray-200"
                                      src={comp?.companyData?.logo}
                                      alt=""
                                      onError={(e) =>
                                        (e.target.style.display = "none")
                                      }
                                    />
                                    {!comp?.companyData?.logo && (
                                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                        {comp.name?.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {comp?.companyData?.name || comp.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {comp.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getPlanBadge(comp.currentPlan)}
                              </td>
                              <td className="px-6 py-4">
                                {getJobUsageBar(comp.jobsUsed, comp.jobsLimit)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {comp.isExpired ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Expired
                                  </span>
                                ) : comp.jobsUsed >= comp.jobsLimit ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Limit
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => {
                                    setSelectedCompany(comp);
                                    setShowPlanModal(true);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                                >
                                  Change
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500">
                    Showing {filteredCompanies.length} of {subsCompanies.length}{" "}
                    companies
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <Users
                users={users}
                onUserUpdated={handleUserUpdated}
                handleDeleteUser={handleDeleteUser}
                handleUserStatus={handleUserStatus}
              />
            )}
          </main>
        </div>
      </div>

      {showPlanModal && selectedCompany && (
        <div
          className="fixed inset-1 z-60 overflow-y-auto "
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0  bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowPlanModal(false)}
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-blue-600 px-4 py-3 sm:px-6 flex justify-between items-center">
                <h3
                  className="text-lg leading-6 font-medium text-white"
                  id="modal-title"
                >
                  Change Subscription Plan
                </h3>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-blue-200 hover:text-white focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <p className="text-sm text-gray-500 mb-4">
                  Select a new plan for{" "}
                  <span className="font-bold text-white">
                    {selectedCompany?.name}
                  </span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(PLANS).map(([key, plan]) => {
                    const isCurrent = selectedCompany.currentPlan === key;
                    return (
                      <button
                        key={key}
                        onClick={() =>
                          handleUpgradePlan(selectedCompany._id, key)
                        }
                        disabled={isCurrent}
                        className={`relative p-4 border-2 rounded-xl text-left transition-all ${isCurrent ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 dark:border-gray-600 dark:hover:border-blue-500"}`}
                      >
                        {isCurrent && (
                          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                        <div
                          className={`font-bold  ${isCurrent ? "text-white dark:text-black" : "text-gray-900 dark:text-white"} `}
                        >
                          <h4 className="font-bold  ">{plan.name}</h4>
                          <span className="font-bold ">
                            {plan.price === 0
                              ? `${currency} 0.0`
                              : `${currency}${plan.price}`}
                          </span>
                        </div>
                        <p
                          className={`  ${isCurrent ? "text-white dark:text-black" : "text-gray-900 dark:text-white"} `}
                        >
                          {plan.jobLimit === -1 ? "Unlimited" : plan.jobLimit}{" "}
                          Jobs
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedCompany && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowDetailModal(false)}
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {selectedCompany.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedCompany.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedCompany.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm font-medium text-gray-500">
                      Current Plan
                    </span>
                    {getPlanBadge(selectedCompany.currentPlan)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Job Usage
                    </p>
                    {getJobUsageBar(
                      selectedCompany.jobsUsed,
                      selectedCompany.jobsLimit,
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedCompany(selectedCompany);
                    setShowPlanModal(true);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Change Plan
                </button>
                <button
                  onClick={() => handleResetJobs(selectedCompany._id)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Reset Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
