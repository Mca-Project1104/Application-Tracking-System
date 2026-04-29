import React, { useState, useMemo, useEffect } from "react";
import CandidateProfileModal from "./CandidateProfileModal.jsx";
import Loading from "../../Components/Loading/Loading.jsx";
import api from "../../api/axios.jsx";
import { useAppContext } from "../../context/AppProvider.jsx";

const HiringPipeline = () => {
  const [candidates, setCandidates] = useState([]);
  const [draggedCandidate, setDraggedCandidate] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [stats, setStats] = useState({});
  const [resumeanalysis, setResumeAnalysis] = useState({});

  const [recentApplications, setRecentApplications] = useState([]);
  const [pipelinestages, setPipelineStages] = useState([]);
  const [profileModal, setProfileModal] = useState({
    open: false,
    candidate: null,
  });
  const [jobpostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedJobId, setSelectedJobId] = useState("all");
  const [jobFilterOpen, setJobFilterOpen] = useState(false);

  const { token } = useAppContext();

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

  console.log(recentApplications)

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
      <div className=" sm:px-4 md:px-6 lg:px-4 py-1 p-2 sm:py-4 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-4 mb-4 sm:mb-4 transition-all duration-200 hover:shadow-md">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 shrink-0">
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
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 dark:bg-green-900/20 shrink-0">
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
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 shrink-0">
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
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 shrink-0">
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

        {/* Job Filter Section */}
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

          {/* ✅ Job pills — scrollable on mobile instead of wrapping */}
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
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                  selectedJobId === "all"
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                }`}
              >
                {candidates.length}
              </span>
            </button>

            {jobpostings.map((job) => (
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
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
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
            ))}
          </div>

          {/* Active filter indicator */}
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

        {/* ✅ Pipeline Columns — scroll-snap for mobile kanban */}
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
                className="shrink-0 w-[280px] sm:w-72 md:w-80 snap-start"
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
                      <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 text-white text-xs sm:text-sm font-medium">
                        {columnCandidates.length}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 min-h-[200px] bg-gray-50 dark:bg-gray-900/50 flex-1 overflow-y-auto">
                    {columnCandidates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-[180px] text-gray-400 dark:text-gray-500">
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 mb-2"
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
                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                              <div className="relative shrink-0">
                                {candidate.avatar ? (
                                  <img
                                    className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                                    src={candidate.profile_image}
                                    alt={candidate.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "flex";
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
                                <div
                                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 ${config.bg} rounded-full border-2 border-white dark:border-gray-800`}
                                ></div>
                              </div>
                              <div className="min-w-0">
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
                      colSpan={4}
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

        {/* Pipeline Statistics */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 sm:p-6 mt-4 sm:mt-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Pipeline Overview
            </h2>
            {selectedJobId !== "all" && (
              <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-medium truncate max-w-[150px]">
                {selectedJob?.position}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {statistics.map((stat) => {
              const config = getStatusConfig(stat.id);
              return (
                <div key={stat.id} className="text-center">
                  {/* ✅ hover:scale-[0.98] instead of invalid hover:scale-98 */}
                  <div
                    className={`relative inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full ${config.bg} mb-2 sm:mb-3 transition-transform duration-200 hover:scale-[0.98]`}
                  >
                    <span className="text-lg sm:text-2xl font-bold text-white">
                      {stat.count}
                    </span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 dark:text-gray-400">
                        {stat.percentage}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {stat.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
              {/* ✅ bg-gradient-to-r instead of bg-linear-to-r */}
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
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
