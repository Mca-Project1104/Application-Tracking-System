import React, { useState } from "react";
import api from "../../api/axios";
import { useAppContext } from "../../context/AppProvider";
import Header from "../../Components/Header";

const ResumeAnalyzer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matchScore, setMatchScore] = useState(0);
  const [atsDetail, setAtsDetail] = useState(null); // { score, matched, total }
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState("");

  const { setCandidate } = useAppContext();

  const isValidFile = (f) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return validTypes.includes(f.type) || f.name.endsWith(".docx");
  };

  const applyFile = (f) => {
    if (!isValidFile(f)) {
      setError("Please upload a PDF or DOCX file");
      return;
    }
    setFile(f);
    setResumeUploaded(true);
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) applyFile(f);
  };
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) applyFile(f);
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please upload a resume first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);
      const token = localStorage.getItem("token");

      // api instance already attaches the auth token — no need to set it manually
      const res = await api.post("/api/resume/analyze", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const candidate = res.data.data.candidate;

      const atsScoreRaw = res.data.data.atsScore;
      const numericScore =
        typeof atsScoreRaw === "object" && atsScoreRaw !== null
          ? (atsScoreRaw.score ?? 0)
          : (atsScoreRaw ?? 0);

      setMatchScore(numericScore);
      setAtsDetail(typeof atsScoreRaw === "object" ? atsScoreRaw : null);
      setAnalysisData(candidate);
      setAnalysisComplete(true);
      setCandidate(candidate);
      setResumeText(res.data.data.resumeText ?? "");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ?? "Analysis failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setResumeUploaded(false);
    setFile(null);
    setAnalysisComplete(false);
    setAnalysisData(null);
    setMatchScore(0);
    setAtsDetail(null);
    setResumeText("");
    setError("");
  };

  const skills = analysisData?.skills ?? [];
  const experience = analysisData?.experience ?? []; // FIX: was analysisData.candidate?.experience
  const education = analysisData?.education ?? [];
  const suggestions = analysisData?.suggestions ?? [];
  const keywords = analysisData?.keywords ?? [];

  const scoreColor =
    matchScore >= 80
      ? "text-green-600 dark:text-green-400"
      : matchScore >= 60
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-4 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 shadow mt-10 rounded-lg hover:shadow-lg transition-all duration-200">
        <Header
          title={"Resume Analyzer"}
          description={"Upload your resume and get instant feedback"}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 rounded">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-red-400 dark:text-red-500 shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Upload Resume
          </h2>

          {!resumeUploaded ? (
            <div
              className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-all duration-200 ${
                isDragging
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, DOCX up to 10 MB
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-blue-400 dark:text-blue-500 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Resume uploaded successfully
                    </h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 break-all">
                      {file?.name}
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">
                      {(file?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={resetUpload}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Upload Different Resume
              </button>
            </div>
          )}
        </div>

        {/* Job description card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Job Description{" "}
            <span className="text-sm font-normal text-gray-400">
              (Optional)
            </span>
          </h2>
          <textarea
            id="job-description"
            name="job-description"
            rows={8}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 transition-colors duration-200"
            placeholder="Paste the job description here to get a match score…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button
            type="button"
            className="mt-4 w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            onClick={analyzeResume}
            disabled={!resumeUploaded || loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Processing…
              </>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </div>
      </div>

      {/* ── Results ── */}
      {analysisComplete && analysisData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: extracted info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Extracted Information
              </h2>

              {/* Contact */}
              <section className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3 pb-1 border-b border-gray-100 dark:border-gray-700">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Name",
                      value:
                        `${analysisData.user_id?.firstName ?? ""} ${analysisData.user_id?.lastName ?? ""}`.trim() ||
                        "Not found",
                    },
                    {
                      label: "Email",
                      value: analysisData.email || "Not found",
                    },
                    {
                      label: "Phone",
                      value: analysisData.phone || "Not found",
                    },
                    {
                      label: "Location",
                      value: analysisData.location || "Not found",
                    },
                    {
                      label: "LinkedIn",
                      value: analysisData.linkedin || null,
                      link: true,
                    },
                    {
                      label: "GitHub",
                      value: analysisData.github || null,
                      link: true,
                    },
                  ].map(({ label, value, link }) => (
                    <div key={label}>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {label}
                      </p>
                      {link && value ? (
                        <a
                          href={`https://${value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                          {value || "Not found"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3 pb-1 border-b border-gray-100 dark:border-gray-700">
                  Skills
                </h3>
                {skills.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No skills found
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => {
                      // handle both plain string and { name, level } object
                      const name =
                        typeof skill === "object" ? skill.name : skill;
                      const level =
                        typeof skill === "object" ? skill.level : null;
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {name}
                          {level ? ` · ${level}` : ""}
                        </span>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Experience — FIX: was analysisData.candidate?.experience */}
              <section className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3 pb-1 border-b border-gray-100 dark:border-gray-700">
                  Experience
                </h3>
                {experience.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No experience found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {experience.map((exp, i) => (
                      <div
                        key={i}
                        className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-1"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {exp}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                            {exp.startDate} – {exp.endDate || "Present"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exp.company}
                          {exp.location ? ` • ${exp.location}` : ""}
                        </p>
                        {exp.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Education */}
              <section className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3 pb-1 border-b border-gray-100 dark:border-gray-700">
                  Education
                </h3>
                {education.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No education found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {education.map((edu, i) =>
                      typeof edu === "object" ? (
                        <div
                          key={i}
                          className="border-l-4 border-purple-500 dark:border-purple-400 pl-4 py-1"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {edu.degree}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                              {edu.startDate} – {edu.endDate || "Present"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {edu.institution}
                          </p>
                          {edu.field && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {edu.field}
                            </p>
                          )}
                        </div>
                      ) : (
                        // plain string fallback
                        <div
                          key={i}
                          className="border-l-4 border-purple-500 dark:border-purple-400 pl-4 py-1"
                        >
                          <p className="text-sm text-gray-900 dark:text-gray-300">
                            {edu}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </section>

              {/* Resume text preview */}
              {resumeText && (
                <section>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3 pb-1 border-b border-gray-100 dark:border-gray-700">
                    Raw Resume Text
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4 max-h-48 overflow-y-auto">
                    <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {resumeText}
                    </p>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right: score + feedback + keywords */}
          <div className="space-y-6">
            {/* Match score */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Match Score
              </h2>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg
                    viewBox="0 0 128 128"
                    className="w-full h-full -rotate-90"
                  >
                    <circle
                      className="text-gray-200 dark:text-gray-700"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className={
                        matchScore >= 80
                          ? "text-green-500"
                          : matchScore >= 60
                            ? "text-yellow-500"
                            : "text-red-500"
                      }
                      strokeWidth="10"
                      strokeDasharray={`${(matchScore / 100) * 351.86} 351.86`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${scoreColor}`}>
                      {matchScore}%
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {jobDescription
                    ? `Your resume matches ${matchScore}% with the job description`
                    : "Overall ATS score"}
                </p>
                {atsDetail && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {atsDetail.matched} of {atsDetail.total} keywords matched
                  </p>
                )}
                {/* Score legend */}
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-1 self-start w-full">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />{" "}
                    80–100: Strong match
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />{" "}
                    60–79: Fair match
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />{" "}
                    Below 60: Needs improvement
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Feedback */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Resume Feedback
              </h2>
              {suggestions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No suggestions available
                </p>
              ) : (
                <div className="space-y-3">
                  {suggestions.map((suggestion, i) => {
                    const isPositive = suggestion.type === "positive";
                    const isWarning = suggestion.type === "warning";
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200"
                      >
                        <svg
                          className={`h-5 w-5 mt-0.5 shrink-0 ${isPositive ? "text-green-500 dark:text-green-400" : isWarning ? "text-yellow-500 dark:text-yellow-400" : "text-red-500 dark:text-red-400"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          {isPositive ? (
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          ) : isWarning ? (
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          ) : (
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          )}
                        </svg>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {suggestion.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Keywords */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Keywords Found
              </h2>
              {keywords.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No keywords analyzed
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                        keyword.found
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : keyword.partial
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {keyword.text}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />{" "}
                  Found in resume
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />{" "}
                  Partial match
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />{" "}
                  Not found
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
