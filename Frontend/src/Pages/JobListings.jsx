import React, { useState, useMemo, useEffect } from "react";
import api from "../api/axios";
import { useAppContext } from "../context/AppProvider";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import { MdDelete } from "react-icons/md";
import Loading from "../Components/Loading/Loading";
import { getStatusColors } from "../assets/dummydata.js";

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [moredetail, setMoredetail] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(8);

  const { currency, candidate, applications, searchRef, token, userRole } =
    useAppContext();

  const id = useLocation();
  const paramsId = String(id.pathname.split("/")[3]);

  useEffect(() => {
    if (applications) {
      const jobIds = applications
        .map((app) => {
          if (app.jobId && app.jobId?._id) {
            return app.jobId._id;
          }
          if (typeof app.jobId === "string") {
            return app.jobId;
          }
          return null;
        })
        .filter(Boolean);

      console.log("Applied Job IDs:", jobIds);
      setAppliedJobs(new Set(jobIds));
    }
  }, [applications]);

  useEffect(() => {
    const fetchJobs = async () => {
      const url = userRole === "company" ? "company" : "candidate";
      try {
        setLoading(true);
        const res = await api.get(`/api/jobs/${url}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          setJobs(res.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (token) {
      fetchJobs();
    }
  }, []);

  const handleApply = async (jobId) => {
    // Prevent applying if already applied or closed
    if (!jobId || appliedJobs.has(jobId)) return;

    const job = jobs.find((j) => j._id === jobId);
    if (job?.status === "Closed") return;

    try {
      setApplyingJobId(jobId);

      const response = await api.post(
        "/api/applications/apply",
        { jobId: jobId, candidateId: candidate._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        alert(response.data.msg);
        //  Add to applied jobs set immediately
        setAppliedJobs((prev) => new Set([...prev, jobId]));
      }
    } catch (error) {
      console.log("error:", error);
      if (error.response?.data?.msg) {
        alert(error.response.data.msg);
      }
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleJobDelete = async (id) => {
    try {
      if (!confirm("Are you sure delete this job ?")) return;
      setLoading(true);
      const response = await api.delete(`/api/jobs/delete/job/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
      setLoading(false);
      fetchJobs();
    } catch (error) {
      console.log(error?.response?.message);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const company = job.company;
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company?.name &&
          company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.location &&
          job.location.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation =
        !locationFilter || job.location.includes(locationFilter);
      const matchesExperience =
        !experienceFilter || job.experienceLevel.includes(experienceFilter);
      const matchesSkill =
        !skillFilter ||
        job.skillsRequired.some((skill) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase()),
        );
      const matchesJobType =
        !jobTypeFilter || job.employmentType === jobTypeFilter;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesExperience &&
        matchesSkill &&
        matchesJobType
      );
    });
  }, [
    searchTerm,
    locationFilter,
    experienceFilter,
    skillFilter,
    jobTypeFilter,
    jobs,
    companies,
  ]);

  // Pagination calculations
  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    locationFilter,
    experienceFilter,
    skillFilter,
    jobTypeFilter,
  ]);

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setExperienceFilter("");
    setSkillFilter("");
    setJobTypeFilter("");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const jobTypeColors = {
    "Full-time":
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "On-site":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Contract:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    Internship:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Remote:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    Closed: "bg-red-300 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  //  Get application status styling
  const getApplicationStatusStyle = (job) => {
    const isApplied = appliedJobs.has(job._id);
    const isClosed = job.status === "Closed";

    if (isClosed) {
      return {
        bgClass: "bg-gray-400 dark:bg-gray-600",
        hoverClass: "",
        cursorClass: "cursor-not-allowed",
        text: "Closed",
        icon: (
          <svg
            className="w-4 h-4 mr-2"
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
        ),
      };
    }

    if (isApplied) {
      return {
        bgClass: "bg-green-600 dark:bg-green-700",
        hoverClass: "",
        cursorClass: "cursor-default",
        text: "Applied",
        icon: (
          <svg
            className="w-4 h-4 mr-2"
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
        ),
      };
    }

    if (applyingJobId === job._id) {
      return {
        bgClass: "bg-blue-400 dark:bg-blue-500",
        hoverClass: "",
        cursorClass: "cursor-wait",
        text: "Applying...",
        icon: (
          <svg
            className="w-4 h-4 mr-2 animate-spin"
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
        ),
      };
    }

    return {
      bgClass: "bg-blue-600 hover:bg-blue-700",
      hoverClass: "transform hover:scale-105",
      cursorClass: "cursor-pointer",
      text: "Apply Now",
      icon: null,
    };
  };

  //Get application status from context data
  const getApplicationStatus = (jobId) => {
    if (!applications) return null;
    const app = applications.find(
      (a) => a.jobId?._id === jobId || a.jobId === jobId,
    );
    return app?.status || null;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {!loading && (
        <div className="py-2 p-2">
          {/* Header */}
          {userRole !== "company" && (
            <Header
              title={"Job Listings"}
              description={`Find your next opportunity from ${jobs.length} available positions`}
            />
          )}

          {/* Applied jobs count indicator */}
          {userRole === "candidate" && appliedJobs.size > 0 && (
            <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-green-700 dark:text-green-300">
                You have applied to <strong>{appliedJobs.size}</strong> job
                {appliedJobs.size > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 mb-6 transition-all duration-200 hover:shadow-md">
            <div
              className={`grid gap-4 ${
                userRole === "company"
                  ? "lg:grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
              }`}
            >
              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    ref={searchRef}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                    placeholder="Job title or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {userRole !== "company" && (
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Location
                  </label>
                  <select
                    id="location"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {[...new Set(jobs.map((job) => job.location))].map(
                      (loc, i) => (
                        <option key={i} value={loc}>
                          {loc}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              )}

              {userRole !== "company" && (
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Experience
                  </label>
                  <select
                    id="experience"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                  >
                    <option value="">All Levels</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Executive">Executive Level</option>
                  </select>
                </div>
              )}

              {userRole !== "company" && (
                <div>
                  <label
                    htmlFor="job-type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Employment Type
                  </label>
                  <select
                    id="job-type"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              )}
            </div>

            {userRole !== "company" && (
              <div className="mt-4">
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Skills
                </label>
                <input
                  type="text"
                  id="skills"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="e.g., React, JavaScript, CSS"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                />
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {currentJobs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-12 text-center transition-all duration-200">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No jobs found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              currentJobs.map((job, index) => {
                const isApplied = appliedJobs.has(job._id);
                const isClosed = job.status === "Closed";
                const isDisabled = isApplied || isClosed;
                const buttonStyle = getApplicationStatusStyle(job);
                const appStatus = getApplicationStatus(job._id);
                const statusColors = getStatusColors(appStatus); // Use new function

                return (
                  <div
                    key={index}
                    className={`dark:bg-gray-800 shadow-sm rounded-xl ${
                      paramsId === job._id
                        ? "border-3 cursor-pointer border-t-0 border-blue-500 bg-gray-100 dark:bg-gray-700"
                        : "bg-white"
                    } overflow-hidden hover:shadow-lg transition-all duration-200 transform ${
                      isApplied ? `ring-1  ${statusColors.ring} ` : ""
                    }`}
                  >
                    {job.isFeatured && !isApplied && (
                      <div className="bg-linear-to-r from-blue-500 to-purple-600 h-1"></div>
                    )}

                    {/*  Applied badge bar - Using statusColors.bar */}
                    {isApplied ? (
                      <div className={`${statusColors.bar} h-1`}></div>
                    ) : (
                      ""
                    )}

                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {job.company ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={job?.company?.logo}
                                alt={job.company.name || "Company"}
                              />
                            ) : (
                              <svg
                                className="h-6 w-6 text-gray-400 dark:text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200">
                                {job.title}
                              </h3>
                              {job.isFeatured && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-linear-to-r from-blue-500 to-purple-600 text-white">
                                  Featured
                                </span>
                              )}
                              {/* ✅ Applied label with status - Using statusColors.badge */}
                              {isApplied && (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors.badge}`}
                                >
                                  {statusColors.icon} {appStatus || "Applied"}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {job?.company?.name || "Unknown Company"}
                            </p>
                          </div>
                        </div>
                        <div
                          style={{ justifyContent: "space-between" }}
                          className="mt-4 gap-2 sm:mt-0 flex sm:gap-50"
                        >
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${jobTypeColors[job?.workMode]}`}
                          >
                            {job.workMode}
                          </span>

                          {userRole === "company" && (
                            <div className="relative right-0 top-0">
                              <button onClick={() => handleJobDelete(job._id)}>
                                <MdDelete className="text-red-600 text-2xl" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg
                            className="shrink-0 mr-2 h-4 w-4 text-gray-400 dark:text-gray-500"
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
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg
                            className="shrink-0 mr-2 h-4 w-4 text-gray-400 dark:text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {job.experienceLevel}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          {job.salaryMin && job.salaryMax
                            ? `${currency}${job.salaryMin}k - ${currency}${job.salaryMax}k`
                            : job.salaryMax
                              ? `${currency}${job.salaryMax}k`
                              : "Salary not specified"}
                        </div>

                        <div className="mt-4 sm:mt-0">
                          <span
                            title={job.status}
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${jobTypeColors[job?.status] || jobTypeColors["Full-time"]}`}
                          >
                            {job.status}
                          </span>
                        </div>
                      </div>

                      {/* ✅ Show match score if applied */}
                      {isApplied && applications?.data?.data && (
                        <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                              Resume Match Score
                            </span>
                            <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                              {applications.data.data.find(
                                (a) =>
                                  a.jobId?._id === job._id ||
                                  a.jobId === job._id,
                              )?.score || 0}
                              %
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {job.description}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skillsRequired.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                        <p
                          className="text-gray-400 cursor-pointer"
                          onClick={() =>
                            setMoredetail((pre) =>
                              pre === job._id ? null : job._id,
                            )
                          }
                        >
                          ...
                        </p>
                      </div>
                      {job._id === moredetail && (
                        <div className="mt-4">
                          <p className="text-gray-400 dark:text-gray-500">
                            Benefits
                          </p>
                          <div className="mt-2">
                            {job.benefits.map((benifit, index) => (
                              <li
                                key={index}
                                className="relative left-4 items-center rounded-full text-xs font-medium text-gray-800 dark:text-gray-300 transition-colors duration-200"
                              >
                                <span>{benifit}</span>
                              </li>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                          <svg
                            className="shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500"
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
                          Posted {formatDate(job?.createdAt)}
                        </div>
                        {userRole !== "company" && (
                          <>
                            {/* <p>{formatDate(applications[index].updatedAt)}</p> */}
                            <div className="flex space-x-3">
                              <button
                                onClick={() => toggleSaveJob(job._id)}
                                className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                  savedJobs.has(job._id)
                                    ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400"
                                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                }`}
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill={
                                    savedJobs.has(job._id)
                                      ? "currentColor"
                                      : "none"
                                  }
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                  />
                                </svg>
                                {savedJobs.has(job._id) ? "Saved" : "Save Job"}
                              </button>

                              {/*  Apply Button */}
                              <button
                                onClick={() =>
                                  !isDisabled && handleApply(job._id)
                                }
                                disabled={isDisabled}
                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white ${buttonStyle.bgClass} ${buttonStyle.hoverClass} ${buttonStyle.cursorClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
                                title={
                                  isApplied
                                    ? `You have already applied - Status: ${appStatus || "Applied"}`
                                    : isClosed
                                      ? "This job is no longer accepting applications"
                                      : "Apply to this job"
                                }
                              >
                                {buttonStyle.icon}
                                {buttonStyle.text}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl px-6 py-4 p-3 mt-6 transition-all duration-200 hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">
                      {totalJobs === 0 ? 0 : indexOfFirstJob + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastJob, totalJobs)}
                    </span>{" "}
                    of <span className="font-medium">{totalJobs}</span> results
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            currentPage === page
                              ? "z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400 border"
                              : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    Next
                    <svg
                      className="h-4 w-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {loading && <Loading detail={"loading.."} />}
    </div>
  );
};

export default JobListings;
