import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/Sidebar.jsx";

import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import CandidateDashboard from "./Pages/candidate/CandidateDashboard.jsx";
import CompanyDashboard from "./Pages/company/ComponyDashboard.jsx";
import JobListings from "./Pages/JobListings.jsx";
import ResumeAnalyzer from "./Pages/candidate/ResumeAnalyzer.jsx";
import HiringPipeline from "./Pages/company/HiringPipeline.jsx";
import CandidateProfile from "./Pages/candidate/CandidateProfile.jsx";
import AdminPanel from "./Pages/admin/AdminPanel.jsx";
import LandinPage from "./Pages/LandinPage.jsx";
import JobPostingForm from "./Components/company/JobPostingForm.jsx";
import VerifyEmail from "./Components/emailComponent/VerifyEmail.jsx";
import NotFound from "./Components/NotFound.jsx";
import AdminProtected from "./Protected/AdminProtected.jsx";
import CompanyProfile from "./Components/company/CompanyProfile.jsx";

import AOS from "aos";
import "aos/dist/aos.css";
import { useAppContext } from "./context/AppProvider.jsx";

// ─── MOVE OUTSIDE App: prevents re-creation on every render ───

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ userRole, role, children }) => {
  return userRole === role ? children : <Navigate to="/" />;
};

const Layout = React.memo(
  ({
    children,
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
        titleName="Hire Flow"
      />
      <div className="flex">
        {userRole !== "admin" && (
          <Sidebar
            userRole={userRole}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
          />
        )}
        <div
          className={`flex-1 pt-8 transition-all duration-300 ${
            showSidebar && userRole !== "admin" ? "lg:ml-64" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </>
  ),
);

const ThemeToggle = React.memo(({ theme, setTheme }) => (
  <button
    type="button"
    onClick={() => setTheme(theme === "true" ? "false" : "true")}
    className="fixed bottom-4 right-4 p-3 z-50 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
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

// ─── Main App ───

function App() {
  const location = useLocation();
  const { theme, setTheme, navigate } = useAppContext();

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicPaths = ["/", "/login", "/register", "/verify-email"];
  }, []); // empty dependency — run once on mount

  // AOS init
  useEffect(() => {
    AOS.init({
      duration: 1200,
      delay: 100,
      once: false,
    });
  }, []);

  const handleSetIsAuthenticated = useCallback((val) => {
    setIsAuthenticated(val);
  }, []);

  const handleSetUserRole = useCallback((val) => {
    setUserRole(val);
  }, []);

  const handleSetShowSidebar = useCallback((val) => {
    setShowSidebar(val);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white">
      {/* Theme Toggle */}
      {location.pathname !== "/" && (
        <ThemeToggle theme={theme} setTheme={setTheme} />
      )}

      <Routes>
        {/* ─── Public Routes ─── */}
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
            <Route path="/verify-email" element={<VerifyEmail />} />
          </>
        )}

        {/* ─── Authenticated Routes ─── */}
        {isAuthenticated && (
          <>
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

            {/* Candidate */}
            <Route
              path="/candidate"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="candidate">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <CandidateDashboard />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/candidate/profile"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="candidate">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <CandidateProfile />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/candidate/jobs"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="candidate">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <JobListings />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/candidate/jobs/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="candidate">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <JobListings />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/candidate/resume_analyzer"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="candidate">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <ResumeAnalyzer />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* Company */}
            <Route
              path="/company"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="company">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <CompanyDashboard />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/jobs"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="company">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <JobListings />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/jobs/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="company">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <JobListings />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/post_job"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="company">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <JobPostingForm />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/profile"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="company">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <CompanyProfile />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/hiring-pipeline"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RoleRoute userRole={userRole} role="company">
                    <Layout
                      userRole={userRole}
                      showSidebar={showSidebar}
                      setShowSidebar={handleSetShowSidebar}
                      setIsAuthenticated={handleSetIsAuthenticated}
                      setUserRole={handleSetUserRole}
                    >
                      <HiringPipeline />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
            {/* Admin */}
            <Route element={<AdminProtected userRole={userRole} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
