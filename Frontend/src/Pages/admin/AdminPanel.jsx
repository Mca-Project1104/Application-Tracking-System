import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { PLANS } from "../../assets/dummydata";
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

const NAVIGATION = [
  {
    name: "Dashboard",
    id: "dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Users",
    id: "users",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    name: "Subscriptions",
    id: "subscriptions",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    name: "Settings",
    id: "settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
];

const generateMockSubscription = (company) => {
  const plans = ["free", "free", "free", "basic", "basic", "pro", "enterprise"];
  const randomPlan = plans[Math.floor(Math.random() * plans.length)];
  const jobLimit = PLANS[randomPlan]?.jobLimit || 3;
  const jobsUsed =
    company.jobsCount || Math.floor(Math.random() * (jobLimit + 2));
  const startDate = new Date(
    Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
  );
  const endDate =
    randomPlan === "free"
      ? null
      : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    plan: randomPlan,
    startDate: startDate.toISOString(),
    endDate: endDate?.toISOString() || null,
    jobLimit,
    jobsUsed,
    isExpired: endDate ? new Date(endDate) < new Date() : false,
  };
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- STATE FOR DATABASE DATA ---
  const [users, setUsers] = useState([]);
  const [company, setCompany] = useState([]);
  const [jobs, setJobs] = useState([]); // NEW: Store all jobs
  const [applications, setApplications] = useState([]); // NEW: Store all applications

  const [usersdata, setUsersData] = useState({});
  const [totaljobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  const { HIREFLOWLOGO, currency, navigate } = useAppContext();
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

        // 2. Fetch Companies
        const companyRes = await api.get("/api/admin/allcompany");
        if (companyRes.status === 200) {
          const companies = companyRes.data.company || [];
          setCompany(companies);
          setTotalJobs(companyRes.data.totalJobs || 0);
        }

        // 3. Fetch All Jobs
        try {
          const jobsRes = await api.get("/api/admin/alljobs");
          if (jobsRes.status === 200) {
            setJobs(jobsRes.data.data || jobsRes.data || []); // Adjust path based on API response
          }
        } catch (err) {
          console.log("Jobs endpoint error", err);
        }

        // 4. Fetch All Applications
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
  const handleUserUpdated = useCallback((updatedUser) => {
    // This function is passed to <Users />.
    // It finds the user with the matching ID in the main 'users' state and updates it.
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u._id === updatedUser._id ? updatedUser : u)),
    );
  }, []);

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      if (confirm("Are you sure delete this user ??")) {
        const response = await api.delete(`/api/admin/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(true);
        const usersRes = await api.get("/api/admin/allusers");
        if (usersRes.status === 200) {
          setUsers(usersRes.data.users || []);
        }
        console.log(usersRes);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  // 2. Job Categories (Group by Department or WorkMode)
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

  // 3. Subscription Trends (Derived from Enriched Companies)
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

  // 4. Revenue Data (Calculated from Mock Subscriptions)
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
        const date = new Date(comp.subscriptionStart);
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

  // 5. Monthly Users (Candidates vs Recruiters)
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
            // Using accountType based on controller
            data[monthIndex].recruiters += 1;
          } else {
            data[monthIndex].candidates += 1;
          }
        }
      }
    });
    return data;
  }, [users]);

  // --- MOCK DATA LOGIC (Kept for demonstration of UI, but enriched with real counts) ---
  useEffect(() => {
    if (company.length > 0) {
      const enrichedCompanies = company.map((comp) => {
        const mockSub = generateMockSubscription(comp);
        return {
          ...comp,
          currentPlan: mockSub.plan,
          jobsUsed: mockSub.jobsUsed,
          jobsLimit: mockSub.jobLimit,
          subscriptionStart: mockSub.startDate,
          subscriptionEnd: mockSub.endDate,
          isExpired: mockSub.isExpired,
          companyData: comp.companyData || comp,
        };
      });
      setSubsCompanies(enrichedCompanies);

      const stats = enrichedCompanies.reduce(
        (acc, comp) => {
          acc[comp.currentPlan] = (acc[comp.currentPlan] || 0) + 1;
          if (comp.currentPlan !== "free") {
            acc.totalRevenue += PLANS[comp.currentPlan]?.price || 0;
          }
          return acc;
        },
        { free: 0, basic: 0, pro: 0, enterprise: 0, totalRevenue: 0 },
      );
      setSubsStats(stats);
    }
  }, [company]);

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
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-64" : "w-20"} z-50 fixed  min-h-screen bg-white pt-2 dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out flex flex-col`}
        >
          <div className=" flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex gap-3 w-10 h-10 ${!sidebarOpen && "hidden"}`}>
              <img src={HIREFLOWLOGO} alt="logo" className="rounded" />
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
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
          </div>
          <nav className="mt-5 px-2 flex-1">
            <div className="space-y-3">
              {NAVIGATION.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${
                    activeTab === item.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors duration-150`}
                >
                  <svg
                    className={`${sidebarOpen ? "mr-0" : "mx-0"} h-5 w-5`}
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
                  {sidebarOpen && item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Subscription Quick Stats in Sidebar */}
          {sidebarOpen && activeTab === "subscriptions" && (
            <div className=" px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-5">
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
        </div>

        {/* Main Content */}
        <div className="flex-1  flex bg-white dark:bg-gray-900/50 flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-lg pl-22 font-semibold text-gray-900 dark:text-white capitalize">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "settings"
                    ? "Settings"
                    : activeTab === "users"
                      ? "User Management"
                      : activeTab === "subscriptions"
                        ? "Subscription Management"
                        : "dashboard"}
              </h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
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
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>

                <div className="bg-blue-600 active:scale-95 rounded">
                  <button
                    type="button"
                    onClick={Logout}
                    className=" text-white font-medium p-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 pl-22 bg-gray-100 dark:bg-gray-900 p-2 overflow-y-auto  transition-colors duration-200">
            {/* ======================== DASHBOARD ======================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 ">
                {/* Stats Cards */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                  style={{ marginBottom: "10px" }}
                >
                  {[
                    {
                      label: "Total Users",
                      value: usersdata.totalUsers || users.length,
                      change: "+12%",
                      changeColor: "text-green-600",
                      iconBg: "bg-blue-100 dark:bg-blue-900/30",
                      iconColor: "text-blue-600 dark:text-blue-400",
                      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                    },
                    {
                      label: "Active Jobs",
                      value: totaljobs,
                      change: "+8%",
                      changeColor: "text-green-600",
                      iconBg: "bg-green-100 dark:bg-green-900/30",
                      iconColor: "text-green-600 dark:text-green-400",
                      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                    },
                    {
                      label: "Total Applications",
                      value: applications.length || 0, // DYNAMIC VALUE
                      change: "+15%",
                      changeColor: "text-green-600",
                      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
                      iconColor: "text-yellow-600 dark:text-yellow-400",
                      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                    {
                      label: "Avg. Time to Hire",
                      value: "24 days",
                      change: "-5%",
                      changeColor: "text-red-600",
                      iconBg: "bg-purple-100 dark:bg-purple-900/30",
                      iconColor: "text-purple-600 dark:text-purple-400",
                      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      <div className="p-5">
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
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                {card.label}
                              </dt>
                              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                {card.value}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
                        <div className="text-sm">
                          <span className={`${card.changeColor} font-medium`}>
                            {card.change}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {" "}
                            from last month
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Application Trends Line Chart (Dynamic) */}
                <div
                  style={{ marginBottom: "8px" }}
                  className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white ">
                    Application Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={applicationTrendsData}>
                      <CartesianGrid strokeDasharray="3 10" stroke="gray" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937" }}
                        labelStyle={{ color: "#f3f4f6" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="applications"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        name="Applications"
                      />
                      <Line
                        type="monotone"
                        dataKey="interviews"
                        stroke="#10B981"
                        strokeWidth={3}
                        name="Interviews"
                      />
                      <Line
                        type="monotone"
                        dataKey="hires"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        name="Hires"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Job Categories
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
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
                            border: "1px solid #374151",
                            borderRadius: "0.375rem",
                          }}
                          labelStyle={{ color: "#f3f4f6" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Monthly User Registrations
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthlyUsersData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1f2937" }}
                          labelStyle={{ color: "#f3f4f6" }}
                        />
                        <Legend />
                        <Bar
                          dataKey="candidates"
                          fill="#3B82F6"
                          name="Candidates"
                        />
                        <Bar
                          dataKey="recruiters"
                          fill="#8B5CF6"
                          name="Recruiters"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subscriptions" && (
              <div className="space-y-6">
                {/* Subscription Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Total Recruiters
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {company.length}
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <svg
                          className="w-6 h-6 text-gray-600 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Free Plan
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {subsStats.free || 0}
                        </p>
                      </div>
                      <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
                        3 jobs
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Basic Plan
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {subsStats.basic || 0}
                        </p>
                      </div>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
                        {currency}199/mo
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          Pro Plan
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {subsStats.pro || 0}
                        </p>
                      </div>
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium px-2 py-1 rounded-full">
                        {currency}299/mo
                      </span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          Enterprise
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {subsStats.enterprise || 0}
                        </p>
                      </div>
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium px-2 py-1 rounded-full">
                        {currency}799/mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subscription Revenue Chart (Dynamic) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Monthly Recurring Revenue
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                            borderRadius: "0.375rem",
                          }}
                          labelStyle={{ color: "#f3f4f6" }}
                          formatter={(value) => [`$${value}`, "Revenue"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10B981"
                          strokeWidth={3}
                          dot={{ fill: "#10B981", r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Plan Migration Trends
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={subscriptionTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                            borderRadius: "0.375rem",
                          }}
                          labelStyle={{ color: "#f3f4f6" }}
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

                {/* Plans Configuration Overview */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Plan Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(PLANS).map(([key, plan]) => (
                      <div
                        key={key}
                        className={`rounded-lg border-2 ${plan.borderColor || "border-gray-300"} p-4 ${plan.bgColor || "bg-white"} transition-all duration-200 hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4
                            className={`font-semibold ${plan.textColor || "text-gray-900"}`}
                          >
                            {plan.name}
                          </h4>
                          <span
                            className={`text-lg font-bold ${plan.textColor || "text-gray-900"}`}
                          >
                            {plan.price === 0 ? "Free" : `₹${plan.price}`}
                          </span>
                        </div>
                        <div
                          className={`text-sm ${plan.textColor || "text-gray-700"} mb-3`}
                        >
                          {plan.jobLimit === -1 ? "Unlimited" : plan.jobLimit}{" "}
                          job postings
                        </div>
                        <ul className="space-y-1.5">
                          {plan.features?.slice(0, 4).map((feat, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-xs text-gray-600 dark:text-gray-400"
                            >
                              <svg
                                className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-green-500 shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Subscription Table */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Recruiter Subscriptions
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                          <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                          />
                        </div>
                        <select
                          value={planFilter}
                          onChange={(e) => setPlanFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Plans</option>
                          <option value="free">Free</option>
                          <option value="basic">Basic ({currency}199)</option>
                          <option value="pro">Pro ({currency}299)</option>
                          <option value="enterprise">
                            Enterprise ({currency}799)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    {filteredCompanies.length === 0 ? (
                      <div className="text-center py-20">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                          No companies found
                        </p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Company
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Plan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Job Usage
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Subscription
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
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <img
                                      src={comp?.companyData?.logo}
                                      alt="logo"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {comp?.companyData?.name ||
                                        comp.name ||
                                        "Unknown"}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {comp.email || "No email"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getPlanBadge(comp.currentPlan)}
                              </td>
                              <td className="px-6 py-4 min-w-[200px]">
                                {getJobUsageBar(comp.jobsUsed, comp.jobsLimit)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {comp.subscriptionStart
                                    ? new Date(
                                        comp.subscriptionStart,
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "N/A"}
                                </div>
                                {comp.subscriptionEnd && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    to{" "}
                                    {new Date(
                                      comp.subscriptionEnd,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {comp.isExpired ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Expired
                                  </span>
                                ) : comp.jobsLimit !== -1 &&
                                  comp.jobsUsed >= comp.jobsLimit ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Limit Reached
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Active
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedCompany(comp);
                                      setShowDetailModal(true);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                    title="View Details"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedCompany(comp);
                                      setShowPlanModal(true);
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                  >
                                    Change Plan
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Pagination */}
                  {filteredCompanies.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing{" "}
                        <span className="font-medium">
                          {filteredCompanies.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {subsCompanies.length}
                        </span>{" "}
                        companies
                      </p>
                    </div>
                  )}
                </div>

                {/* Free Plan Limit Warning Banner */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-5">
                  <div className="flex">
                    <div className="shrink-0">
                      <svg
                        className="h-6 w-6 text-amber-600 dark:text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Free Plan Limit Policy
                      </h3>
                      <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                        Recruiters on <strong>Free plan</strong> can post up to{" "}
                        <strong>3 jobs</strong>. Once the limit is reached, they
                        must upgrade to a paid plan (Basic, Pro, or Enterprise)
                        to post additional jobs. You can manually override
                        limits or reset job counts from the action buttons
                        above.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && <Setting />}
            {activeTab === "users" && (
              <Users
                users={users}
                onUserUpdated={handleUserUpdated}
                handleDeleteUser={handleDeleteUser}
              />
            )}
          </main>
        </div>
      </div>

      {/* ======================== CHANGE PLAN MODAL ======================== */}
      {showPlanModal && selectedCompany && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setShowPlanModal(false)}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full mx-auto overflow-hidden">
              {/* Modal Header */}
              <div className="bg-linear-to-r from-blue-600 to-purple-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Change Subscription Plan
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {selectedCompany.name || selectedCompany.companyName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
              </div>

              {/* Current Plan Info */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Current Plan:
                  </span>
                  <div className="flex items-center gap-3">
                    {getPlanBadge(selectedCompany.currentPlan)}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({selectedCompany.jobsUsed}/
                      {selectedCompany.jobsLimit === -1
                        ? "∞"
                        : selectedCompany.jobsLimit}{" "}
                      jobs used)
                    </span>
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="p-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Select new plan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(PLANS).map(([key, plan]) => {
                    const isCurrentPlan = selectedCompany.currentPlan === key;
                    return (
                      <button
                        key={key}
                        onClick={() =>
                          handleUpgradePlan(selectedCompany._id, key)
                        }
                        disabled={isCurrentPlan}
                        className={`relative text-left rounded-xl border-2 p-5 transition-all duration-200 ${
                          isCurrentPlan
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-default"
                            : "border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md cursor-pointer"
                        }`}
                      >
                        {isCurrentPlan && (
                          <div className="absolute -top-2.5 right-3">
                            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <h4
                            className={`font-semibold ${plan.textColor || "text-gray-900"}`}
                          >
                            {plan.name}
                          </h4>
                          <span
                            className={`text-lg font-bold ${plan.textColor || "text-gray-900"}`}
                          >
                            {plan.price === 0 ? "Free" : `₹${plan.price}`}
                            {plan.price > 0 && (
                              <span className="text-xs font-normal">/mo</span>
                            )}
                          </span>
                        </div>
                        <div
                          className={`text-xs ${plan.textColor || "text-gray-700"} mb-3`}
                        >
                          {plan.jobLimit === -1 ? "Unlimited" : plan.jobLimit}{" "}
                          job postings included
                        </div>
                        <ul className="space-y-1">
                          {plan.features?.slice(0, 3).map((feat, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-xs text-gray-600 dark:text-gray-400"
                            >
                              <svg
                                className="w-3 h-3 mr-1.5 mt-0.5 text-green-500 shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {feat}
                            </li>
                          ))}
                          {(plan.features?.length || 0) > 3 && (
                            <li className="text-xs text-gray-400">
                              +{plan.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedCompany && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setShowDetailModal(false)}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {selectedCompany.name?.charAt(0)?.toUpperCase() ||
                        selectedCompany.companyName?.charAt(0)?.toUpperCase() ||
                        "C"}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedCompany.name || selectedCompany.companyName}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedCompany.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Plan Info */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Current Plan
                    </p>
                    <div className="mt-1">
                      {getPlanBadge(selectedCompany.currentPlan)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {PLANS[selectedCompany.currentPlan]?.price === 0
                        ? "Free"
                        : `₹${PLANS[selectedCompany.currentPlan]?.price}/mo`}
                    </p>
                  </div>
                </div>

                {/* Job Usage */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Usage
                  </p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    {getJobUsageBar(
                      selectedCompany.jobsUsed,
                      selectedCompany.jobsLimit,
                    )}
                  </div>
                </div>

                {/* Subscription Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Start Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {selectedCompany.subscriptionStart
                        ? new Date(
                            selectedCompany.subscriptionStart,
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      End Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {selectedCompany.subscriptionEnd
                        ? new Date(
                            selectedCompany.subscriptionEnd,
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No expiry"}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      selectedCompany.isExpired
                        ? "bg-red-500"
                        : selectedCompany.jobsLimit !== -1 &&
                            selectedCompany.jobsUsed >=
                              selectedCompany.jobsLimit
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedCompany.isExpired
                      ? "Subscription Expired"
                      : selectedCompany.jobsLimit !== -1 &&
                          selectedCompany.jobsUsed >= selectedCompany.jobsLimit
                        ? "Job limit reached - upgrade required"
                        : "Active & in good standing"}
                  </span>
                </div>

                {/* Plan Features */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Included Features
                  </p>
                  <ul className="space-y-2">
                    {PLANS[selectedCompany.currentPlan]?.features?.map(
                      (feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                        >
                          <svg
                            className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feat}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedCompany(selectedCompany);
                      setShowPlanModal(true);
                    }}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Change Plan
                  </button>
                  {selectedCompany.currentPlan !== "free" && (
                    <button
                      onClick={() => {
                        // Extend subscription locally
                        setSubsCompanies((prev) =>
                          prev.map((comp) => {
                            if (
                              comp._id === selectedCompany._id &&
                              comp.subscriptionEnd
                            ) {
                              const newEnd = new Date(comp.subscriptionEnd);
                              newEnd.setDate(newEnd.getDate() + 30);
                              return {
                                ...comp,
                                subscriptionEnd: newEnd.toISOString(),
                                isExpired: false,
                              };
                            }
                            return comp;
                          }),
                        );
                        setShowDetailModal(false);
                        alert("Subscription extended by 30 days");
                      }}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      Extend +30 days
                    </button>
                  )}
                  <button
                    onClick={() => handleResetJobs(selectedCompany._id)}
                    className="px-4 py-2.5 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                    title="Reset job count to 0"
                  >
                    Reset Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
