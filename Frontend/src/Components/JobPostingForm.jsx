import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import api from "../api/axios";

const JobPostingForm = () => {
  const navigate = useNavigate();
  const { darkMode } = useAppContext();
  const userRole = JSON.parse(localStorage.getItem("userRole")) || "";

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    experience: "Entry-level",
    salaryMin: "",
    salaryMax: "",
    description: "",
    skills: [],
    featured: false,
    postedBy: "",
    status: "Draft",
    department: "",
    remoteOption: "On-site",
    benefits: [],
    requirements: "",
    responsibilities: "",
    applicationDeadline: "",
    contactEmail: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const companyImage = {
    Facebook: "/5968/5968764",
    Microsoft: "/732/732221",
    Chatgpt: "/11865/11865326",
    Oracle: "/5969/5969096",
    AMD: "/732/732178",
  };

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];
  const experienceLevels = [
    "Entry-level",
    "Associate",
    "Mid-level",
    "Senior",
    "Director",
    "Executive",
  ];
  const remoteOptions = ["On-site", "Remote", "Hybrid"];
  const statusOptions = ["Draft", "Open", "Closed", "On Hold"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (benefitToRemove) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((benefit) => benefit !== benefitToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.company.trim())
      newErrors.company = "Company name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.requirements.trim())
      newErrors.requirements = "Requirements are required";
    if (!formData.responsibilities.trim())
      newErrors.responsibilities = "Responsibilities are required";
    if (!formData.postedBy.trim()) newErrors.postedBy = "Posted by is required";
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Email is invalid";
    }
    if (formData.skills.length === 0)
      newErrors.skills = "At least one skill is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,

        employmentType: formData.type,
        experienceLevel: formData.experience,
        workMode: formData.remoteOption,

        skillsRequired: formData.skills,

        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),

        department: formData.department,
        benefits: formData.benefits,

        requirements: formData.requirements,
        responsibilities: formData.responsibilities,

        applicationDeadline: formData.applicationDeadline,
        contactEmail: formData.contactEmail,

        isFeatured: formData.featured,

        status: publish ? "Open" : "Draft",
      };

      const res = await api.post("/api/jobs/create", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Job posted successfully!");
      navigate(`/${userRole}/jobs`);
    } catch (error) {
      alert(error.response.data.message || "Error posting job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} py-8 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1
            className={`text-3xl sm:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Create New Job Posting
          </h1>
          <p
            className={`mt-2 text-base sm:text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Fill in the details below to create a new job posting
          </p>
        </div>

        {/* Form Container */}
        <div
          className={`w-full ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl rounded-xl overflow-hidden`}
        >
          <div className="p-6 sm:p-8 lg:p-10">
            <form
              onSubmit={(e) => handleSubmit(e, false)}
              className="space-y-8"
            >
              {/* Basic Information */}
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-6 pb-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.title
                          ? "border-2 border-red-500"
                          : `border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`
                      }`}
                      placeholder="e.g. Frontend Engineer"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.company
                          ? "border-2 border-red-500"
                          : `border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`
                      }`}
                      placeholder="e.g. WebSolutions"
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.location
                          ? "border-2 border-red-500"
                          : `border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`
                      }`}
                      placeholder="e.g. Remote, New York, NY"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                      placeholder="e.g. Engineering"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Job Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                    >
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                    >
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Remote Option
                    </label>
                    <select
                      name="remoteOption"
                      value={formData.remoteOption}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                    >
                      {remoteOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Salary Range (k/year)
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleInputChange}
                        className={`flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleInputChange}
                        className={`flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-6 pb-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  Job Details
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Job Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                        errors.description
                          ? "border-2 border-red-500"
                          : `border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`
                      }`}
                      placeholder="Provide a brief overview of the role and what the candidate will be doing..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Responsibilities *
                    </label>
                    <textarea
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                        errors.responsibilities
                          ? "border-2 border-red-500"
                          : `border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`
                      }`}
                      placeholder="List the key responsibilities and day-to-day tasks..."
                    />
                    {errors.responsibilities && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.responsibilities}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Requirements *
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                        errors.requirements
                          ? "border-2 border-red-500"
                          : `border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`
                      }`}
                      placeholder="List the required qualifications, skills, and experience..."
                    />
                    {errors.requirements && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.requirements}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-6 pb-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  Required Skills *
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleAddSkill)}
                      className={`flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                      placeholder="Add a skill (e.g. JavaScript)"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
                    >
                      Add Skill
                    </button>
                  </div>
                  {errors.skills && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.skills}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                          darkMode
                            ? "bg-blue-900 text-blue-200"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className={`ml-2 hover:text-blue-800 dark:hover:text-blue-100 transition-colors ${
                            darkMode ? "text-blue-300" : "text-blue-600"
                          }`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-6 pb-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  Benefits & Perks
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      type="text"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleAddBenefit)}
                      className={`flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                      placeholder="Add a benefit (e.g. Health Insurance)"
                    />
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors font-medium"
                    >
                      Add Benefit
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                          darkMode
                            ? "bg-green-900 text-green-200"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(benefit)}
                          className={`ml-2 hover:text-green-800 dark:hover:text-green-100 transition-colors ${
                            darkMode ? "text-green-300" : "text-green-600"
                          }`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-6 pb-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  Additional Information
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Posted By *
                    </label>
                    <input
                      type="text"
                      name="postedBy"
                      value={formData.postedBy}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.postedBy
                          ? "border-2 border-red-500"
                          : `border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`
                      }`}
                      placeholder="Your name"
                    />
                    {errors.postedBy && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.postedBy}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.contactEmail
                          ? "border-2 border-red-500"
                          : `border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`
                      }`}
                      placeholder="hr@company.com"
                    />
                    {errors.contactEmail && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Feature this job posting
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <button
                  type="button"
                  onClick={() => navigate("/jobs")}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }`}
                >
                  {isSubmitting ? "Publishing..." : "Publish Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
