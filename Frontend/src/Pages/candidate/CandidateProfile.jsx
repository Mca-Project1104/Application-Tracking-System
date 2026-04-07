import React, { useState, useEffect, useRef } from "react";
import { dummyCandidate } from "../../assets/dummydata";
import api from "../../api/axios";

const CandidateProfile = () => {
  const [candidate, setCandidate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/candidates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setCandidate(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching candidate data:", err);
        setError("Failed to load candidate data. Please try again later.");
        setCandidate(dummyCandidate); // Use dummy data on error
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCandidateData();
  }, []);

  const handleDownload = () => {
    if (confirm("Download Resume.")) {
      window.open(
        `http://localhost:8000/api/candidates/resume/${candidate._id}`,
        "_blank",
      );
    }
  };

  useEffect(() => {
    setCandidate(dummyCandidate);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    console.log(file);
  };

  // CandidateProfile.jsx

  const handleSaveImage = async () => {
    if (!imagePreview) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    const file = fileInputRef.current?.files[0];
    if (file) {
      formData.append("profile_image", file);
    }
    formData.append("status", candidate.status);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await api.put(
        `/api/candidates/update/${candidate._id}`, // Use dynamic ID
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      console.log(response.data.candidate);

      // Update candidate state with response data
      setCandidate(response.data.candidate);
      closeImageModal();
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Save failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const formData = new FormData();
      formData.append("profile_image", ""); // Empty string to remove
      formData.append("status", candidate.status);

      const response = await api.put(
        `/api/candidates/update/${candidate._id}`, // Use same endpoint
        formData,
      );

      console.log(response);

      setCandidate(response.data.candidate);
      closeImageModal();
    } catch (error) {
      console.error("Error removing image:", error);
      alert("Failed to remove image. Please try again.");
    }
  };

  // const handleDownload=async()=>{
  //   try {
  //     const response =await api.get
  //   } catch (error) {
  //     console.log(error.response.data.data);
  //   }
  // }

  const closeImageModal = () => {
    setIsEditingImage(false);
    setImagePreview(null);
    setUploadProgress(0);
    setIsUploading(false);

    // Reset file input properly
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      // Force input to reset
      const input = fileInputRef.current;
      const newInput = document.createElement("input");
      newInput.type = "file";
      newInput.accept = "image/*";
      newInput.className = input.className;
      newInput.style.display = "none";
      input.parentNode.replaceChild(newInput, input);
      fileInputRef.current = newInput;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">
            Error Loading Profile
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          No candidate data found
        </p>
      </div>
    );
  }

  const getLevelColor = (level) => {
    switch (level) {
      case "Expert":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Advanced":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Beginne r":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "selected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  //resme scoring depend on socre
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-2 p-4  min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        className={`bg-white mt-15 ${isEditingImage ? "opacity-10" : ""}  dark:bg-gray-800 shadow-lg rounded-lg p-6`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center">
            {/* Profile Image Section */}
            <div className="relative group">
              <div className="relative z-0">
                {candidate.profile_image ? (
                  <img
                    className="h-20 w-20 rounded-full object-cover"
                    src={`http://localhost:5173/${candidate.profile_image}`}
                    alt={candidate?.user_id?.firstName}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <svg
                      className="h-10 w-10 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}

                {/* Edit Image Button */}
                <button
                  onClick={() => setIsEditingImage(true)}
                  className="absolute inset-0 h-20 w-20 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="ml-6">
              <h1 className="text-2xl capitalize font-bold text-gray-900 dark:text-white">
                {candidate?.user_id?.firstName}&nbsp;
                {candidate?.user_id?.lastName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {candidate.position}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
                {/* <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    candidate.status,
                  )}`}
                >
                  {candidate?.status?.charAt(0).toUpperCase() +
                    candidate?.status?.slice(1)}
                </span> */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Applied on {formatDate(candidate.createdAt)}
                </span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1">
                    Score:
                  </span>
                  <span
                    className={`text-lg font-bold ${getScoreColor(
                      candidate.ats_score,
                    )}`}
                  >
                    {candidate.ats_score}/100
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg
                className="mr-2 -ml-1 h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              Message
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              Schedule Interview
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Download Resume
            </button>
          </div>
        </div>
      </div>

      {/* Image Edit Modal */}
      {isEditingImage && (
        <div className="fixed  inset-0 flex items-center   justify-center z-20 p-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Edit Profile Picture
            </h3>

            {/* Image Preview */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {candidate.profile_image || imagePreview ? (
                  <img
                    className="h-32 w-32 rounded-full object-cover"
                    src={
                      imagePreview
                        ? imagePreview
                        : `http://localhost:5173/${candidate.profile_image}` ||
                          imagePreview
                    }
                    alt="Profile preview"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <svg
                      className="h-16 w-16 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="mr-2 -ml-1 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {isUploading ? "Uploading..." : "Select New Image"}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveImage}
                  disabled={!imagePreview || isUploading}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>

                <button
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-red-300 dark:border-red-600 shadow-sm text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>

                <button
                  onClick={closeImageModal}
                  disabled={isUploading}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* File Requirements */}
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>• Accepted formats: JPG, PNG, GIF, WebP</p>
              <p>• Maximum file size: 5MB</p>
              <p>• Recommended dimensions: 200x200px</p>
            </div>
          </div>
        </div>
      )}

      <div
        className={`bg-white ${isEditingImage ? "opacity-10" : ""} dark:bg-gray-800 shadow-lg rounded-lg`}
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav
            className="-mb-px flex space-x-8 px-6 overflow-x-auto"
            aria-label="Tabs"
          >
            {[
              "resume",
              "skills",
              "experience",
              "education",
              "projects",
              "certifications",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "resume" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Contact Information
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {candidate.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {candidate.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {candidate.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      LinkedIn
                    </p>
                    <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                      <a
                        href={`https://${candidate.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {candidate.linkedin}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      GitHub
                    </p>
                    <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                      <a
                        href={`https://${candidate.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {candidate.github}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Portfolio
                    </p>
                    <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                      <a
                        href={`https://${candidate.portfolio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {candidate.portfolio}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Professional Summary
                </h3>
                <p className="mt-2 text-sm text-wrap text-gray-600 dark:text-gray-300">
                  {candidate.resumeText}
                </p>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Technical Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidate.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {skill}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                        "Advanced",
                      )}`}
                    >
                      Advanced
                      {/* {skill.level} */}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Work Experience
              </h3>
              {candidate.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 dark:border-blue-400 pl-4"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {exp.title}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.endDate === "Present"
                        ? "Present"
                        : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {exp.company} • {exp.location}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "education" && (
            <div className="">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Education
              </h3>
              {candidate.education.map((edu, index) => (
                <div key={index} className="pl-4">
                  <div
                    className={`flex flex-col sm:flex-row ${(index >= 1) & index ? "mt-2" : ""} sm:justify-between`}
                  >
                    <p className="  text-gray-900 dark:text-white">{edu} </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Projects
              </h3>
              {candidate.projects.map((project, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h4>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm mt-1 sm:mt-0"
                    >
                      View Project
                    </a>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "certifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Certifications
              </h3>
              {candidate.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {cert.name}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                      {formatDate(cert.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {cert.issuer}
                  </p>
                  {cert.credentialId && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Credential ID: {cert.credentialId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
