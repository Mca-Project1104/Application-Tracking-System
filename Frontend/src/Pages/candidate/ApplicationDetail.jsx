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
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import Loading from "../../Components/Loading/Loading";
import { getStatusBadge } from "../../assets/dummydata.js";

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
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(status)} capitalize`}
            >
              {status}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600 relative">
                <div className="absolute -bottom-10 left-6">
                  <img
                    src={candidate.profile_image}
                    alt="Profile"
                    className="w-24 h-24 rounded-xl border-4 border-white dark:border-gray-800 object-cover shadow-md bg-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${candidate.email || "User"}&background=random`;
                    }}
                  />
                </div>
              </div>
              <div className="pt-12 pb-6 px-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {candidate.email?.split("@")[0].charAt(0).toUpperCase() +
                    candidate.email?.split("@")[0].slice(1) || "Candidate Name"}
                </h2>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  Applied for: {getJobTitle()}
                </p>

                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{candidate.location}</span>
                </div>

                <div className="mt-6 flex flex-col space-y-3">
                  <a
                    href={`mailto:${candidate.email}`}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
                  >
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    {candidate.email}
                  </a>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    {candidate.phone || "Not Provided"}
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  {candidate && (
                    <a
                      href={candidate?.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {candidate && (
                    <a
                      href={candidate?.github}
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
                  {candidate.skills?.length || 0} Total
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.map((skill, index) => (
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
              href={`http://localhost:8000/${resumeUrl}`}
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
                <div className="text-right">
                  <div
                    className={`text-5xl font-bold ${getScoreColor(resume_Analyse.match_score || 0)}`}
                  >
                    {resume_Analyse.match_score || 0}%
                  </div>
                  <div className="flex items-center justify-end mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    Analyzed on {new Date(createdAt).toLocaleDateString()}
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 capitalize mb-1.5">
                        {scheduleForm.type} Round
                      </span>
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
                    {scheduleForm.location && (
                      <div className="flex items-start gap-1.5 text-sm">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                          {scheduleForm.location}
                        </p>
                      </div>
                    )}
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
