import React, { useState } from "react";
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

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data for charts
  const applicationTrendsData = [
    { month: "Jan", applications: 400, interviews: 240, hires: 120 },
    { month: "Feb", applications: 300, interviews: 139, hires: 80 },
    { month: "Mar", applications: 500, interviews: 380, hires: 200 },
    { month: "Apr", applications: 278, interviews: 190, hires: 100 },
    { month: "May", applications: 489, interviews: 280, hires: 150 },
    { month: "Jun", applications: 539, interviews: 390, hires: 180 },
  ];

  const jobCategoriesData = [
    { name: "Engineering", value: 35, color: "#3B82F6" },
    { name: "Design", value: 20, color: "#8B5CF6" },
    { name: "Marketing", value: 15, color: "#10B981" },
    { name: "Sales", value: 20, color: "#F59E0B" },
    { name: "HR", value: 10, color: "#EF4444" },
  ];

  const monthlyApplicationsData = [
    { month: "Jan", candidates: 65, recruiters: 28 },
    { month: "Feb", candidates: 59, recruiters: 28 },
    { month: "Mar", candidates: 80, recruiters: 38 },
    { month: "Apr", candidates: 81, recruiters: 48 },
    { month: "May", candidates: 56, recruiters: 38 },
    { month: "Jun", candidates: 95, recruiters: 43 },
  ];

  const navigation = [
    {
      name: "Dashboard",
      id: "dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "Settings",
      id: "settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
    {
      name: "Users",
      id: "users",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      name: "Reports",
      id: "reports",
      icon: "M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m3-2h6",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out`}
        >
          {/* <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <h1
              className={`text-xl font-semibold text-gray-800 dark:text-white ${!sidebarOpen && "hidden"}`}
            >
              TalentTrack
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div> */}
          <nav className="mt-15 px-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${
                    activeTab === item.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  } group flex items-center px-2  py-2 text-sm font-medium rounded-md w-full transition-colors duration-150`}
                >
                  <svg
                    className={`${sidebarOpen ? "mr-3" : "mx-auto"} h-5 w-5`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={item.icon}
                    ></path>
                  </svg>
                  {sidebarOpen && item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          {/* <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "settings"
                    ? "Settings"
                    : activeTab === "users"
                      ? "User Management"
                      : "Reports"}
              </h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                  </svg>
                </button>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  A
                </div>
              </div>
            </div>
          </header> */}

          {/* Main Content Area */}
          <main className="flex-1 bg-gray-100 mt-10 dark:bg-gray-900 p-6 overflow-y-auto transition-colors duration-200">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            ></path>
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Total Users
                            </dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                              10,284
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
                      <div className="text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +12%
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          from last month
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="shrink-0 bg-green-100 dark:bg-green-900/30 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Active Jobs
                            </dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                              847
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
                      <div className="text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +8%
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          from last month
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-all duration-200">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="shrink-0 bg-yellow-100 dark:bg-yellow-900/30 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Total Applications
                            </dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                              5,432
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
                      <div className="text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +15%
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          from last month
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all duration-200">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Avg. Time to Hire
                            </dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                              24 days
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
                      <div className="text-sm">
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          -5%
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          from last month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Trends Line Chart */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Application Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={applicationTrendsData}>
                      <CartesianGrid strokeDasharray="3 10" stroke="gray" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                        }}
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
                  {/* Job Categories Pie Chart */}
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Top Job Categories
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

                  {/* Monthly User Registrations Bar Chart */}
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Monthly User Registrations
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthlyApplicationsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                          }}
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

                {/* User Activity Stats */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    User Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Daily Active Users
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                        324
                      </div>
                      <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                        +5.2% from yesterday
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Weekly Active Users
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                        856
                      </div>
                      <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                        +8.1% from last week
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Monthly Active Users
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                        1,245
                      </div>
                      <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                        +12% from last month
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        New Users This Month
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                        142
                      </div>
                      <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                        +18% growth rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  System Settings
                </h2>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      General Settings
                    </h3>
                    <div className="mt-5 space-y-6">
                      <div>
                        <label
                          htmlFor="site-name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Site Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="site-name"
                            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                            defaultValue="TalentTrack"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="site-description"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Site Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="site-description"
                            rows={3}
                            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                            defaultValue="A modern applicant tracking system for streamlining your hiring process."
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Contact Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            id="contact-email"
                            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                            defaultValue="support@talenttrack.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Notifications
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id="new-application"
                              name="new-application"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label
                              htmlFor="new-application"
                              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                            >
                              Notify on new job applications
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="new-user"
                              name="new-user"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label
                              htmlFor="new-user"
                              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                            >
                              Notify on new user registration
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="system-updates"
                              name="system-updates"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                            />
                            <label
                              htmlFor="system-updates"
                              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                            >
                              Notify on system updates
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Security Settings
                    </h3>
                    <div className="mt-5 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Password Policy
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id="min-length"
                              name="min-length"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label
                              htmlFor="min-length"
                              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                            >
                              Require minimum password length of 8 characters
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="special-chars"
                              name="special-chars"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                              defaultChecked
                            />
                            <label
                              htmlFor="special-chars"
                              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                            >
                              Require special characters
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="password-expiry"
                              name="password-expiry"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                            />
                            <label
                              htmlFor="password-expiry"
                              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                            >
                              Require password change every 90 days
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="session-timeout"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Session Timeout (minutes)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="session-timeout"
                            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                            defaultValue="30"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    User Management
                  </h2>
                  <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                    Add New User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          John Doe
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          john.doe@example.com
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          Admin
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                            Delete
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          Jane Smith
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          jane.smith@example.com
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          Recruiter
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                            Delete
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          Bob Johnson
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          bob.johnson@example.com
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          Candidate
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Reports
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      Hiring Report
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Comprehensive report on hiring metrics and trends
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                      Generate Report
                    </button>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      User Activity Report
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Detailed analysis of user engagement and activity
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                      Generate Report
                    </button>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      Job Performance Report
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Insights on job posting performance and effectiveness
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                      Generate Report
                    </button>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      Time to Hire Analysis
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Analysis of hiring cycle times and bottlenecks
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                      Generate Report
                    </button>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      Source Effectiveness
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Evaluation of candidate sources and channels
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                      Generate Report
                    </button>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      Diversity Metrics
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Reports on diversity and inclusion in hiring
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
