import React, { useState, useMemo, useEffect } from "react";
import CandidateProfileModal from "./CandidateProfileModal.jsx";
import Loading from "../../Components/Loading/Loading.jsx";
import api from "../../api/axios.jsx";

const HiringPipeline = () => {
  const [candidates, setCandidates] = useState([]);
  const [draggedCandidate, setDraggedCandidate] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [stats, setStats] = useState({});

  const [recentApplications, setRecentApplications] = useState([]);
  const [pipelinestages, setPipelineStages] = useState([]);
  const [profileModal, setProfileModal] = useState({
    open: false,
    candidate: null,
  });
  const [jobpostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);

  //  NEW: Job filter state
  const [selectedJobId, setSelectedJobId] = useState("all");
  const [jobFilterOpen, setJobFilterOpen] = useState(false);

  const token = localStorage.getItem("token");

  const mapStatusToColumn = (status) => {
    const statusMap = {
      applied: "applied",
      screening: "applied",
      shortlisted: "shortlisted",
      interview: "interview",
      offer: "selected",
      hired: "selected",
      rejected: "rejected",
    };
    return statusMap[status] || "applied";
  };

  const mapColumnToStatus = (columnId) => {
    const reverseMap = {
      applied: "applied",
      shortlisted: "shortlisted",
      interview: "interview",
      selected: "offer",
      rejected: "rejected",
    };
    return reverseMap[columnId] || columnId;
  };

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response);

        if (response.status === 200) {
          const data = response.data;
          setStats(data.stats || {});
          setRecentApplications(data.recentApplications || []);
          setPipelineStages(data.pipeline || []);
          setJobPostings(data.jobs || []);

          const transformedCandidates = (data.recentApplications || []).map(
            (app) => {
              const candidate = app.candidate || {};
              const user = candidate.user_id || {};
              const normalizedImage = candidate.profile_image
                ? candidate.profile_image.replace(/\\/g, "/")
                : "";

              return {
                id: app.id,
                name:
                  `${user.firstName} ${user.lastName}` || "Unknown Candidate",
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
            },
          );

          setCandidates(transformedCandidates);
        }
      } catch (error) {
        console.log(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) getDetails();
  }, [token]);

  //  NEW: Filter candidates by selected job
  const filteredCandidates = useMemo(() => {
    if (selectedJobId === "all") return candidates;
    return candidates.filter((c) => c.jobId === selectedJobId);
  }, [candidates, selectedJobId]);

  //  NEW: Get selected job details
  const selectedJob = useMemo(() => {
    if (selectedJobId === "all") return null;
    return jobpostings.find((j) => j.id === selectedJobId);
  }, [selectedJobId, jobpostings]);

  //  NEW: Count applicants per job
  const jobApplicantCounts = useMemo(() => {
    const counts = {};
    candidates.forEach((c) => {
      counts[c.jobId] = (counts[c.jobId] || 0) + 1;
    });
    return counts;
  }, [candidates]);

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
          c.id === draggedCandidate.id
            ? { ...c, status, originalStatus: mapColumnToStatus(status) }
            : c,
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

  //  Use filteredCandidates instead of candidates
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
    <div className="w-380 bg-gray-50 dark:bg-gray-900 transition-colors mt-2 duration-200">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeJobs || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Active Jobs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 dark:bg-green-900/20">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalApplicants || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Applicants
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.shortlisted || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Shortlisted
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.interviewsToday || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Interviews Today
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ⭐⭐⭐ JOB FILTER SECTION ⭐⭐⭐ */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
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

            {/* Selected job info */}
            {selectedJob && (
              <div className="flex items-center gap-2 text-xs sm:text-sm">
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

          {/* Job pills / tabs */}
          <div className="mt-3 flex flex-wrap gap-2">
            {/* All Jobs pill */}
            <button
              onClick={() => setSelectedJobId("all")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
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

            {/* Individual job pills */}
            {jobpostings.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
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
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                )}
              </button>
            ))}
          </div>

          {/* Active filter indicator bar */}
          {selectedJobId !== "all" && (
            <div className="mt-3 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                <span className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                  Showing candidates for{" "}
                  <strong>{selectedJob?.position}</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedJobId("all")}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
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

        {/* ⭐ Pipeline Columns - uses filteredCandidates */}
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-6">
          {columns.map((column) => {
            const config = getStatusConfig(column.id);
            // ⭐ Filter by selected job
            const columnCandidates = filteredCandidates.filter(
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
                  <div
                    className={`${config.headerBg} px-3 sm:px-4 py-2 sm:py-3`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white text-sm sm:text-base">
                        {column.title}
                      </h3>
                      <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 text-white text-xs sm:text-sm font-medium">
                        {columnCandidates.length}
                      </span>
                    </div>
                  </div>

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
                                {candidate.avatar ? (
                                  <img
                                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                                    src={`http://localhost:8000/${candidate.profile_image}`}
                                    alt={candidate.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200 dark:bg-gray-700' fill='currentColor' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                                    }}
                                  />
                                ) : (
                                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                                    <svg
                                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                  </div>
                                )}
                                <div
                                  className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 ${config.bg} rounded-full border-2 border-white dark:border-gray-800`}
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
                              {candidate.score || 0}
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
                                    {typeof skill === "string"
                                      ? skill
                                      : skill.name || skill}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setProfileModal({
                                  open: true,
                                  candidate: candidate,
                                });
                              }}
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

        {/* Job Postings Table */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 mt-4 sm:mt-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Job Postings
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Click a row to filter pipeline
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
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
                  <th className="pb-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {jobpostings.map((job) => (
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
                            className={`text-sm font-medium ${selectedJobId === job.id ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}`}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics - uses filteredCandidates */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 mt-4 sm:mt-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Pipeline Overview
            </h2>
            {selectedJobId !== "all" && (
              <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-medium">
                {selectedJob?.position}
              </span>
            )}
          </div>
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
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${filteredCandidates.length > 0 ? (filteredCandidates.filter((c) => c.status === "selected").length / filteredCandidates.length) * 100 : 0}%`,
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
          // Update local state when status changes from modal
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
