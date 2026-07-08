import React, { useState, useRef, useCallback, useEffect } from "react";
import api from "../../api/axios";
import { useAppContext } from "../../context/AppProvider";
import Loading from "../../Components/Loading/Loading";
import { toast } from "react-hot-toast";

const CandidateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {
    setCandidate,
    candidate,
    candidateLoading,
    refetchCandidate: fetchCandidateData,
  } = useAppContext();

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCandidateData();
  }, []);
  const [personalbio, setPersonalBio] = useState(candidate?.personal);

  const handleDownload = () => {
    if (!candidate.resumeUrl) {
      return toast.error("Please Upload your resume");
    }
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/${candidate.resumeUrl}`,
      "_blank",
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // <10 mb allowed
      alert("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    const file = fileInputRef.current?.files[0];
    if (file) {
      formData.append("profile_image", file);
    }
    formData.append("personal", personalbio);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await api.put(
        `/api/v1/candidates/update/${candidate._id}`,
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

      setCandidate(response.data.candidate);
      closeImageModal();
      fetchCandidateData();
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Save failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const closeImageModal = () => {
    setIsEditingImage(false);
    setImagePreview(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Expert":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Advanced":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Beginner":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <Loading detail={"loading .."} />;
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
    return <Loading detail={"Error : 404"} />;
  }

  const skills = candidate.skills ?? [];
  const experience = candidate.experience ?? [];
  const education = candidate.education ?? [];
  const projects = candidate.projects ?? [];
  const certifications = candidate.certifications ?? [];

  const profileImageSrc = candidate.profile_image
    ? `${candidate.profile_image}`
    : null;

  return (
    <div className="space-y-2 p-1 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        className={`bg-white sticky top-15  dark:bg-gray-800 shadow-lg rounded-lg p-2 ${
          isEditingImage ? "opacity-10 pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center">
            <div className="relative group">
              {profileImageSrc ? (
                <img
                  className="h-10 w-10 rounded-full object-cover lg:w-20 lg:h-20 md:w-15 md:h-15"
                  src={candidate.profile_image}
                  alt={candidate.user_id?.firstName}
                />
              ) : (
                <div className="h-10 w-10 lg:w-20 lg:h-20 md:w-15 md:h-15 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <svg
                    className="h-10 w-10 text-gray-400 dark:text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="ml-6">
              <h1 className="text-xl lg:text-2xl  capitalize font-bold text-gray-900 dark:text-white">
                {candidate.user_id?.firstName} {candidate.user_id?.lastName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {candidate.position}
              </p>
              <div className=" flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(candidate.createdAt)}
                </span>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1">
                    Score:
                  </span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(candidate.ats_score)}`}
                  >
                    {candidate.ats_score}
                  </span>
                  /100
                </div>
              </div>
            </div>
          </div>

          <div className="capitalize grid grid-cols-2 gap-3 w-full lg:w-auto md:w-auto sm:w-auto mt-4 sm:mt-0 ">
            <div className="">
              <button
                onClick={() => setIsEditingImage(true)}
                className=" capitalize  items-center w-full px-4 py-2 active:scale-95 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                edit
              </button>
            </div>
            <div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="mr-2 -ml-1 h-5 w-5 text-gray-500 dark:text-gray-400"
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
                Resume
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 hidden items-start gap-2  lg:flex">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {candidate.personal}
          </p>
        </div>
      </div>

      {isEditingImage && (
        <div className="fixed inset-0  flex items-center justify-center z-20 p-1  bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lvh w-full p-6 shadow-xl ">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Edit Profile
            </h3>

            <div className="flex justify-center mb-4">
              {imagePreview || profileImageSrc ? (
                <div className="relative">
                  <img
                    className=" h-32 w-32 rounded-full object-cover "
                    src={imagePreview ?? profileImageSrc}
                    alt="Profile preview"
                  />
                </div>
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

            {isUploading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Uploading…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 p-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div>
                <div className="flxe space-x-4">
                  <textarea
                    type="text"
                    placeholder="Enter Bio"
                    rows={3}
                    value={personalbio}
                    onChange={(e) => setPersonalBio(e.target.value)}
                    className="border rounded w-full font-light p-1 text-sm lg:text-md"
                    required
                  ></textarea>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                {isUploading ? "Uploading…" : "Select New Image"}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUploading}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>

                <button
                  onClick={closeImageModal}
                  disabled={isUploading}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>• Accepted formats: JPG, PNG, GIF, WebP</p>
              <p>• Maximum file size: 10 MB</p>
              <p>• Recommended dimensions: 200×200 px</p>
            </div>
          </div>
        </div>
      )}

      <div
        className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg ${
          isEditingImage ? "opacity-10 pointer-events-none" : ""
        }`}
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
                  {[
                    { label: "Email", value: candidate.email },
                    { label: "Phone", value: candidate.phone },
                    { label: "Location", value: candidate.location },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {label}
                      </p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {value || "—"}
                      </p>
                    </div>
                  ))}
                  {[
                    { label: "LinkedIn", href: candidate.linkedin },
                    { label: "GitHub", href: candidate.github },
                    { label: "Portfolio", href: candidate.portfolio },
                  ].map(({ label, href }) => (
                    <div key={label}>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={`https://${href}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {href}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          —
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Professional Summary
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {candidate.resumeText || "No summary available."}
                </p>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Technical Skills
              </h3>
              {skills.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No skills listed.
                </p>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
                  {skills.map((skill, index) => {
                    const skillName =
                      typeof skill === "object" ? skill.name : skill;
                    const skillLevel =
                      typeof skill === "object" ? skill.level : "Advanced";
                    return (
                      <div
                        key={index}
                        className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {skillName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {experience.length > 1 && activeTab === "experience" && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Work Experience
              </h3>
              {experience.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No experience listed.
                </p>
              ) : (
                experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 dark:border-blue-400 pl-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">
                        {exp}
                      </h4>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "education" && (
            <div className="">
              <h3 className="text-lg pb-5 font-medium text-gray-900 dark:text-white">
                Education
              </h3>
              {education.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No education listed.
                </p>
              ) : (
                education.map((edu, index) => (
                  <div key={index} className="">
                    {typeof edu === "object" ? (
                      <>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white">
                            {edu.degree}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                            {formatDate(edu.startDate)} –{" "}
                            {edu.endDate === "Present"
                              ? "Present"
                              : formatDate(edu.endDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {edu.institution}
                        </p>
                        {edu.field && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {edu.field}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-white">
                        {edu}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="">
              <h3 className="text-lg pb-5 font-medium text-gray-900 dark:text-white">
                Projects
              </h3>
              {projects.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No projects listed.
                </p>
              ) : (
                projects.map((project, index) => (
                  <div key={index} className="">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h4 className=" text-sm text-gray-900 dark:text-white">
                        {project}
                      </h4>
                    </div>

                    {project.technologies?.length > 0 && (
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
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "certifications" && (
            <div>
              <h3 className="text-lg pb-5 font-medium text-gray-900 dark:text-white">
                Certifications
              </h3>
              {certifications.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No certifications listed.
                </p>
              ) : (
                certifications.map((cert, index) => (
                  <div key={index} className="">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h4 className="text-sm text-gray-900 dark:text-white">
                        {cert}
                      </h4>
                    </div>
                    {cert.credentialId && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
