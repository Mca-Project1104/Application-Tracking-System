import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios.jsx";

// ─── MAIN MODAL COMPONENT ────────────────────────────────────
const CandidateProfileModal = ({
  candidate,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState(false);

  // Schedule state
  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
    type: "technical",
    interviewer: "",
    notes: "",
    location: "",
  });
  const [interviews, setInterviews] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Feedback state
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    round: "screening",
    comment: "",
    recommendation: "",
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  console.log(candidate);

  // Process state
  const [processStages, setProcessStages] = useState([]);

  const token = localStorage.getItem("token");

  const stages = [
    { id: "applied", label: "Applied", icon: "📋" },
    { id: "screening", label: "Screening", icon: "🔍" },
    { id: "shortlisted", label: "Shortlisted", icon: "⭐" },
    { id: "interview", label: "Interview", icon: "🎤" },
    { id: "offer", label: "Offer", icon: "📄" },
    { id: "hired", label: "Hired", icon: "🎉" },
    { id: "rejected", label: "Rejected", icon: "❌" },
  ];

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "process",
      label: "Process",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    },
    {
      id: "interviews",
      label: "Interviews",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
    },
    {
      id: "resume",
      label: "Resume",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
  ];

  useEffect(() => {
    if (isOpen && candidate) {
      setActiveTab("overview");
      setShowScheduleForm(false);
      setShowFeedbackForm(false);
      setScheduleForm({
        date: "",
        time: "",
        type: "technical",
        interviewer: "",
        notes: "",
        location: "",
      });
      setFeedbackForm({
        rating: 0,
        round: "screening",
        comment: "",
        recommendation: "",
      });
      setInterviews([]);
      setFeedbackList([]);
      fetchInterviews();
      fetchFeedback();
    }
  }, [isOpen, candidate]);

  const fetchInterviews = async () => {
    // Placeholder - replace with actual API call
    // try {
    //   const res = await api.get(`/api/interviews?candidateId=${candidate.candidateId}`, { headers: { Authorization: `Bearer ${token}` } });
    //   setInterviews(res.data);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const fetchFeedback = async () => {
    // Placeholder - replace with actual API call
    // try {
    //   const res = await api.get(`/api/feedback?candidateId=${candidate.candidateId}`, { headers: { Authorization: `Bearer ${token}` } });
    //   setFeedbackList(res.data);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const handleDownloadResume = async () => {
    if (!candidate?.resumeUrl) return;
    setDownloadingResume(true);
    try {
      const response = await api.get(
        `/api/applications/resume/${candidate.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${candidate.name.replace(/\s+/g, "_")}_Resume.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: open in new tab if blob download fails
      const baseUrl = api.defaults.baseURL || "";
      window.open(`${baseUrl}/${candidate.resumeUrl}`, "_blank");
    } finally {
      setDownloadingResume(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with actual API call
      // await api.post("/api/interviews/schedule", { ...scheduleForm, candidateId: candidate.candidateId, jobId: candidate.jobId }, { headers: { Authorization: `Bearer ${token}` } });

      const newInterview = {
        id: Date.now().toString(),
        ...scheduleForm,
        status: "scheduled",
        candidateName: candidate.name,
        createdAt: new Date().toISOString(),
      };
      setInterviews([newInterview, ...interviews]);
      setShowScheduleForm(false);
      setScheduleForm({
        date: "",
        time: "",
        type: "technical",
        interviewer: "",
        notes: "",
        location: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with actual API call
      // await api.post("/api/feedback", { ...feedbackForm, candidateId: candidate.candidateId, applicationId: candidate.id }, { headers: { Authorization: `Bearer ${token}` } });

      const newFeedback = {
        id: Date.now().toString(),
        ...feedbackForm,
        reviewer: "Current User",
        createdAt: new Date().toISOString(),
      };
      setFeedbackList([newFeedback, ...feedbackList]);
      setShowFeedbackForm(false);
      setFeedbackForm({
        rating: 0,
        round: "screening",
        comment: "",
        recommendation: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      // Replace with actual API call
      // await api.patch(`/api/applications/${candidate.id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });

      if (onStatusChange) {
        onStatusChange(candidate.id, newStatus);
      }
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStageIndex = () => {
    const status = candidate?.originalStatus || "applied";
    return stages.findIndex((s) => s.id === status);
  };

  const getRatingStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getInterviewTypeColor = (type) => {
    const colors = {
      technical:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      hr: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
      managerial:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      final:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    };
    return colors[type] || colors.technical;
  };

  const getRecommendationColor = (rec) => {
    const colors = {
      strong_yes:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      yes: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
      maybe:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      no: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      strong_no: "bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300",
    };
    return colors[rec] || colors.maybe;
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="absolute inset-0 flex items-start justify-center overflow-y-auto py-4 sm:py-8 px-2 sm:px-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all duration-300 my-auto">
          {/* ─── HEADER ─── */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
            <div className="flex items-start justify-between p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Avatar */}
                <div className="relative">
                  {candidate.avatar ? (
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' className='h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gray-200 dark:bg-gray-700' fill='currentColor' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                      candidate.originalStatus === "hired"
                        ? "bg-green-500"
                        : candidate.originalStatus === "rejected"
                          ? "bg-red-500"
                          : candidate.originalStatus === "offer"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                    }`}
                  ></div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {candidate.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {candidate.position}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        candidate.originalStatus === "hired"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : candidate.originalStatus === "rejected"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            : candidate.originalStatus === "offer"
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {candidate.originalStatus}
                    </span>
                    {candidate.location && candidate.location !== "-" && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {candidate.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadResume}
                  disabled={downloadingResume || !candidate.resumeUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {downloadingResume ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                  <span className="hidden sm:inline">Resume</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 sm:px-6 flex gap-1 overflow-x-auto pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
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
                      d={tab.icon}
                    />
                  </svg>
                  {tab.label}
                  {tab.id === "interviews" && interviews.length > 0 && (
                    <span className="inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                      {interviews.length}
                    </span>
                  )}
                  {tab.id === "feedback" && feedbackList.length > 0 && (
                    <span className="inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                      {feedbackList.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ─── TAB CONTENT ─── */}
          <div className="p-4 sm:p-6">
            {/* ═══ OVERVIEW TAB ═══ */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                      >
                        {typeof skill === "string"
                          ? skill
                          : skill.name || skill}
                      </span>
                    ))}
                    {candidate.skills.length === 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        No skills listed
                      </p>
                    )}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    label="Applied For"
                    value={candidate.position}
                    icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                  <InfoCard
                    label="Application ID"
                    value={candidate.id?.slice(-8)}
                    icon="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                  <InfoCard
                    label="Location"
                    value={candidate.location}
                    icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <InfoCard
                    label="Current Status"
                    value={candidate.originalStatus}
                    icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setActiveTab("process")}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Move Stage
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("interviews")}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg
                          className="w-5 h-5 text-purple-600 dark:text-purple-400"
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
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Schedule
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("feedback")}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg
                          className="w-5 h-5 text-amber-600 dark:text-amber-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Feedback
                      </span>
                    </button>
                    <button
                      onClick={handleDownloadResume}
                      disabled={downloadingResume || !candidate.resumeUrl}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group disabled:opacity-50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg
                          className="w-5 h-5 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Resume
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ PROCESS TAB ═══ */}
            {activeTab === "process" && (
              <div className="space-y-6">
                {/* Stage Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Recruitment Pipeline
                  </h3>
                  <div className="relative">
                    {/* Progress line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    <div
                      className="absolute left-5 top-0 w-0.5 bg-blue-500 transition-all duration-500"
                      style={{
                        height: `${(getCurrentStageIndex() / (stages.length - 1)) * 100}%`,
                      }}
                    ></div>

                    <div className="space-y-1">
                      {stages.map((stage, index) => {
                        const isCompleted =
                          index <= getCurrentStageIndex() &&
                          stage.id !== "rejected";
                        const isCurrent = stage.id === candidate.originalStatus;
                        const isRejected =
                          stage.id === "rejected" &&
                          candidate.originalStatus === "rejected";

                        return (
                          <div
                            key={stage.id}
                            className="relative flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                          >
                            {/* Stage dot */}
                            <div
                              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all shrink-0 ${
                                isCurrent
                                  ? "bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50 scale-110"
                                  : isCompleted
                                    ? "bg-blue-500 text-white"
                                    : isRejected
                                      ? "bg-red-500 text-white"
                                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                              }`}
                            >
                              {isCompleted && !isCurrent && !isRejected ? (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <span className="text-sm">{stage.icon}</span>
                              )}
                            </div>

                            {/* Stage info */}
                            <div className="flex-1 flex items-center justify-between min-w-0">
                              <div>
                                <p
                                  className={`text-sm font-medium ${isCurrent ? "text-blue-600 dark:text-blue-400" : isCompleted ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                                >
                                  {stage.label}
                                </p>
                                {isCurrent && (
                                  <p className="text-xs text-blue-500 dark:text-blue-400">
                                    Current Stage
                                  </p>
                                )}
                              </div>

                              {/* Action buttons */}
                              {stage.id !== "rejected" &&
                                stage.id !== candidate.originalStatus &&
                                index === getCurrentStageIndex() + 1 && (
                                  <button
                                    onClick={() => handleStatusUpdate(stage.id)}
                                    disabled={loading}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all shrink-0"
                                  >
                                    {loading ? (
                                      <svg
                                        className="w-3 h-3 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        ></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        ></path>
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-3 h-3"
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
                                    )}
                                    Move Here
                                  </button>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Status Actions */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.originalStatus !== "rejected" && (
                      <button
                        onClick={() => handleStatusUpdate("rejected")}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-all"
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
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                        Reject Candidate
                      </button>
                    )}
                    {candidate.originalStatus !== "hired" &&
                      candidate.originalStatus !== "rejected" && (
                        <button
                          onClick={() => handleStatusUpdate("offer")}
                          disabled={loading}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-50 transition-all"
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Send Offer
                        </button>
                      )}
                    {(candidate.originalStatus === "offer" ||
                      candidate.originalStatus === "interview") && (
                      <button
                        onClick={() => handleStatusUpdate("hired")}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50 transition-all"
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Mark as Hired
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ INTERVIEWS TAB ═══ */}
            {activeTab === "interviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Scheduled Interviews
                  </h3>
                  <button
                    onClick={() => setShowScheduleForm(!showScheduleForm)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Schedule
                  </button>
                </div>

                {/* Schedule Form */}
                {showScheduleForm && (
                  <form
                    onSubmit={handleScheduleSubmit}
                    className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4"
                  >
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      New Interview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          required
                          value={scheduleForm.date}
                          onChange={(e) =>
                            setScheduleForm({
                              ...scheduleForm,
                              date: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Time
                        </label>
                        <input
                          type="time"
                          required
                          value={scheduleForm.time}
                          onChange={(e) =>
                            setScheduleForm({
                              ...scheduleForm,
                              time: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Type
                        </label>
                        <select
                          value={scheduleForm.type}
                          onChange={(e) =>
                            setScheduleForm({
                              ...scheduleForm,
                              type: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="technical">Technical</option>
                          <option value="hr">HR Round</option>
                          <option value="managerial">Managerial</option>
                          <option value="final">Final Round</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Interviewer
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Interviewer name"
                          value={scheduleForm.interviewer}
                          onChange={(e) =>
                            setScheduleForm({
                              ...scheduleForm,
                              interviewer: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Location / Link
                        </label>
                        <input
                          type="text"
                          placeholder="Meeting link or room number"
                          value={scheduleForm.location}
                          onChange={(e) =>
                            setScheduleForm({
                              ...scheduleForm,
                              location: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Notes
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Additional notes..."
                          value={scheduleForm.notes}
                          onChange={(e) =>
                            setScheduleForm({
                              ...scheduleForm,
                              notes: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowScheduleForm(false)}
                        className="px-4 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all"
                      >
                        {loading ? "Scheduling..." : "Schedule Interview"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Interviews List */}
                {interviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-16 h-16 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm">No interviews scheduled yet</p>
                    <p className="text-xs mt-1">
                      Click "Schedule" to create one
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {interviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                              <svg
                                className="w-5 h-5 text-purple-600 dark:text-purple-400"
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
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                  {interview.type} Round
                                </p>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getInterviewTypeColor(interview.type)}`}
                                >
                                  {interview.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {new Date(interview.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}{" "}
                                at {interview.time}
                              </p>
                              {interview.interviewer && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  with {interview.interviewer}
                                </p>
                              )}
                              {interview.location && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    />
                                  </svg>
                                  {interview.location}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              title="Edit"
                            >
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Cancel"
                            >
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {interview.notes && (
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 pl-13 border-t border-gray-200 dark:border-gray-700 pt-2">
                            {interview.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══ FEEDBACK TAB ═══ */}
            {activeTab === "feedback" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Candidate Feedback
                  </h3>
                  <button
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Feedback
                  </button>
                </div>

                {/* Feedback Form */}
                {showFeedbackForm && (
                  <form
                    onSubmit={handleFeedbackSubmit}
                    className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4"
                  >
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Submit Feedback
                    </h4>

                    {/* Star Rating */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setFeedbackForm({ ...feedbackForm, rating: star })
                            }
                            className="text-2xl transition-transform hover:scale-125"
                          >
                            {star <= feedbackForm.rating ? (
                              <span className="text-amber-400">★</span>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600">
                                ☆
                              </span>
                            )}
                          </button>
                        ))}
                        {feedbackForm.rating > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 self-center ml-2">
                            {feedbackForm.rating}/5
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Round
                        </label>
                        <select
                          value={feedbackForm.round}
                          onChange={(e) =>
                            setFeedbackForm({
                              ...feedbackForm,
                              round: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="screening">Screening</option>
                          <option value="technical">Technical</option>
                          <option value="hr">HR Round</option>
                          <option value="managerial">Managerial</option>
                          <option value="final">Final Round</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Recommendation
                        </label>
                        <select
                          value={feedbackForm.recommendation}
                          onChange={(e) =>
                            setFeedbackForm({
                              ...feedbackForm,
                              recommendation: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select...</option>
                          <option value="strong_yes">Strong Yes</option>
                          <option value="yes">Yes</option>
                          <option value="maybe">Maybe</option>
                          <option value="no">No</option>
                          <option value="strong_no">Strong No</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Comments
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Share your feedback about the candidate..."
                        value={feedbackForm.comment}
                        onChange={(e) =>
                          setFeedbackForm({
                            ...feedbackForm,
                            comment: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowFeedbackForm(false)}
                        className="px-4 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all"
                      >
                        {loading ? "Submitting..." : "Submit Feedback"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Feedback List */}
                {feedbackList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-16 h-16 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <p className="text-sm">No feedback submitted yet</p>
                    <p className="text-xs mt-1">
                      Click "Add Feedback" to start
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {feedbackList.map((fb) => (
                      <div
                        key={fb.id}
                        className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                              <span className="text-amber-500 text-sm font-bold">
                                {fb.rating}/5
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                  {fb.round} Round
                                </p>
                                <span className="text-amber-400 text-sm">
                                  {getRatingStars(fb.rating)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                by {fb.reviewer} ·{" "}
                                {new Date(fb.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          {fb.recommendation && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRecommendationColor(fb.recommendation)}`}
                            >
                              {fb.recommendation.replace("_", " ")}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {fb.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══ RESUME TAB ═══ */}
            {activeTab === "resume" && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                    <svg
                      className="w-10 h-10 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                      <path d="M8 12h8v1.5H8zm0 3h8v1.5H8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Resume Available
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Download or preview the candidate's resume
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadResume}
                      disabled={downloadingResume}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                    >
                      {downloadingResume ? (
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                      Download PDF
                    </button>
                    <button
                      onClick={() => {
                        const baseUrl = api.defaults.baseURL || "";
                        window.open(
                          `${baseUrl}/${candidate.resumeUrl}`,
                          "_blank",
                        );
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Preview
                    </button>
                  </div>
                </div>

                {/* Resume Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      PDF
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      File Format
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {candidate.skills.length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Skills Listed
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ✓
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Resume Uploaded
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── INFO CARD COMPONENT ─────────────────────────────────────
const InfoCard = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
    <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm">
      <svg
        className="w-4 h-4 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={icon}
        />
      </svg>
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white truncate capitalize">
        {value || "-"}
      </p>
    </div>
  </div>
);

export default CandidateProfileModal;
