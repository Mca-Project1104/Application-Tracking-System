import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Code,
  FileText,
  Loader2,
  Video,
  Copy,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  MicrosoftLogo,
  MicrosoftTeamsLogo,
  ZoomLogo,
  GoogleMeetLogo,
  PlatformBadge,
} from "../../Components/common/MeetingPlatformIcons.jsx";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import Loading from "../../Components/Loading/Loading";
import { getStatusBadge } from "../../assets/dummydata.js";
import StatusPill from "../../Components/common/StatusPill.jsx";
import RadialAtsScore from "../../Components/common/RadialAtsScore.jsx";

const ApplicationDetails = () => {
  const { id } = useParams();

  const { applications, candidate } = useAppContext();

  const applicationData = applications.find((item) => item._id === id);

  if (!applications || !applicationData) {
    return <Loading title={"Loading Application Details..."} />;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  //data destructuring
  const {
    candidateId = {},
    resume_Analyse = {},
    status,
    score,
    createdAt,
    resumeUrl,
    jobId,
    scheduleForm,
  } = applicationData;

  const cand = candidate || candidateId || {};

  const getJobTitle = () => {
    if (typeof jobId === "object" && jobId !== null) return jobId.title;
    return "N/A";
  };

  const getCompanyName = () => {
    if (typeof jobId === "object" && jobId !== null) return jobId.companyName;
    return "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10 mt-0 transition-colors">
      <div className=" mt-1 mx-auto px-2 sm:px-4 lg:px-2 py-2">
        <div className=" rounded mx-auto mb-2  lg:px-6 space-y-1  h-16 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 w-13 h-13 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <img
                src={jobId?.company?.logo}
                alt="logo"
                className="w-full h-full object-cover rounded-full"
              />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {getJobTitle()}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getCompanyName()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <StatusPill status={status} size="md" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600 relative">
                <div className="absolute -bottom-10 left-6">
                  <img
                    src={cand.profile_image}
                    alt="Profile"
                    className="w-24 h-24 rounded-xl border-4 border-white dark:border-gray-800 object-cover shadow-md bg-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${cand.email || "User"}&background=random`;
                    }}
                  />
                </div>
              </div>
              <div className="pt-12 pb-6 px-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {cand.email?.split("@")[0]?.charAt(0)?.toUpperCase() +
                    cand.email?.split("@")[0]?.slice(1) || "Candidate Name"}
                </h2>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  Applied for: {getJobTitle()}
                </p>

                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{cand.location || "Location not provided"}</span>
                </div>

                <div className="mt-6 flex flex-col space-y-3">
                  <a
                    href={`mailto:${cand.email}`}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
                  >
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    {cand.email || "Not Provided"}
                  </a>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    {cand.phone || "Not Provided"}
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  {cand.linkedin && (
                    <a
                      href={cand.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {cand.github && (
                    <a
                      href={cand.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      <FaGithub className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  Skills
                </h3>
                <span className="text-xs bg-gray-100  dark:bg-gray-700 px-2 py-1 rounded text-gray-500 dark:text-gray-400">
                  {cand.skills?.length || 0} Total
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cand.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="capitalize px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/${resumeUrl}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition">
                      Download Resume
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF Document
                    </p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </div>
            </a>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Resume Match Score
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Based on job requirements analysis
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <RadialAtsScore score={resume_Analyse.match_score || 0} size={68} strokeWidth={5.5} />
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center justify-end text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      Analyzed on {new Date(createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-6 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${resume_Analyse.match_score >= 80 ? "bg-green-500" : resume_Analyse.match_score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${resume_Analyse.match_score || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-2">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Matched Skills
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume_Analyse.matched_skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded border border-green-200 dark:border-green-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-2">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Missing Skills
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume_Analyse.missing_skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-medium rounded border border-red-200 dark:border-red-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {scheduleForm && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                  Interview Details
                </h3>

                <div className="relative pl-6 border-l-2 border-blue-200 dark:border-blue-800">
                  <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-gray-800 shadow-sm"></div>

                  <div className="space-y-3 pb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 capitalize">
                          {scheduleForm.type} Round
                        </span>
                        <PlatformBadge
                          platform={
                            scheduleForm.platform ||
                            (scheduleForm.location?.includes("teams.")
                              ? "teams"
                              : scheduleForm.location?.includes("zoom.")
                              ? "zoom"
                              : scheduleForm.location?.includes("meet.")
                              ? "meet"
                              : "custom")
                          }
                        />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        with {scheduleForm.interviewer || "TBD"}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-gray-400"
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
                        {scheduleForm.date
                          ? new Date(scheduleForm.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "No date"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {scheduleForm.time || "No time"}
                      </span>
                    </div>
                    {scheduleForm.notes && (
                      <div className="flex items-start gap-1.5 text-sm pt-2 border-gray-100 dark:border-gray-700 mt-2">
                        <svg
                          className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
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
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          {scheduleForm.notes}
                        </p>
                      </div>
                    )}
                    {scheduleForm.location && (() => {
                      const isUrl =
                        scheduleForm.location.startsWith("http://") ||
                        scheduleForm.location.startsWith("https://");
                      const isTeams =
                        scheduleForm.platform === "teams" ||
                        scheduleForm.location?.includes("teams.microsoft.com") ||
                        scheduleForm.location?.includes("teams.live.com");
                      const isMeet =
                        scheduleForm.platform === "meet" ||
                        scheduleForm.location?.includes("meet.google.");
                      const isZoom =
                        scheduleForm.platform === "zoom" ||
                        scheduleForm.location?.includes("zoom.");
                      const meetingHref = isUrl
                        ? scheduleForm.location
                        : `https://${scheduleForm.location}`;

                      if (isTeams) {
                        return (
                          <div className="mt-4 p-4 rounded-xl border border-[#5B5FC7]/30 bg-gradient-to-r from-[#5B5FC7]/10 via-[#5B5FC7]/5 to-transparent">
                            <div className="flex items-center gap-2.5 mb-2">
                              <div className="p-1.5 rounded-lg bg-[#5B5FC7]/15 border border-[#5B5FC7]/30 shadow-xs">
                                <MicrosoftTeamsLogo className="w-5 h-5 shrink-0" />
                              </div>
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#464EB8] dark:text-[#7B83EB] flex items-center gap-1.5">
                                  <span>Microsoft Teams Online Interview</span>
                                </span>
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                                  <MicrosoftLogo className="w-3 h-3 shrink-0" />
                                  <span>Microsoft 365 Meeting Room</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                              Your interview is hosted on Microsoft Teams. You can join directly from your web browser or Microsoft Teams application.
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={meetingHref}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#5B5FC7] hover:bg-[#464EB8] shadow-md shadow-[#5B5FC7]/20 transition-all transform hover:-translate-y-0.5"
                              >
                                <MicrosoftTeamsLogo className="w-4 h-4 shrink-0" />
                                Join Microsoft Teams Meeting
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(scheduleForm.location);
                                  toast.success("Microsoft Teams link copied!");
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                              >
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                Copy Link
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (isMeet) {
                        return (
                          <div className="mt-4 p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent">
                            <div className="flex items-center gap-2.5 mb-2">
                              <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 shadow-xs">
                                <GoogleMeetLogo className="w-5 h-5 shrink-0" />
                              </div>
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                  Google Meet Video Interview
                                </span>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  Google Workspace Secure Video Call
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={meetingHref}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
                              >
                                <GoogleMeetLogo className="w-4 h-4 shrink-0" />
                                Join Google Meet
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(scheduleForm.location);
                                  toast.success("Google Meet link copied!");
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                              >
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                Copy Link
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (isZoom) {
                        return (
                          <div className="mt-4 p-4 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent">
                            <div className="flex items-center gap-2.5 mb-2">
                              <div className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 shadow-xs">
                                <ZoomLogo className="w-5 h-5 shrink-0" />
                              </div>
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                  Zoom Video Interview
                                </span>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  Official Zoom Video Communications Call
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={meetingHref}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2D8CFF] hover:bg-[#1A7BE6] shadow-md shadow-blue-600/20 transition-all"
                              >
                                <ZoomLogo className="w-4 h-4 shrink-0" />
                                Join Zoom Meeting
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(scheduleForm.location);
                                  toast.success("Zoom link copied!");
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                              >
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                Copy Link
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (isUrl) {
                        return (
                          <div className="mt-4 p-4 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-900/10">
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={meetingHref}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                              >
                                <Video className="w-4 h-4" />
                                Join Online Meeting
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(scheduleForm.location);
                                  toast.success("Meeting link copied!");
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                              >
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                Copy Link
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="flex items-start gap-1.5 text-sm mt-3 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <span>{scheduleForm.location}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                Analysis & Feedback
              </h3>

              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 uppercase tracking-wider">
                    Strengths
                  </h5>
                  <ul className="space-y-2">
                    {resume_Analyse.strengths?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="mr-2 text-green-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <hr className="border-gray-100 dark:border-gray-700" />

                <div>
                  <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 uppercase tracking-wider">
                    Areas for Improvement
                  </h5>
                  <ul className="space-y-2">
                    {resume_Analyse.weaknesses?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="mr-2 text-red-500">!</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">
                    Suggestions
                  </h5>
                  <ul className="space-y-2">
                    {resume_Analyse.suggestions?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="mr-2 text-blue-500">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
