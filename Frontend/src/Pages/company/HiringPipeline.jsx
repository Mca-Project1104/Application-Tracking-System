import React, { useState, useMemo, useEffect } from "react";
import CandidateProfileModal from "./CandidateProfileModal.jsx";
import Loading from "../../Components/Loading/Loading.jsx";
import { getStatusConfig } from "../../assets/dummydata.js";
import { useAppContext } from "../../context/AppProvider.jsx";

const HiringPipeline = () => {
  const [candidates, setCandidates] = useState([]);
  const [draggedCandidate, setDraggedCandidate] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [resumeanalysis, setResumeAnalysis] = useState({});
  const [profileModal, setProfileModal] = useState({
    open: false,
    candidate: null,
  });

  const [selectedJobId, setSelectedJobId] = useState("all");
  const [jobFilterOpen, setJobFilterOpen] = useState(false);

  const {
    token,
    setRecentApplications,
    recentapplications,
    stats,
    setStats,
    pipelinestages,
    setPipelineStages,
    jobpostings,
    loading,
    refetchDashboard: fetchCompanyDashbord,
  } = useAppContext();

  const mapStatusToColumn = (status) => {
    const statusMap = {
      applied: "applied",
      screening: "applied",
      shortlisted: "shortlisted",
      interview: "interview",
      offer: "shortlisted",
      hired: "selected",
      rejected: "rejected",
    };
    return statusMap[status] || "applied";
  };

  const mapColumnToStatus = (columnId) => {
    const reverseMap = {
      applied: "applied",
      shortlisted: "shortlisted",
      offer: "shortlisted",
      interview: "interview",
      selected: "offer",
      rejected: "rejected",
    };
    return reverseMap[columnId] || columnId;
  };

  useEffect(() => {
    const transformedCandidates = (recentapplications || []).map((app) => {
      const candidate = app.candidate || {};
      const user = candidate.user_id || {};
      const normalizedImage = candidate.profile_image
        ? candidate.profile_image.replace(/\\/g, "/")
        : "";

      return {
        id: app.id,
        name: `${user.firstName} ${user.lastName}` || "Unknown Candidate",
        avatar: normalizedImage,
        position: app.position || "Unknown Position",
        score: app.score || 0,
        skills: candidate.skills || [],
        status: mapStatusToColumn(app.status),
        resumeUrl: app.resumeUrl || "",
        profile_image: candidate.profile_image,
        location: candidate.location || "-",
        originalStatus: app.status,
        jobId: app.jobId,
        candidateId: candidate._id,
      };
    });

    setCandidates(transformedCandidates);
  }, []);

  const filteredCandidates = useMemo(() => {
    if (selectedJobId === "all") return candidates;
    return candidates.filter((c) => c.jobId === selectedJobId);
  }, [candidates, selectedJobId]);

  const selectedJob = useMemo(() => {
    if (selectedJobId === "all") return null;
    return jobpostings.find((j) => j.id === selectedJobId);
  }, [selectedJobId, jobpostings]);

  const jobApplicantCounts = useMemo(() => {
    const counts = {};
    candidates.forEach((c) => {
      counts[c.jobId] = (counts[c.jobId] || 0) + 1;
    });
    return counts;
  }, [candidates]);

  const handleDragStart = (candidate) => {
    if (
      candidate.originalStatus === "hired" ||
      candidate.originalStatus === "rejected"
    ) {
      return;
    }
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
          c.id === draggedCandidate.id
            ? { ...c, status, originalStatus: mapColumnToStatus(status) }
            : c,
        ),
      );
    }
    setDraggedCandidate(null);
    setDragOverColumn(null);
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 90)
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
    if (score >= 80)
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
    if (score >= 70)
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400";
    return "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
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
      const count = filteredCandidates.filter(
        (c) => c.status === column.id,
      ).length;
      const percentage =
        filteredCandidates.length > 0
          ? Math.round((count / filteredCandidates.length) * 100)
          : 0;
      return { ...column, count, percentage };
    });
  }, [filteredCandidates]);

  if (loading) {
    return <Loading detail={"Loading pipeline data..."} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="sm:px-4 md:px-6 lg:px-4 py-1 p-2 sm:py-4 max-w-full overflow-x-hidden">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-5 mb-4 sm:mb-4 transition-all duration-200 hover:shadow-md">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                ),
                value: stats.activeJobs || 0,
                label: "Active Jobs",
                bg: "bg-blue-50 dark:bg-blue-900/20",
                iconColor: "text-blue-600 dark:text-blue-400",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                ),
                value: stats.totalApplicants || 0,
                label: "Total Applicants",
                bg: "bg-green-50 dark:bg-green-900/20",
                iconColor: "text-green-600 dark:text-green-400",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ),
                value: stats.shortlisted || 0,
                label: "Shortlisted",
                bg: "bg-amber-50 dark:bg-amber-900/20",
                iconColor: "text-amber-600 dark:text-amber-400",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                ),
                value: stats.interviewsToday || 0,
                label: "Interviews Today",
                bg: "bg-purple-50 dark:bg-purple-900/20",
                iconColor: "text-purple-600 dark:text-purple-400",
              },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bg} shrink-0`}
                >
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {stat.icon}
                  </svg>
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Filter */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Select Job
              </h3>
            </div>

            {selectedJob && (
              <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                    selectedJob.status === "Open"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {selectedJob.status}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {selectedJob.department}
                </span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {jobApplicantCounts[selectedJob.id] || 0} applicant
                  {(jobApplicantCounts[selectedJob.id] || 0) !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-1 px-1">
            <button
              onClick={() => setSelectedJobId("all")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                selectedJobId === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              All Jobs
              <span
                className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold ${
                  selectedJobId === "all"
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                }`}
              >
                {candidates.length}
              </span>
            </button>

            {jobpostings.map(
              (job) =>
                job.status === "Open" && (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                      selectedJobId === job.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {job.position}
                    <span
                      className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold ${
                        selectedJobId === job.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {jobApplicantCounts[job.id] || 0}
                    </span>
                    {job.status === "Closed" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                    )}
                  </button>
                ),
            )}
          </div>

          {selectedJobId !== "all" && (
            <div className="mt-3 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0"
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
                <span className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 truncate">
                  Showing candidates for{" "}
                  <strong>{selectedJob?.position}</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedJobId("all")}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors shrink-0 ml-2"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Pipeline Columns */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-thin">
          {columns.map((column) => {
            const config = getStatusConfig(column.id);
            const columnCandidates = filteredCandidates.filter(
              (candidate) => candidate.status === column.id,
            );
            const isDragOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                className="shrink-0 w-70 sm:w-72 md:w-80 snap-start"
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-200 h-full flex flex-col ${
                    isDragOver ? "ring-2 ring-blue-500 shadow-lg" : ""
                  }`}
                >
                  {/* Column Header */}
                  <div
                    className={`${config.headerBg} px-3 sm:px-4 py-2.5 sm:py-3 shrink-0`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white text-sm sm:text-base">
                        {column.title}
                      </h3>
                      <span className="inline-flex items-center justify-center min-w-6 h-6 sm:min-w-8 sm:h-8 px-2 rounded-full bg-white/20 text-white text-xs sm:text-sm font-medium">
                        {columnCandidates.length}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 min-h-50 bg-gray-50 dark:bg-gray-900/50 flex-1 overflow-y-auto">
                    {columnCandidates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-45 text-gray-400 dark:text-gray-500">
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
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
                          className={`bg-white dark:bg-gray-800 border ${config.border} rounded-lg p-3 sm:p-4 cursor-move hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 active:scale-[0.98] ${
                            draggedCandidate?.id === candidate.id
                              ? "opacity-50 scale-95"
                              : ""
                          }`}
                        >
                          {/* Candidate Header */}
                          <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                              <div className="relative shrink-0">
                                {candidate.avatar ? (
                                  <img
                                    className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                                    src={candidate.profile_image}
                                    alt={candidate.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = "none";
                                      if (e.target.nextSibling) {
                                        e.target.nextSibling.style.display =
                                          "flex";
                                      }
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700 ${
                                    candidate.avatar ? "hidden" : "flex"
                                  }`}
                                >
                                  <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                                    {candidate.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {candidate.name}
                                </h4>
                                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                                  {candidate.position}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-bold shrink-0 ml-1 ${getScoreBadgeColor(candidate.score)}`}
                            >
                              {candidate.score || 0}
                            </span>
                          </div>

                          {/* Skills */}
                          <div className="mb-2 sm:mb-3">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium ${config.lightBg} ${config.text}`}
                                  >
                                    {typeof skill === "string"
                                      ? skill
                                      : skill.name || skill}
                                  </span>
                                ))}
                              {candidate.skills.length > 3 && (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  +{candidate.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setProfileModal({
                                  open: true,
                                  candidate: candidate,
                                });
                              }}
                              className={`text-[10px] sm:text-xs font-medium ${config.text} hover:underline transition-colors duration-200`}
                            >
                              View Profile
                            </button>
                            <button className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
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

        {/* Job Postings Table */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 mt-4 sm:mt-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Job Postings
            </h2>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Click a row to filter pipeline
            </span>
          </div>
          <div className="overflow-x-auto p-2 -mx-4 sm:mx-0">
            <table className="w-full text-left min-w-125">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="pb-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Department
                  </th>
                  <th className="pb-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                    Applicants
                  </th>
                  <th className="pb-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                    Opening
                  </th>
                  <th className="pb-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {jobpostings.length > 0 ? (
                  jobpostings.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      className={`cursor-pointer transition-colors duration-150 ${
                        selectedJobId === job.id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <td className="py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                          {selectedJobId === job.id && (
                            <svg
                              className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                selectedJobId === job.id
                                  ? "text-blue-700 dark:text-blue-300"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {job.position}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                              {job.department}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                        {job.department}
                      </td>
                      <td className="py-3 sm:py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {job.applicants}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {job.opening}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            job.status === "Open"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No job postings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pipeline Overview — FIXED: removed absolute positioning */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 mt-4 sm:mt-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Pipeline Overview
            </h2>
            {selectedJobId !== "all" && (
              <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-medium truncate max-w-40">
                {selectedJob?.position}
              </span>
            )}
          </div>

          {/* Horizontal pipeline flow */}
          <div className="relative">
            {/* Connector line behind circles */}
            <div className="hidden sm:block absolute top-8 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-0 relative z-10">
              {statistics.map((stat, idx) => {
                const config = getStatusConfig(stat.id);
                return (
                  <div
                    key={stat.id}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Circle with count — no absolute badge */}
                    <div
                      className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full ${config.bg} mb-2 shadow-sm transition-transform duration-200 hover:scale-105`}
                    >
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {stat.count}
                      </span>
                    </div>

                    {/* Percentage shown inline below circle */}
                    <span className="inline-flex items-center justify-center mb-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {stat.percentage}%
                    </span>

                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {stat.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {stat.count} candidate{stat.count !== 1 ? "s" : ""}
                    </p>

                    {/* Arrow between stages on desktop */}
                    {idx < statistics.length - 1 && (
                      <div className="hidden sm:flex items-center justify-center mt-3 text-gray-300 dark:text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 sm:mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Progress
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {
                  filteredCandidates.filter((c) => c.status === "selected")
                    .length
                }{" "}
                / {filteredCandidates.length} hired
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${
                    filteredCandidates.length > 0
                      ? (filteredCandidates.filter(
                          (c) => c.status === "selected",
                        ).length /
                          filteredCandidates.length) *
                        100
                      : 0
                  }%`,
                  background: "linear-gradient(to right, #3b82f6, #22c55e)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <CandidateProfileModal
        candidate={profileModal.candidate}
        isOpen={profileModal.open}
        onClose={() => setProfileModal({ open: false, candidate: null })}
        onStatusChange={(candidateId, newStatus) => {
          const mappedStatus = mapStatusToColumn(newStatus);
          setCandidates((prev) =>
            prev.map((c) =>
              c.id === candidateId
                ? { ...c, status: mappedStatus, originalStatus: newStatus }
                : c,
            ),
          );
        }}
      />
    </div>
  );
};

export default HiringPipeline;
