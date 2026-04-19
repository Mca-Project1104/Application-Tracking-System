import React from "react";
import { useAppContext } from "../../context/AppProvider";
import api from "../../api/axios";
import { Link, Navigate } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";
import Header from "../../Components/Header";

const CandidateDashboard = () => {
  const {
    candidate,
    user,
    currency,
    navigate,
    jobs,
    applications,
    candidateLoading,
  } = useAppContext();

  if (candidateLoading || user === null) {
    return <Loading detail={"loading.."} />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="mb-6 mt-2">
        <Header
          title={`Welcome ${user.name} `}
          description={"Here's what's happening with your job search today."}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Resume Score Card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Resume Score
            </h3>
            <div className="mt-5">
              <div className="flex items-center">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {candidate?.ats_score ?? 0}
                </span>
                <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
                  / 100
                </span>
              </div>
              <div className="mt-3">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${candidate?.ats_score ?? 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Strong skills section
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Good work experience
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-yellow-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Consider adding more achievements
                </span>
              </div>
            </div>
            <div className="mt-5">
              <button
                onClick={() => navigate("/candidate/resume_analyzer")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                Improve Resume
              </button>
            </div>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Profile Summary
            </h3>
            <div className="mt-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold overflow-hidden select-none hover:scale-105">
                    <img
                      src={candidate?.profile_image}
                      alt="logo"
                      className="w-full rounded-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="ml-4 min-w-0">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {candidate?.skills?.[0] || "Developer"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {candidate?.personal}
                </p>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                  Top Skills
                </h5>
                <div className="mt-2 flex flex-wrap gap-2">
                  {candidate?.skills?.slice(0, 5).map((skil, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {skil}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <button
                  onClick={() => navigate("/candidate/profile")}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200 mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Applications
          </h3>

          {/* ✅ overflow-x-auto for mobile scroll */}
          <div className="mt-5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {["Position", "Company", "Date Applied", "Status"].map(
                    (item, i) => (
                      <th
                        scope="col"
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {item}
                      </th>
                    ),
                  )}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {applications?.length > 0 ? (
                  applications.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item?.jobId.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item?.jobId.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          {item?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/candidate/application/${item._id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No applications yet. Start applying to jobs!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Link
              to={"/candidate/jobs"}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              View all applications →
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-all duration-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recommended Jobs
          </h3>
          <div className="mt-5 space-y-4">
            {jobs.length > 0 ? (
              jobs.slice(0, 2).map((job, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  {/* ✅ Stack on mobile, row on md+ */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.company.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {job.location}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {job?.skillsRequired?.map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* ✅ On mobile: row with salary and button; on sm+: column */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {currency}
                        {job.salaryMin}k - {currency}
                        {job.salaryMax}k
                      </span>
                      <button
                        onClick={() => navigate(`/candidate/jobs/${job._id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                No recommended jobs at the moment.
              </p>
            )}
          </div>

          <div className="mt-4">
            <Link
              to={"/candidate/jobs"}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              View all recommendations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
