import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import RoleSelection from "./Pages/RoleSelection.jsx";
import CandidateDashboard from "./Pages/CandidateDashboard.jsx";
import CompanyDashboard from "./Pages/ComponyDashboard.jsx";
import JobListings from "./Pages/JobListings.jsx";
import ResumeAnalyzer from "./Pages/ResumeAnalyzer.jsx";
import HiringPipeline from "./Pages/HiringPipeline.jsx";
import CandidateProfile from "./Pages/CandidateProfile.jsx";
import ChatSystem from "./Pages/ChatSystem.jsx";
import AdminPanel from "./Pages/AdminPanel.jsx";
import LandinPage from "./Components/LandinPage.jsx";
import JobPostingForm from "./Components/JobPostingForm.jsx";
import socket from "./services/socket.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token"),
  );
  const [userRole, setUserRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accountType || null;
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const titleName = "ATS TRACKING";
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  // const { user } = useAppContext();

  useEffect(() => {
    // ✅ connect socket once
    if (!socket.connected) {
      socket.connect();
    }

    // ✅ listen events
    socket.on("newCandidate", (data) => {
      console.log("newCandidate event:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
    });

    // ✅ cleanup listeners (VERY IMPORTANT)
    return () => {
      socket.off("newCandidate");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      style={{ fontFamily: "Arimo, sans-serif" }}
      className="min-h-screen  bg-gray-50 dark:bg-black dark:text-white"
    >
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="fixed bottom-4 right-4 p-3 z-999 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        {theme === "light" ? (
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
            ></path>
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
              d="M20.354 15.354A9 9 0 118.646 3.646 9.003 9.003 0 0020.354 15.354z"
            ></path>
          </svg>
        )}
      </button>

      <Routes>
        {!isAuthenticated ? (
          <>
            {/* Public Routes */}
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
            <Route
              path="/role-selection"
              element={<RoleSelection setUserRole={setUserRole} />}
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {/* Protected Layout */}
            <Route
              path="*"
              element={
                <>
                  <Navbar
                    userRole={userRole}
                    setShowSidebar={setShowSidebar}
                    showSidebar={showSidebar}
                    titleName={titleName}
                    setIsAuthenticated={setIsAuthenticated}
                    setUserRole={setUserRole}
                  />
                  <div className="flex">
                    {userRole !== "admin" && (
                      <Sidebar
                        userRole={userRole}
                        setShowSidebar={setShowSidebar}
                        showSidebar={showSidebar}
                      />
                    )}

                    <div
                      className={`flex-1 w-full p-6  pb-0 pt-8 transition-all duration-300 ease-in-out ${
                        showSidebar ? "lg:ml-64" : "lg:ml-0"
                      } dark:bg-black min-h-screen`}
                    >
                      <Routes>
                        <Route
                          path="/"
                          element={
                            userRole === "candidate" ? (
                              <Navigate to="/candidate-dashboard" />
                            ) : (
                              <Navigate to="/company-dashboard" />
                            )
                          }
                        />
                        <Route
                          path="/candidate-dashboard"
                          element={<CandidateDashboard />}
                        />
                        <Route
                          path="/company-dashboard"
                          element={<CompanyDashboard />}
                        />
                        <Route path="/jobs" element={<JobListings />} />
                        <Route
                          path="/resume-analyzer"
                          element={<ResumeAnalyzer />}
                        />
                        <Route
                          path="/hiring-pipeline"
                          element={<HiringPipeline />}
                        />
                        <Route
                          path="/candidate-profile/:id"
                          element={<CandidateProfile />}
                        />
                        <Route path="/post-job" element={<JobPostingForm />} />
                        <Route path="/chat" element={<ChatSystem />} />
                        <Route path="/admin" element={<AdminPanel />} />
                      </Routes>
                    </div>
                  </div>
                </>
              }
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
