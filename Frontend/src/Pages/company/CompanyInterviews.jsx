import React, { useState, useEffect, useMemo } from "react";
import api from "../../api/axios.jsx";
import { useAppContext } from "../../context/AppProvider.jsx";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Briefcase,
  Search,
  Video,
  Copy,
  ExternalLink,
  Download,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  MicrosoftLogo,
  MicrosoftTeamsLogo,
  ZoomLogo,
  GoogleMeetLogo,
  PlatformBadge,
  PlatformIcon,
} from "../../Components/common/MeetingPlatformIcons.jsx";
import CandidateProfileModal from "./CandidateProfileModal.jsx";
import RadialAtsScore from "../../Components/common/RadialAtsScore.jsx";

const CompanyInterviews = () => {
  const { token, navigate, recentapplications } = useAppContext();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/applications/company/interviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.interviews) {
        setInterviews(res.data.interviews);
      }
    } catch {
      // Fallback to recentapplications from AppContext
      const fallback = (recentapplications || []).filter(
        (app) =>
          app.status === "interview" ||
          (app.scheduleForm && app.scheduleForm.date)
      );
      setInterviews(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInterviews();
    }
  }, [token]);

  // Normalizer helper for an interview application item
  const normalizedInterviews = useMemo(() => {
    return (interviews || []).map((item) => {
      const sForm = item.scheduleForm || (Array.isArray(item.details) ? item.details[0] : item.details) || {};
      const loc = sForm.location || "";
      const isTeams =
        sForm.platform === "teams" ||
        loc.includes("teams.microsoft.com") ||
        loc.includes("teams.live.com");
      const isZoom = sForm.platform === "zoom" || loc.includes("zoom.");
      const isMeet = sForm.platform === "meet" || loc.includes("meet.google.");
      const platform = isTeams
        ? "teams"
        : isZoom
        ? "zoom"
        : isMeet
        ? "meet"
        : sForm.platform || "custom";

      const candidateUser = item.candidateId?.user_id || {};
      const candidateName =
        [candidateUser.firstName, candidateUser.lastName]
          .filter(Boolean)
          .join(" ") ||
        item.candidate?.user_id?.firstName ||
        "Candidate";

      const candidateEmail =
        candidateUser.email || item.candidate?.user_id?.email || item.candidateId?.email || "";
      const candidatePhone =
        item.candidateId?.phone || item.candidate?.phone || "+91 -";

      return {
        id: item._id || item.id,
        rawApplication: item,
        candidateId: item.candidateId?._id || item.candidate?._id,
        candidateName,
        candidateEmail,
        candidatePhone,
        profileImage: candidateUser.profile_image || item.candidateId?.profile_image,
        jobTitle: item.jobId?.title || item.position || "Job Position",
        department: item.jobId?.department || "Engineering",
        score: item.score || 0,
        matchedSkills: item.resume_Analyse?.matched_skills || [],
        scheduleForm: sForm,
        platform,
        location: loc,
        date: sForm.date || "",
        time: sForm.time || "",
        roundType: sForm.type || "technical",
        interviewer: sForm.interviewer || "Hiring Team",
        interviewerEmail: sForm.interviewerEmail || "",
        notes: sForm.notes || "",
        status: item.status || "interview",
      };
    });
  }, [interviews]);

  // Counts for KPI Header
  const kpiStats = useMemo(() => {
    const total = normalizedInterviews.length;
    const teams = normalizedInterviews.filter((i) => i.platform === "teams").length;
    const zoom = normalizedInterviews.filter((i) => i.platform === "zoom").length;
    const meet = normalizedInterviews.filter((i) => i.platform === "meet").length;
    const todayStr = new Date().toISOString().split("T")[0];
    const today = normalizedInterviews.filter((i) => i.date === todayStr).length;

    return { total, teams, zoom, meet, today };
  }, [normalizedInterviews]);

  // Filtered Interviews
  const filteredInterviews = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    return normalizedInterviews.filter((item) => {
      // Platform filter
      if (platformFilter !== "all" && item.platform !== platformFilter) {
        return false;
      }

      // Date filter
      if (dateFilter === "today" && item.date !== todayStr) return false;
      if (dateFilter === "upcoming" && item.date < todayStr) return false;
      if (dateFilter === "past" && item.date >= todayStr) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.candidateName.toLowerCase().includes(q);
        const matchesEmail = item.candidateEmail.toLowerCase().includes(q);
        const matchesJob = item.jobTitle.toLowerCase().includes(q);
        const matchesInterviewer = item.interviewer.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesJob && !matchesInterviewer) {
          return false;
        }
      }

      return true;
    });
  }, [normalizedInterviews, platformFilter, dateFilter, searchQuery]);

  const handleOpenCandidateModal = (interview) => {
    const modalPayload = {
      id: interview.id,
      _id: interview.id,
      name: interview.candidateName,
      email: interview.candidateEmail,
      phone: interview.candidatePhone,
      position: interview.jobTitle,
      score: interview.score,
      resumeUrl: interview.rawApplication?.resumeUrl,
      resume_Analyse: interview.rawApplication?.resume_Analyse,
      status: interview.status,
      candidate: interview.rawApplication?.candidateId || interview.rawApplication?.candidate,
    };
    setSelectedCandidate(modalPayload);
    setIsModalOpen(true);
  };

  const downloadIcsForInterview = (item) => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//HireFlow//Interview Scheduler//EN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:interview-${item.id}@hireflow.com`,
      `SUMMARY:${item.jobTitle} Interview with ${item.candidateName}`,
      `DESCRIPTION:Round: ${item.roundType}\\nInterviewer: ${item.interviewer}\\nLocation: ${item.location}\\nNotes: ${item.notes}`,
      `LOCATION:${item.location}`,
      `ORGANIZER;CN=HireFlow ATS:mailto:${item.interviewerEmail || "no-reply@hireflow.com"}`,
      `ATTENDEE;CN=${item.candidateName}:mailto:${item.candidateEmail}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `interview-${item.candidateName.toLowerCase().replace(/\s+/g, "-")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Calendar invite (.ics) downloaded!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Scheduled Interviews
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {kpiStats.total} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, launch, and track all live Microsoft Teams, Zoom, and Google Meet online candidate interviews.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchInterviews}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition shadow-2xs"
            title="Refresh interviews"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/company/hiring-pipeline")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Hiring Pipeline
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Microsoft Teams</span>
            <MicrosoftTeamsLogo className="w-5 h-5 shrink-0" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {kpiStats.teams}
          </div>
          <p className="text-[11px] text-[#5B5FC7] font-medium mt-1">Teams Video Calls</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Zoom</span>
            <ZoomLogo className="w-5 h-5 shrink-0" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {kpiStats.zoom}
          </div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">Zoom Meetings</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Google Meet</span>
            <GoogleMeetLogo className="w-5 h-5 shrink-0" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {kpiStats.meet}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Google Workspace</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Today's Schedule</span>
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {kpiStats.today}
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">Interviews Today</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Platform Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setPlatformFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                platformFilter === "all"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Platforms ({kpiStats.total})
            </button>
            <button
              onClick={() => setPlatformFilter("teams")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                platformFilter === "teams"
                  ? "bg-[#5B5FC7] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <MicrosoftTeamsLogo className="w-4 h-4 shrink-0" />
              <span>Microsoft Teams ({kpiStats.teams})</span>
            </button>
            <button
              onClick={() => setPlatformFilter("zoom")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                platformFilter === "zoom"
                  ? "bg-[#2D8CFF] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <ZoomLogo className="w-4 h-4 shrink-0" />
              <span>Zoom ({kpiStats.zoom})</span>
            </button>
            <button
              onClick={() => setPlatformFilter("meet")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                platformFilter === "meet"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <GoogleMeetLogo className="w-4 h-4 shrink-0" />
              <span>Google Meet ({kpiStats.meet})</span>
            </button>
          </div>

          {/* Date Filter Segment */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
            {["all", "today", "upcoming", "past"].map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  dateFilter === df
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {df}
              </button>
            ))}
          </div>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search interviews by candidate name, email, job title, or interviewer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Main Interviews List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Video className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Scheduled Interviews Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery || platformFilter !== "all" || dateFilter !== "all"
              ? "No interviews match your current search or filter criteria. Try clearing filters."
              : "You haven't scheduled any candidate interviews yet. Move candidates to the interview stage in your Hiring Pipeline."}
          </p>
          <div className="pt-2 flex justify-center gap-2">
            {(searchQuery || platformFilter !== "all" || dateFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPlatformFilter("all");
                  setDateFilter("all");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => navigate("/company/hiring-pipeline")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
            >
              Go to Hiring Pipeline
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInterviews.map((item) => {
            const isUrl =
              item.location.startsWith("http://") ||
              item.location.startsWith("https://");
            const meetingHref = isUrl ? item.location : `https://${item.location}`;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Top Section: Candidate Dossier & Platform Badge */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {item.profileImage && item.profileImage !== "not found" ? (
                          <img
                            src={item.profileImage}
                            alt={item.candidateName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                            {item.candidateName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <PlatformIcon platform={item.platform} className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition cursor-pointer" onClick={() => handleOpenCandidateModal(item)}>
                            {item.candidateName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 capitalize">
                            {item.roundType} Round
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          <span>{item.jobTitle}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={item.platform} />
                      <div className="shrink-0 scale-90">
                        <RadialAtsScore score={item.score} size={42} strokeWidth={4} />
                      </div>
                    </div>
                  </div>

                  {/* Interview Timetable Card */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-semibold">{item.date || "Upcoming"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-semibold">{item.time || "TBD"}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Interviewer: <strong>{item.interviewer}</strong> {item.interviewerEmail ? `(${item.interviewerEmail})` : ""}</span>
                    </div>
                  </div>

                  {/* Notes / Instructions Excerpt */}
                  {item.notes && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 px-1">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  {/* Join Meeting Primary CTA */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.platform === "teams" ? (
                      <a
                        href={meetingHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#5B5FC7] hover:bg-[#464EB8] shadow-xs hover:shadow-sm transition"
                      >
                        <MicrosoftTeamsLogo className="w-4 h-4 shrink-0" />
                        Join Microsoft Teams
                      </a>
                    ) : item.platform === "zoom" ? (
                      <a
                        href={meetingHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2D8CFF] hover:bg-[#1A7BE6] shadow-xs hover:shadow-sm transition"
                      >
                        <ZoomLogo className="w-4 h-4 shrink-0" />
                        Join Zoom Meeting
                      </a>
                    ) : item.platform === "meet" ? (
                      <a
                        href={meetingHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs hover:shadow-sm transition"
                      >
                        <GoogleMeetLogo className="w-4 h-4 shrink-0" />
                        Join Google Meet
                      </a>
                    ) : isUrl ? (
                      <a
                        href={meetingHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow-sm transition"
                      >
                        <Video className="w-4 h-4 shrink-0" />
                        Join Meeting
                      </a>
                    ) : (
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        📍 {item.location}
                      </span>
                    )}

                    {isUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.location);
                          toast.success("Meeting link copied!");
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Copy meeting link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => downloadIcsForInterview(item)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Download .ics Calendar Invite"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Candidate Dossier & Reschedule */}
                  <button
                    onClick={() => handleOpenCandidateModal(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition"
                  >
                    <span>View / Reschedule</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Candidate Profile Drawer for Rescheduling or Review */}
      {selectedCandidate && (
        <CandidateProfileModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCandidate(null);
            fetchInterviews();
          }}
          candidate={selectedCandidate}
          initialTab="interviews"
          onStatusChange={() => {
            fetchInterviews();
          }}
        />
      )}
    </div>
  );
};

export default CompanyInterviews;

