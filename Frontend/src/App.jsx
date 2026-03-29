import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
// import { useAppContext } from "./context/AppProvider.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("company"); // 'candidate' or  'company' or  'admin'
  const [showSidebar, setShowSidebar] = useState(false);
  const [titleName, setTitleName] = useState("ATS TRAKING"); //dynamically change based on the login
  const [theme, setTheme] = useState();

  // const { name } = useAppContext(); //globally access props
  // console.log(name);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
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

  useEffect(() => {
    setUserRole("company");
  }, [userRole]);

  useEffect(() => {
    setUserRole("company");
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen  bg-gray-50 dark:bg-black dark:text-white">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-3 z-999 right-2 lg:right-20 p-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
      >
        {theme == "dark" ? (
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
      {/* ..landing page */}
      {!isAuthenticated && <LandinPage />}
      {isAuthenticated && (
        <>
          <Navbar
            userRole={userRole}
            setShowSidebar={setShowSidebar}
            showSidebar={showSidebar}
            titleName={titleName}
            setIsAuthenticated={setIsAuthenticated}
          />
          <div className="flex">
            {showSidebar && <Sidebar userRole={userRole} />}
            <div
              className={`flex-1 p-6 ${showSidebar ? "ml-64" : ""} dark:bg-black min-h-screen transition-all duration-300`}
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
                <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
                <Route path="/hiring-pipeline" element={<HiringPipeline />} />
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
      )}
      {!isAuthenticated && (
        <Routes>
          <Route
            path="/"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setUserRole={setUserRole}
              />
            }
          />
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
        </Routes>
      )}
    </div>
  );
}

export default App;
