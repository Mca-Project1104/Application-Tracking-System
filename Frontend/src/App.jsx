import React, { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useAppContext } from "./context/AppProvider.jsx";
import { Toaster } from "react-hot-toast";
import "aos/dist/aos.css";
import AOS from "aos";

import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import LandinPage from "./Pages/LandinPage.jsx";
import Loading from "./Components/Loading/Loading.jsx";

import NotFound from "./Components/NotFound.jsx";
const JobListings = lazy(() => import("./Pages/JobListings.jsx"));
const Pricing = lazy(() => import("./Pages/company/Pricing.jsx"));
const AdminPanel = lazy(() => import("./Pages/admin/AdminPanel.jsx"));
const AdminProtected = lazy(() => import("./Protected/AdminProtected.jsx"));
const HiringPipeline = lazy(() => import("./Pages/company/HiringPipeline.jsx"));

const CandidateDashboard = lazy(
  () => import("./Pages/candidate/CandidateDashboard.jsx"),
);
const CompanyDashboard = lazy(
  () => import("./Pages/company/ComponyDashboard.jsx"),
);
const ResumeAnalyzer = lazy(
  () => import("./Pages/candidate/ResumeAnalyzer.jsx"),
);
const CandidateProfile = lazy(
  () => import("./Pages/candidate/CandidateProfile.jsx"),
);
const JobPostingForm = lazy(
  () => import("./Components/company/JobPostingForm.jsx"),
);
const VerifyEmail = lazy(
  () => import("./Components/emailComponent/VerifyEmail.jsx"),
);
const CompanyProfile = lazy(
  () => import("./Components/company/CompanyProfile.jsx"),
);
const ApplicationDetails = lazy(
  () => import("./Pages/candidate/ApplicationDetail.jsx"),
);
const BillingSuccess = lazy(
  () => import("./Components/Strip/BillingSuccess.jsx"),
);
const BillingCancel = lazy(
  () => import("./Components/Strip/BillingCancle.jsx"),
);
import HistoryApplication from "./Pages/candidate/HistoryApplication.jsx";
import UserDetailPage from "./Pages/admin/UserDetailPage.jsx";

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ userRole, role, children }) => {
  return userRole === role ? children : <Navigate to="/" replace />;
};

const Layout = React.memo(
  ({
    userRole,
    showSidebar,
    setShowSidebar,
    setIsAuthenticated,
    setUserRole,
  }) => (
    <>
      <Navbar
        userRole={userRole}
        setShowSidebar={setShowSidebar}
        showSidebar={showSidebar}
        setIsAuthenticated={setIsAuthenticated}
        setUserRole={setUserRole}
      />
      <div className="flex pt-16 min-h-screen">
        {userRole !== "admin" && (
          <Sidebar
            userRole={userRole}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
          />
        )}
        <main
          className={`flex-1 min-w-0 ${userRole !== "admin" ? "md:ml-64" : ""}`}
        >
          <Outlet />
        </main>
      </div>
    </>
  ),
);

const ThemeToggle = React.memo(({ theme, setTheme }) => (
  <button
    type="button"
    onClick={() => setTheme(theme === "true" ? "false" : "true")}
    className="fixed bottom-4 hidden md:block  left-4 p-3 z-50 rounded-full active:scale-95  bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600  transition-all duration-200"
  >
    {theme === "false" ? (
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
          d="M20.354 15.354A9 9 0 118.646 3.646 9.003 9.003 0 0020.354 15.354z"
        />
      </svg>
    ) : (
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
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    )}
  </button>
));

