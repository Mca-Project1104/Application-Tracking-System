import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../context/AppProvider";
import api from "../../api/axios";

const JobPostingForm = () => {
  const { companydata, navigate } = useAppContext();
  const [isloading, setIsloading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newSkill, setNewSkill] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const initializeFormData = useCallback(() => {
    return {
      title: "",
      company: companydata?.company?.name || "",
      location: companydata?.company?.location || "",
      type: "Full-time",
      experience: "Entry-level",
      salaryMin: "",
      salaryMax: "",
      description: "",
      skills: [],
      featured: false,
      postedBy: companydata?.name || "",
      status: "Draft",
      department: companydata?.department || "",
      remoteOption: "On-site",
      benefits: [],
      requirements: "",
      responsibilities: "",
      applicationDeadline: "",
      contactEmail: companydata?.email || "",
    };
  }, [companydata]);

  const [formData, setFormData] = useState(initializeFormData);
  const [errors, setErrors] = useState({});

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];
  const experienceLevels = [
    "Entry-level",
    "Mid-level",
    "Senior-level",
    "Director",
    "Executive",
  ];
  const remoteOptions = ["On-site", "Remote", "Hybrid"];
  const statusOptions = ["Draft", "Open", "Closed"];

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      // Fetch company and location data
      const fetchCompanyData = async () => {
        try {
          const res = await api.get("/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFormData((prev) => ({
            ...prev,
            company: res.data.companyName || "",
            location: res.data.location || "",
            contactEmail: res.data.email || "",
            postedBy: res.data.name || "",
          }));
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setIsloading(false);
        }
      };
      fetchCompanyData();
    }
  }, [token, navigate]);

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
      if (errors.skills) {
        setErrors((prev) => ({ ...prev, skills: "" }));
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
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

  const handleRemoveBenefit = (benefit) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((b) => b !== benefit),
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Job title is required";
      if (!formData.company.trim()) newErrors.company = "Company is required";
      if (!formData.location.trim())
        newErrors.location = "Location is required";
      if (formData.salaryMin && formData.salaryMax) {
        if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
          newErrors.salaryMin =
            "Minimum salary cannot be greater than maximum salary";
        }
      }
    } else if (step === 2) {
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      } else if (formData.description.length < 50) {
        newErrors.description = "Description must be at least 50 characters";
      }
      if (!formData.requirements.trim())
        newErrors.requirements = "Requirements are required";
      if (!formData.responsibilities.trim())
        newErrors.responsibilities = "Responsibilities are required";
      if (formData.skills.length === 0)
        newErrors.skills = "At least one skill is required";
    } else if (step === 3) {
      if (!formData.postedBy.trim())
        newErrors.postedBy = "Posted by is required";
      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = "Contact email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
        newErrors.contactEmail = "Email is invalid";
      }
      if (formData.applicationDeadline) {
        const deadline = new Date(formData.applicationDeadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadline < today) {
          newErrors.applicationDeadline =
            "Application deadline cannot be in the past";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      const firstErrorField = document.querySelector(".border-red-500");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (publish = false) => {
    if (!validateStep(3)) {
      const firstErrorField = document.querySelector(".border-red-500");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        company: formData.company,
        employmentType: formData.type,
        experienceLevel: formData.experience,
        workMode: formData.remoteOption,
        skillsRequired: formData.skills,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        department: formData.department,
        benefits: formData.benefits,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        applicationDeadline: formData.applicationDeadline || undefined,
        contactEmail: formData.contactEmail,
        isFeatured: formData.featured,
        status: publish ? "Open" : "Draft",
        postedBy: formData.postedBy,
      };

      const res = await api.post("/api/jobs/create", jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/${userRole}/jobs`);
    } catch (error) {
      console.error("Job posting error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  //handlde a keybord
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to discard your changes?")) {
      navigate(`/${userRole}/jobs`);
    }
  };

  if (isloading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>{" "}
        {/* Round loading */}
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-5 dark:bg-gray-900 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold dark:text-white text-gray-900">
            New Job Posting
          </h1>
          <p className="mt-2 text-base sm:text-lg dark:text-gray-200 text-gray-600">
            Fill in the details below to create a new job posting
          </p>
        </div>

        {/* Step Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map(
              (
                step, //check dynamically select indicator
              ) => (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        currentStep === step
                          ? "bg-blue-600 text-white"
                          : currentStep > step
                            ? "bg-green-600 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {currentStep > step ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        currentStep === step
                          ? "dark:text-white text-gray-900"
                          : currentStep > step
                            ? "dark:text-green-400 text-green-600"
                            : "dark:text-gray-500 text-gray-400"
                      }`}
                    >
                      {step === 1
                        ? "Basic Info"
                        : step === 2
                          ? "Job Details"
                          : "Review"}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                        currentStep > step
                          ? "bg-green-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ),
            )}
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full dark:bg-gray-900 bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold dark:text-white text-gray-900 mb-6">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 capitalize rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.title
                          ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                      }`}
                      placeholder="e.g. Frontend Engineer"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      readOnly
                      className="w-full capitalize px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      readOnly
                      className="w-full capitalize px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full capitalize px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                      placeholder="e.g. Engineering"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Job Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                    >
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                    >
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Remote Option
                    </label>
                    <select
                      name="remoteOption"
                      value={formData.remoteOption}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                    >
                      {remoteOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Salary Range (k/year)
                    </label>
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          name="salaryMin"
                          value={formData.salaryMin}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            errors.salaryMin
                              ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                          }`}
                          placeholder="Min"
                        />
                        {errors.salaryMin && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.salaryMin}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          name="salaryMax"
                          value={formData.salaryMax}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Job Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold dark:text-white text-gray-900 mb-6">
                  Job Details
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Job Description *
                      <span className="ml-2 text-xs dark:text-gray-500 text-gray-400">
                        (min. 50 characters)
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
                          errors.description
                            ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                        }`}
                        placeholder="Provide a brief overview of the role and what the candidate will be doing..."
                      />
                      <div className="absolute bottom-2 right-2 text-xs dark:text-gray-500 text-gray-400">
                        {formData.description.length}/500
                      </div>
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Responsibilities *
                    </label>
                    <textarea
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
                        errors.responsibilities
                          ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
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
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Requirements *
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
                        errors.requirements
                          ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                      }`}
                      placeholder="List the required qualifications, skills, and experience..."
                    />
                    {errors.requirements && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.requirements}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Required Skills *
                    </label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddSkill)}
                        className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                        placeholder="Add a skill (e.g. JavaScript)"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium transform hover:scale-105"
                      >
                        Add Skill
                      </button>
                    </div>
                    {errors.skills && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.skills}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 hover:text-blue-800 dark:hover:text-blue-100 transition-colors dark:text-blue-300 text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {formData.skills.length === 0 && (
                        <p className="text-sm dark:text-gray-500 text-gray-400 italic">
                          No skills added yet. Add at least one skill to
                          continue.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                      Benefits & Perks
                    </label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <input
                        type="text"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddBenefit)}
                        className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                        placeholder="Add a benefit (e.g. Health Insurance)"
                      />
                      <button
                        type="button"
                        onClick={handleAddBenefit}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 font-medium transform hover:scale-105"
                      >
                        Add Benefit
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          {benefit}
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(benefit)}
                            className="ml-2 hover:text-green-800 dark:hover:text-green-100 transition-colors dark:text-green-300 text-green-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {formData.benefits.length === 0 && (
                        <p className="text-sm dark:text-gray-500 text-gray-400 italic">
                          No benefits added. Benefits are optional but
                          recommended.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold dark:text-white text-gray-900 mb-6">
                  Review & Submit
                </h2>

                {/* Review Section */}
                <div className="dark:bg-gray-800 bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">
                    Job Information Preview
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Title:
                      </span>
                      <p className="dark:text-white text-gray-900">
                        {formData.title || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Company:
                      </span>
                      <p className="dark:text-white text-gray-900">
                        {formData.company}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Location:
                      </span>
                      <p className="dark:text-white text-gray-900">
                        {formData.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Department:
                      </span>
                      <p className="dark:text-white text-gray-900">
                        {formData.department || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Job Type:
                      </span>
                      <p className="dark:text-white text-gray-900">
                        {formData.type}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Experience Level:
                      </span>
                      <p className="dark:text-white text-gray-900">
                        {formData.experience}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Remote Option:
                      </span>
                      <p className="dark:text-white text-gray-900">
                        {formData.remoteOption}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Salary Range:
                      </span>
                      <p className="dark:text-white text-gray-900">
                        {formData.salaryMin && formData.salaryMax
                          ? `$${formData.salaryMin}k - $${formData.salaryMax}k`
                          : formData.salaryMin
                            ? `From $${formData.salaryMin}k`
                            : formData.salaryMax
                              ? `Up to $${formData.salaryMax}k`
                              : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Description:
                    </span>
                    <p className="dark:text-white text-gray-900 mt-1 whitespace-pre-wrap">
                      {formData.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Responsibilities:
                    </span>
                    <p className="dark:text-white text-gray-900 mt-1 whitespace-pre-wrap">
                      {formData.responsibilities}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Requirements:
                    </span>
                    <p className="dark:text-white text-gray-900 mt-1 whitespace-pre-wrap">
                      {formData.requirements}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Skills Required:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium dark:bg-blue-900 dark:text-blue-200 bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="dark:text-gray-400 text-gray-500 italic">
                          No skills specified
                        </p>
                      )}
                    </div>
                  </div>

                  {formData.benefits.length > 0 && (
                    <div>
                      <span className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Benefits:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.benefits.map((benefit, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium dark:bg-green-900 dark:text-green-200 bg-green-100 text-green-800"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white text-gray-900">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                        Posted By *
                      </label>
                      <input
                        type="text"
                        name="postedBy"
                        value={formData.postedBy}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          errors.postedBy
                            ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
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
                      <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          errors.contactEmail
                            ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
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
                      <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          errors.applicationDeadline
                            ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
                        }`}
                      />
                      {errors.applicationDeadline && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.applicationDeadline}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 bg-white text-gray-900"
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
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                      />
                      <span className="text-sm font-medium dark:text-gray-300 text-gray-700 group-hover:dark:text-gray-200 group-hover:text-gray-800 transition-colors">
                        Feature this job posting
                      </span>
                    </label>
                    <p className="mt-1 text-xs dark:text-gray-500 text-gray-400 ml-8">
                      Featured jobs appear at the top of search results
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex  sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t dark:border-gray-700 border-gray-200 mt-8">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>

              <div className="flex space-x-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6  py-3  rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                  >
                    Next
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSubmit(false)}
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105 ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save as Draft"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmit(true)}
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105 ${
                        isSubmitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Publishing...
                        </span>
                      ) : (
                        "Publish Job"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
