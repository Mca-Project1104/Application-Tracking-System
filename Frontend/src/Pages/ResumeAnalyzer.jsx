import React, { useState } from "react";

const ResumeAnalyzer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matchScore, setMatchScore] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

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
    setResumeUploaded(true);
    // In a real app, you would handle the file upload here
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeUploaded(true);
      // In a real app, you would handle the file upload here
    }
  };

  const analyzeResume = () => {
    // Simulate analysis
    setMatchScore(75);
    setAnalysisComplete(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow mt-15 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Resume Analyzer</h1>
        <p className="mt-1 text-gray-600">
          Upload your resume and get instant feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Upload Resume
          </h2>

          {!resumeUploaded ? (
            <div
              className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
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
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Resume uploaded successfully
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>John_Doe_Resume.pdf</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setResumeUploaded(false)}
              >
                Upload Different Resume
              </button>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Job Description (Optional)
          </h2>
          <div className="mt-2">
            <textarea
              id="job-description"
              name="job-description"
              rows={8}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Paste the job description here to get a match score..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={analyzeResume}
              disabled={!resumeUploaded}
            >
              Analyze Resume
            </button>
          </div>
        </div>
      </div>

      {analysisComplete && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Extracted Information
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Contact Information
                  </h3>
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1 text-sm text-gray-900">John Doe</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">
                        john.doe@example.com
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1 text-sm text-gray-900">
                        (555) 123-4567
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        San Francisco, CA
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Skills
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      React
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      JavaScript
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      TypeScript
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      HTML
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      CSS
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Node.js
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Git
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      REST API
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Experience
                  </h3>
                  <div className="mt-2 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          Senior Frontend Developer
                        </h4>
                        <span className="text-sm text-gray-500">
                          2020 - Present
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Tech Innovations Inc.
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Led the development of the company's flagship product
                        using React and TypeScript.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          Frontend Developer
                        </h4>
                        <span className="text-sm text-gray-500">
                          2018 - 2020
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">WebSolutions</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Developed responsive web applications using modern
                        JavaScript frameworks.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          Junior Developer
                        </h4>
                        <span className="text-sm text-gray-500">
                          2016 - 2018
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">StartUpXYZ</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Assisted in the development of various client projects.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Education
                  </h3>
                  <div className="mt-2 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          Bachelor of Science in Computer Science
                        </h4>
                        <span className="text-sm text-gray-500">
                          2012 - 2016
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        University of California, Berkeley
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Match Score
              </h2>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-gray-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-blue-600"
                      strokeWidth="10"
                      strokeDasharray={`${matchScore * 3.52} 352`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {matchScore}%
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Your resume matches {matchScore}% with the job description
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Resume Feedback
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 text-sm text-gray-700">
                    Strong technical skills section
                  </p>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 text-sm text-gray-700">
                    Clear work experience timeline
                  </p>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-yellow-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 text-sm text-gray-700">
                    Add more quantifiable achievements
                  </p>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-yellow-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 text-sm text-gray-700">
                    Consider adding a summary section
                  </p>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 text-sm text-gray-700">
                    Missing key skills from job description
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Keywords Found
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  React
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  JavaScript
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Frontend
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Developer
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Team
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  TypeScript
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  GraphQL
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  AWS
                </span>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <p>Green: Found in resume</p>
                <p>Yellow: Partial match</p>
                <p>Red: Not found</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
