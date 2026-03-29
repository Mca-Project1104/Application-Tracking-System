import React, { useState } from "react";
import { users, jobs } from "../assets/dummydata";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminPanel = ({ name }) => {
  const [activeTab, setActiveTab] = useState("users");

  //manage this backeddata fetch from backed
  // const[applicationTrendsData, setapplicationTrendsData] = useState();
  // const[jobCategoriesData, setjobCategoriesData] = useState();
  // const[monthlyApplicationsData, setmonthlyApplicationsData] = useState();

  const handlerDeleteUser = (name) => {
    //perform in backed data delete and then alert
    alert(`User deleted Successfully : ${name}`);
  };

  // Sample data for application trends chart dummydata replace with the fetch data
  const applicationTrendsData = [
    { month: "Jan", applications: 450, hires: 45, interviews: 120 },
    { month: "Feb", applications: 520, hires: 52, interviews: 145 },
    { month: "Mar", applications: 480, hires: 48, interviews: 135 },
    { month: "Apr", applications: 610, hires: 61, interviews: 168 },
    { month: "May", applications: 590, hires: 59, interviews: 162 },
    { month: "Jun", applications: 680, hires: 68, interviews: 185 },
  ];

  // Sample data for job categories pie chart
  const jobCategoriesData = [
    { name: "Engineering", value: 42, color: "#3B82F6" },
    { name: "Design", value: 28, color: "#10B981" },
    { name: "Marketing", value: 18, color: "#F59E0B" },
    { name: "Sales", value: 12, color: "#8B5CF6" },
  ];

  // Sample data for monthly applications bar chart
  const monthlyApplicationsData = [
    { month: "Jan", candidates: 320, recruiters: 130 },
    { month: "Feb", candidates: 380, recruiters: 140 },
    { month: "Mar", candidates: 350, recruiters: 130 },
    { month: "Apr", candidates: 450, recruiters: 160 },
    { month: "May", candidates: 430, recruiters: 160 },
    { month: "Jun", candidates: 500, recruiters: 180 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Paused":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Candidate":
        return "bg-blue-100 text-blue-800";
      case "Recruiter":
        return "bg-purple-100 text-purple-800";
      case "Admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white mt-15 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Anuj Dalvadi</h1>
        <p className="mt-1 text-gray-600">
          Manage users, jobs, and system settings
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {["users", "jobs", "analytics", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "users" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  User Management
                </h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg
                    className="mr-2 -ml-1 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    ></path>
                  </svg>
                  Add User
                </button>
              </div>

              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Join Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </a>
                          <a
                            onClick={() => handlerDeleteUser(user.name)}
                            href="#"
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Job Management
                </h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg
                    className="mr-2 -ml-1 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Post New Job
                </button>
              </div>

              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Job
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Posted By
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Applicants
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Posted Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {job.company}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.postedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.applicants}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.postedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </a>
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </a>
                          <a
                            href="#"
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">
                Analytics Dashboard
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="shrink-0 bg-blue-100 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Users
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            1,245
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">+12%</span>
                      <span className="text-gray-500"> from last month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="shrink-0 bg-green-100 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-green-600"
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
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Jobs
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            387
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">+8%</span>
                      <span className="text-gray-500"> from last month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="shrink-0 bg-yellow-100 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-yellow-600"
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
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Applications
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            5,432
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">+15%</span>
                      <span className="text-gray-500"> from last month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="shrink-0 bg-purple-100 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-purple-600"
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
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Avg. Time to Hire
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            24 days
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <span className="text-red-600 font-medium">-5%</span>
                      <span className="text-gray-500"> from last month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Trends Line Chart */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Application Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={applicationTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Applications"
                    />
                    <Line
                      type="monotone"
                      dataKey="interviews"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Interviews"
                    />
                    <Line
                      type="monotone"
                      dataKey="hires"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      name="Hires"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Job Categories Pie Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly User Registrations Bar Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Monthly User Registrations
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyApplicationsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
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
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  User Activity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500">
                      Daily Active Users
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-gray-900">
                      324
                    </div>
                    <div className="mt-1 text-sm text-green-600">
                      +5.2% from yesterday
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500">
                      Weekly Active Users
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-gray-900">
                      856
                    </div>
                    <div className="mt-1 text-sm text-green-600">
                      +8.1% from last week
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500">
                      Monthly Active Users
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-gray-900">
                      1,245
                    </div>
                    <div className="mt-1 text-sm text-green-600">
                      +12% from last month
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500">
                      New Users This Month
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-gray-900">
                      142
                    </div>
                    <div className="mt-1 text-sm text-green-600">
                      +18% growth rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">
                System Settings
              </h2>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    General Settings
                  </h3>
                  <div className="mt-5 space-y-6">
                    <div>
                      <label
                        htmlFor="site-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Site Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="site-name"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue="TalentTrack"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="site-description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Site Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="site-description"
                          rows={3}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue="A modern applicant tracking system for streamlining your hiring process."
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="contact-email"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue="support@talenttrack.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Notifications
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="new-application"
                            name="new-application"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label
                            htmlFor="new-application"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Notify on new job applications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="new-user"
                            name="new-user"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label
                            htmlFor="new-user"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Notify on new user registration
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="system-updates"
                            name="system-updates"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="system-updates"
                            className="ml-2 block text-sm text-gray-900"
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
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Security Settings
                  </h3>
                  <div className="mt-5 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Policy
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="min-length"
                            name="min-length"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label
                            htmlFor="min-length"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Require minimum password length of 8 characters
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="special-chars"
                            name="special-chars"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label
                            htmlFor="special-chars"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Require special characters
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="password-expiry"
                            name="password-expiry"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="password-expiry"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Require password change every 90 days
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="session-timeout"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Session Timeout (minutes)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="session-timeout"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue="30"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