function App() {
  const location = useLocation();
  const { theme, setTheme, navigate, token } = useAppContext();

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") || !!localStorage.getItem("admin_token"),
  );

  const [userRole, setUserRole] = useState(() => {
    if (localStorage.getItem("admin_token")) return "admin";
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accountType || null;
  });

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "true") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  AOS.init({
    duration: 1200,
    delay: 100,
  });

  const handleSetIsAuthenticated = useCallback((val) => {
    setIsAuthenticated(val);
  }, []);

  const handleSetUserRole = useCallback((val) => {
    setUserRole(val);
  }, []);

  const handleSetShowSidebar = useCallback((val) => {
    setShowSidebar(val);
  }, []);

  //dynamically page scroll depending upon location path
  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  }, [location.pathname]);

  return (
    <div className="relative w-full bg-white dark:bg-gray-900 dark:text-white text-black">
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <Loading />
          </div>
        }
      >
        {isAuthenticated && <ThemeToggle theme={theme} setTheme={setTheme} />}
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {!isAuthenticated && (
            <>
              <Route path="/" element={<LandinPage />} />
              <Route
                path="/login"
                element={
                  <Login
                    setIsAuthenticated={handleSetIsAuthenticated}
                    setUserRole={handleSetUserRole}
                  />
                }
              />
              <Route path="/register" element={<Register />} />
              <Route
                path="/verify-email"
                element={
                  <VerifyEmail
                    setIsAuthenticated={setIsAuthenticated}
                    setUserRole={setUserRole}
                  />
                }
              />
            </>
          )}

          {isAuthenticated && (
            <>
              <Route path="*" element={<NotFound />} />
              <Route
                path="/"
                element={
                  userRole === "candidate" ? (
                    <Navigate to="/candidate" />
                  ) : userRole === "company" ? (
                    <Navigate to="/company" />
                  ) : userRole === "admin" ? (
                    <Navigate to="/admin" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <RoleRoute userRole={userRole} role="candidate">
                      <Layout
                        userRole={userRole}
                        showSidebar={showSidebar}
                        setShowSidebar={handleSetShowSidebar}
                        setIsAuthenticated={handleSetIsAuthenticated}
                        setUserRole={handleSetUserRole}
                      />
                    </RoleRoute>
                  </PrivateRoute>
                }
              >
                <Route path="/candidate" element={<CandidateDashboard />} />
                <Route
                  path="/candidate/profile"
                  element={<CandidateProfile />}
                />
                <Route path="/candidate/jobs" element={<JobListings />} />
                <Route path="/candidate/jobs/:id" element={<JobListings />} />
                <Route
                  path="/candidate/resume_analyzer"
                  element={<ResumeAnalyzer />}
                />
                <Route
                  path="/candidate/application/:id"
                  element={<ApplicationDetails />}
                />
                <Route
                  path="/candidate/history"
                  element={<HistoryApplication />}
                />
              </Route>

              {/* Recruiter Routes */}
              <Route
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <RoleRoute userRole={userRole} role="company">
                      <Layout
                        userRole={userRole}
                        showSidebar={showSidebar}
                        setShowSidebar={handleSetShowSidebar}
                        setIsAuthenticated={handleSetIsAuthenticated}
                        setUserRole={handleSetUserRole}
                      />
                    </RoleRoute>
                  </PrivateRoute>
                }
              >
                <Route path="/company" element={<CompanyDashboard />} />
                <Route path="/company/jobs/:id?" element={<JobListings />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/billing/success" element={<BillingSuccess />} />
                <Route path="/billing/cancel" element={<BillingCancel />} />
                <Route
                  path="/company/post_job/:jobId?"
                  element={<JobPostingForm />}
                />
                <Route path="/company/profile" element={<CompanyProfile />} />
                <Route
                  path="/company/hiring-pipeline"
                  element={<HiringPipeline />}
                />
              </Route>

              {/* Admin */}
              <Route element={<AdminProtected userRole={userRole} />}>
                <Route
                  path="/admin"
                  element={
                    <AdminPanel
                      setUserRole={setUserRole}
                      setIsAuthenticated={handleSetIsAuthenticated}
                    />
                  }
                />
                <Route path="/admin/:id" element={<UserDetailPage />} />
              </Route>
            </>
          )}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
