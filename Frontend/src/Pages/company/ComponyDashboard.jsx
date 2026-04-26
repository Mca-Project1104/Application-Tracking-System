import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAppContext } from "../../context/AppProvider";
import Loading from "../../Components/Loading/Loading";
import { getpipelineColor } from "../../assets/dummydata.js";

const CompanyDashboard = () => {
  const { navigate, token } = useAppContext();
  const [stats, setStats] = useState({});
  const [recentapplications, setRecentApplications] = useState([]);
  const [pipelinestages, setPipelineStages] = useState([]);
  const [jobpostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);

  // New State for Subscription based on your Mongoose Schema
  const [subscription, setSubscription] = useState({
    plan: "FREE",
    status: "ACTIVE",
    endDate: null,
    limits: { maxJobs: 3, activeJobs: 0 },
  });

  const arrstate = Object.entries(stats); // convert into array

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set existing data
        setStats(response?.data?.stats);
        setRecentApplications(response?.data?.recentApplications);
        setPipelineStages(response?.data?.pipeline);
        setJobPostings(response?.data?.jobs);

        if (response?.data?.company) {
          setSubscription(response.data.company.subscription);
          setSubscription((prev) => ({
            ...prev,
            limits: response.data.company.limits,
          }));
        } else if (response?.data?.subscription) {
          setSubscription(response.data.subscription);
        }

        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.log(error?.response?.data?.message);
        setLoading(false);
      }
    };

    if (token) getDetails();
  }, [token]);

  const getSvgIcons = (state) => {
    if (state === "totalApplicants")
      return "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z";
    else if (state === "activeJobs")
      return "M9 6V4h6v2m-9 0h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z";
    else if (state === "shortlisted")
      return "M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z";
    else if (state === "interviewsToday")
      return "M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z";
    else {
      return "";
    }
  };

  // Helper to get color classes based on plan
  const getPlanStyles = (plan) => {
    switch (plan) {
      case "PRO":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "BASIC":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "FREE":
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    }
  };

  // Calculate usage percentage
  const usagePercentage = Math.min(
    (subscription.limits.activeJobs / subscription.limits.maxJobs) * 100,
    100,
  );

  if (loading) {
    return <Loading detail={"Loading data..."} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {arrstate.map(([key, value], index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
                <div className="text-sm capitalize text-center">
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0 bg-green-200 dark:bg-green-200 rounded-lg p-3 transition-all duration-200">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 25 25"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={getSvgIcons(key)}
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* --- NEW SUBSCRIPTION CARD --- */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Subscription & Usage
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Manage your plan and view job posting limits
                </p>
              </div>

              {/* Plan Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${getPlanStyles(
                  subscription.plan,
                )}`}
              >
                {subscription.plan}
              </span>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Status Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        subscription.status === "ACTIVE"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      ● {subscription.status}
                    </span>
                  </div>
                  {subscription.endDate && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Renews:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Usage Bar */}
                <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Job Postings
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subscription.limits.activeJobs} /{" "}
                      {subscription.limits.maxJobs} Used
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${usagePercentage}%` }}
                    ></div>
                  </div>
                  {usagePercentage >= 100 && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      You have reached your job posting limit.  
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                {subscription.plan === "FREE" ? (
                  <button
                    onClick={() => navigate("/pricing")}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    Upgrade Plan
                    <svg
                      className="ml-2 -mr-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/company/billing")}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Manage Subscription
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl hover:shadow-lg transition-all duration-200">
            <div
              onClick={() => navigate("/company/hiring-pipeline")}
              className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Applications
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentapplications.length > 0 ? (
                  recentapplications.map((app) => (
                    <div
                      key={app.id}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-black/10 transition-colors duration-200 cursor-pointer`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="shrink-0">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
                            {app.candidate?.profile_image ? (
                              <img
                                src={app.candidate.profile_image}
                                alt="logo"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {app.candidate?.user_id?.firstName}{" "}
                            {app.candidate?.user_id?.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {app.candidate?.user_id?.email}
                          </p>
                        </div>
                      </div>
                      <div className={`rounded`}>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getpipelineColor(
                            app.status,
                          )}`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    No recent applications
                  </p>
                )}
              </div>

              <div
                className="mt-6"
                onClick={() => navigate("/company/hiring-pipeline")}
              >
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
                {pipelinestages.map((stage, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`${getpipelineColor(
                        stage.name,
                      )} rounded-lg p-3 transition-all duration-200 hover:scale-105 cursor-pointer`}
                    >
                      <p className="text-2xl font-bold">{stage.count}</p>
                      <p className="text-xs mt-1 capitalize">{stage.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                onClick={() => navigate("/company/hiring-pipeline")}
                className="mt-6"
              >
                <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105">
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
              <button
                onClick={() => navigate("/company/post_job")}
                disabled={
                  subscription.limits.activeJobs >=
                    subscription.limits.maxJobs && subscription.plan === "FREE"
                }
                className={`mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 transform hover:scale-105 
                  ${
                    subscription.limits.activeJobs >=
                      subscription.limits.maxJobs &&
                    subscription.plan === "FREE"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
              >
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
                {jobpostings.map((job) => (
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {new Date(job.posted).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/company/jobs/${job.id}`)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3 transition-colors duration-200"
                      >
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
            <button
              onClick={() => navigate("/company/jobs")}
              className="text-sm font-medium cursor-pointer text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              View all job postings <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
