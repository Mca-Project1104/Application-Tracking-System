import React, { useEffect, useState } from "react";
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
import ChatSystem from "./Pages/ChatSystem.jsx";
import AdminPanel from "./Pages/AdminPanel.jsx";
import LandinPage from "./Components/LandinPage.jsx";
import JobPostingForm from "./Components/company/JobPostingForm.jsx";
import VerifyEmail from "./Components/emailComponent/VerifyEmail.jsx";
import NotFound from "./Components/NotFound.jsx";
import CompanyProfile from "./Components/company/CompanyProfile.jsx";
import toast, { Toaster } from "react-hot-toast";

import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );

  const [userRole, setUserRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accountType || null;
  });

  const [showSidebar, setShowSidebar] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  // AOS init
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  // Theme toggle
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "true") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔐 Protect routes
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  // 🎭 Role-based protection
  const RoleRoute = ({ children, role }) => {
    return userRole === role ? children : <Navigate to="/" />;
  };

  // 🎨 Layout wrapper
  const Layout = ({ children }) => (
    <>
      <Toaster position="top-center" reverseOrder={true} />

      <Navbar
        userRole={userRole}
        setShowSidebar={setShowSidebar}
        showSidebar={showSidebar}
        setIsAuthenticated={setIsAuthenticated}
        setUserRole={setUserRole}
        titleName="Hire Flow" //Change a Navbar left title name
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
  );

  console.log(userRole);

  // // Handle theme toggle with preventDefault
  // const handleThemeToggle = () => {
  //   setTheme(!theme);
  // };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Theme Toggle */}
      {location.pathname !== "/" && (
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
              xmlns="http://www.w3.org/2000/svg"
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
              xmlns="http://www.w3.org/2000/svg"
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
      )}

      <Routes>
        {!isAuthenticated && (
          <>
            <Route path="/" element={<LandinPage />} />
            <Route
              path="/login"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setUserRole={setUserRole}
                />
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}

        {isAuthenticated && (
          <>
            <Route
              path="/*"
              element={
                userRole === "candidate" ? (
                  <Navigate to="/candidate" />
                ) : userRole === "company" ? (
                  <Navigate to="/company" />
                ) : (
                  <Navigate to="/admin" />
                )
              }
            />

            {/* Candidate */}
            <Route
              path="/candidate"
              element={
                <PrivateRoute>
                  <RoleRoute role="candidate">
                    <Layout>
                      <CandidateDashboard />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/candidate/profile"
              element={
                <PrivateRoute>
                  <RoleRoute role="candidate">
                    <Layout>
                      <CandidateProfile />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/candidate/jobs"
              element={
                <PrivateRoute>
                  <RoleRoute role="candidate">
                    <Layout>
                      <JobListings />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/candidate/resume_analyzer"
              element={
                <PrivateRoute>
                  <RoleRoute role="candidate">
                    <Layout>
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
                <PrivateRoute>
                  <RoleRoute role="company">
                    <Layout>
                      <CompanyDashboard />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/jobs"
              element={
                <PrivateRoute>
                  <RoleRoute role="company">
                    <Layout>
                      <JobListings />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/company/jobs/:id"
              element={
                <PrivateRoute>
                  <RoleRoute role="company">
                    <Layout>
                      <JobListings />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/post_job"
              element={
                <PrivateRoute>
                  <RoleRoute role="company">
                    <Layout>
                      <JobPostingForm />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/profile"
              element={
                <PrivateRoute>
                  <RoleRoute role="company">
                    <Layout>
                      <CompanyProfile />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="/company/hiring-pipeline"
              element={
                <PrivateRoute>
                  <RoleRoute role="company">
                    <Layout>
                      <HiringPipeline />
                    </Layout>
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* Admin */}

            {/* Shared */}
            <Route
              path={`${userRole}/chat`}
              element={
                <PrivateRoute>
                  <Layout>
                    <ChatSystem />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </>
        )}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <RoleRoute role="admin">
                <Layout>
                  <AdminPanel />
                </Layout>
              </RoleRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
