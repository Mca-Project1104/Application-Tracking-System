import React from "react";
import { useAppContext } from "../context/AppProvider";

const CompanyDashboard = () => {
  const { navigate } = useAppContext();

  const stats = [
    {
      id: 1,
      name: "Total Applicants",
      value: "247",
      change: "+12%",
      changeType: "increase",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      darkBgColor: "dark:bg-blue-900/20",
    },
    {
      id: 2,
      name: "Active Jobs",
      value: "8",
      change: "+2",
      changeType: "increase",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      ),
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      darkBgColor: "dark:bg-green-900/20",
    },
    {
      id: 3,
      name: "Shortlisted",
      value: "42",
      change: "+8",
      changeType: "increase",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      darkBgColor: "dark:bg-yellow-900/20",
    },
    {
      id: 4,
      name: "Interviews Today",
      value: "5",
      change: "View schedule",
      changeType: "link",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      darkBgColor: "dark:bg-purple-900/20",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      name: "John Doe",
      position: "Senior Frontend Developer",
      status: "New",
      statusColor:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      initials: "JD",
      avatarColor: "bg-blue-500",
    },
    {
      id: 2,
      name: "Alice Smith",
      position: "UI/UX Designer",
      status: "Reviewing",
      statusColor:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      initials: "AS",
      avatarColor: "bg-green-500",
    },
    {
      id: 3,
      name: "Robert Johnson",
      position: "Backend Developer",
      status: "Shortlisted",
      statusColor:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      initials: "RJ",
      avatarColor: "bg-purple-500",
    },
  ];

  const pipelineStages = [
    {
      name: "Applied",
      count: 24,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      name: "Screening",
      count: 12,
      color:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    {
      name: "Interview",
      count: 8,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      name: "Selected",
      count: 4,
      color:
        "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      name: "Rejected",
      count: 15,
      color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    },
  ];

  const jobPostings = [
    {
      id: 1,
      position: "Senior Frontend Developer",
      department: "Engineering",
      applicants: 42,
      status: "Active",
      statusColor:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      posted: "Jun 1, 2023",
    },
    {
      id: 2,
      position: "Product Manager",
      department: "Product",
      applicants: 28,
      status: "Active",
      statusColor:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      posted: "May 28, 2023",
    },
    {
      id: 3,
      position: "UI/UX Designer",
      department: "Design",
      applicants: 35,
      status: "Paused",
      statusColor:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      posted: "May 15, 2023",
    },
  ];

  return (
    <div className="min-h-screen mt-2 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 mb-6 transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Welcome back! Here's an overview of your hiring activity
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Quick Action
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div
                    className={`shrink-0 ${stat.bgColor} ${stat.darkBgColor} rounded-lg p-3 transition-all duration-200`}
                  >
                    <svg
                      className={`h-6 w-6 ${stat.iconColor}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {stat.icon}
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
                <div className="text-sm">
                  {stat.changeType === "link" ? (
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      {stat.change}
                    </a>
                  ) : (
                    <>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {stat.change}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        from last month
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl hover:shadow-lg transition-all duration-200">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Applications
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0">
                        <div
                          className={`h-10 w-10 rounded-full ${app.avatarColor} flex items-center justify-center text-white text-sm font-semibold`}
                        >
                          {app.initials}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {app.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {app.position}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.statusColor}`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200">
                  View all applications
                </button>
              </div>
            </div>
          </div>

          {/* Hiring Pipeline */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl hover:shadow-lg transition-all duration-200">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Hiring Pipeline
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                {pipelineStages.map((stage, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`${stage.color} rounded-lg p-3 transition-all duration-200 hover:scale-105 cursor-pointer`}
                    >
                      <p className="text-2xl font-bold">{stage.count}</p>
                      <p className="text-xs mt-1">{stage.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/company/hiring-pipeline")}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                >
                  Manage Pipeline
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Postings Table */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl hover:shadow-lg transition-all duration-200">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Job Postings Overview
              </h3>
              <button className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Post New Job
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Position
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Applicants
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Posted
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {jobPostings.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {job.position}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">
                        {job.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {job.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {job.applicants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.statusColor}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {job.posted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3 transition-colors duration-200">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
              View all job postings →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
