import React, { useState, useMemo } from "react";
import { candidate } from "../../assets/dummydata.js";

const HiringPipeline = () => {
  const [candidates, setCandidates] = useState(candidate);
  const [draggedCandidate, setDraggedCandidate] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (candidate) => {
    setDraggedCandidate(candidate);
  };

  const handleDragEnd = () => {
    setDraggedCandidate(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedCandidate && draggedCandidate.status !== status) {
      setCandidates(
        candidates.map((c) =>
          c.id === draggedCandidate.id ? { ...c, status } : c,
        ),
      );
    }
    setDraggedCandidate(null);
    setDragOverColumn(null);
  };

  const getStatusConfig = (status) => {
    const configs = {
      applied: {
        bg: "bg-blue-500",
        lightBg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        headerBg: "bg-gradient-to-r from-blue-500 to-blue-600",
      },
      shortlisted: {
        bg: "bg-amber-500",
        lightBg: "bg-amber-50 dark:bg-amber-900/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
        headerBg: "bg-gradient-to-r from-amber-500 to-amber-600",
      },
      interview: {
        bg: "bg-purple-400",
        lightBg: "bg-purple-50 dark:bg-purple-200/20",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-600",
        headerBg: "bg-gradient-to-r from-purple-500 to-purple-600",
      },
      selected: {
        bg: "bg-green-500",
        lightBg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        headerBg: "bg-gradient-to-r from-green-500 to-green-600",
      },
      rejected: {
        bg: "bg-red-500",
        lightBg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        headerBg: "bg-gradient-to-r from-red-500 to-red-600",
      },
    };
    return configs[status] || configs.applied;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 90)
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
    if (score >= 80)
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
    if (score >= 70)
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400";
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
  };

  const columns = [
    { id: "applied", title: "Applied" },
    { id: "shortlisted", title: "Shortlisted" },
    { id: "interview", title: "Interview" },
    { id: "selected", title: "Selected" },
    { id: "rejected", title: "Rejected" },
  ];

  const statistics = useMemo(() => {
    return columns.map((column) => {
      const count = candidates.filter((c) => c.status === column.id).length;
      const percentage =
        candidates.length > 0
          ? Math.round((count / candidates.length) * 100)
          : 0;
      return { ...column, count, percentage };
    });
  }, [candidates]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 transition-colors mt-2 duration-200">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Hiring Pipeline
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Track and manage candidates through the hiring process
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                <svg
                  className="mr-1 sm:mr-2 -ml-1 h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="hidden sm:inline">Filter</span>
                <span className="sm:hidden">F</span>
              </button>
              <button className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105">
                <svg
                  className="mr-1 sm:mr-2 -ml-1 h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="hidden sm:inline">Add Candidate</span>
                <span className="sm:hidden">+</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Columns */}
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-6">
          {columns.map((column) => {
            const config = getStatusConfig(column.id);
            const columnCandidates = candidates.filter(
              (candidate) => candidate.status === column.id,
            );
            const isDragOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                className="shrink-0 w-64 sm:w-72 md:w-80"
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                    isDragOver
                      ? "ring-2 ring-blue-500 shadow-lg transform "
                      : ""
                  }`}
                >
                  {/* Column Header */}
                  <div
                    className={`${config.headerBg} px-3 sm:px-4 py-2 sm:py-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white text-sm sm:text-base">
                          {column.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 text-white text-xs sm:text-sm font-medium">
                        {columnCandidates.length}
                      </span>
                    </div>
                  </div>

                  {/* Candidates List */}
                  <div className="p-2 sm:p-4 space-y-2 sm:space-y-3 min-h-100 bg-gray-50 dark:bg-gray-900/50">
                    {columnCandidates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-24 sm:h-32 text-gray-400 dark:text-gray-500">
                        <svg
                          className="w-8 h-8 sm:w-12 sm:h-12 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-xs sm:text-sm">No candidates yet</p>
                      </div>
                    ) : (
                      columnCandidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          draggable
                          onDragStart={() => handleDragStart(candidate)}
                          onDragEnd={handleDragEnd}
                          className={`bg-white dark:bg-gray-800 border ${config.border} rounded-lg p-3 sm:p-4 cursor-move hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${
                            draggedCandidate?.id === candidate.id
                              ? "opacity-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="relative">
                                <img
                                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                                  src={candidate.avatar}
                                  alt={candidate.name}
                                />
                                <div
                                  className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 ${config.bg} rounded-full border-2 border-white dark:border-gray-800}`}
                                ></div>
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                  {candidate.name}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {candidate.position}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-bold ${getScoreBadgeColor(candidate.score)}`}
                            >
                              {candidate.score}
                            </span>
                          </div>

                          <div className="mb-2 sm:mb-3">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium ${config.lightBg} ${config.text}`}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {candidate.skills.length > 3 && (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  +{candidate.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700">
                            <button
                              className={`text-xs sm:text-sm font-medium ${config.text} hover:underline transition-colors duration-200`}
                            >
                              View Profile
                            </button>
                            <button className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                              Schedule
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 mt-4 sm:mt-6 transition-all duration-200 hover:shadow-md">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Pipeline Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {statistics.map((stat) => {
              const config = getStatusConfig(stat.id);
              return (
                <div key={stat.id} className="text-center">
                  <div
                    className={`relative inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full ${config.bg} mb-2 sm:mb-3 transition-transform duration-200 hover:scale-98`}
                  >
                    <span className="text-lg sm:text-2xl font-bold text-white">
                      {stat.count}
                    </span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                        {stat.percentage}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {stat.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.count} candidate{stat.count !== 1 ? "s" : ""}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 sm:mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Progress
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {candidates.filter((c) => c.status === "selected").length} /{" "}
                {candidates.length} hired
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${candidates.length > 0 ? (candidates.filter((c) => c.status === "selected").length / candidates.length) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringPipeline;
