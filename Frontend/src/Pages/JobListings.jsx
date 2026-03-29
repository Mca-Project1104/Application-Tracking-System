import React, { useState, useMemo } from "react";

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "5+ years",
      salary: "₹120k - ₹150k",
      description:
        "We are looking for an experienced Frontend Developer to join our team and help build cutting-edge web applications using modern technologies.",
      skills: ["React", "TypeScript", "Node.js", "CSS"],
      posted: "2 days ago",
      logo: "https://picsum.photos/seed/company1/40/40.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "React Developer",
      company: "StartupXYZ",
      location: "New York, NY",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹100k - ₹130k",
      description:
        "Join our fast-growing startup as a React Developer and work on innovative products that will shape the future.",
      skills: ["React", "JavaScript", "HTML", "CSS"],
      posted: "5 days ago",
      logo: "https://picsum.photos/seed/company2/40/40.jpg",
      featured: false,
    },
    {
      id: 3,
      title: "Frontend Engineer",
      company: "WebSolutions",
      location: "Remote",
      type: "Contract",
      experience: "2-4 years",
      salary: "₹80k - ₹100k",
      description:
        "We are seeking a talented Frontend Engineer to work on our client projects and deliver exceptional user experiences.",
      skills: ["Vue.js", "JavaScript", "CSS", "Sass"],
      posted: "1 week ago",
      logo: "https://picsum.photos/seed/company3/40/40.jpg",
      featured: false,
    },
    {
      id: 4,
      title: "UI/UX Designer",
      company: "Creative Agency",
      location: "Los Angeles, CA",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹90k - ₹120k",
      description:
        "Looking for a creative UI/UX Designer to join our design team and create beautiful, intuitive interfaces.",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      posted: "3 days ago",
      logo: "https://picsum.photos/seed/company4/40/40.jpg",
      featured: true,
    },
    {
      id: 5,
      title: "Full Stack Developer",
      company: "TechCorp",
      location: "Seattle, WA",
      type: "Full-time",
      experience: "4+ years",
      salary: "₹110k - ₹140k",
      description:
        "We are looking for a Full Stack Developer to help build our next-generation platform using modern tech stack.",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      posted: "1 day ago",
      logo: "https://picsum.photos/seed/company5/40/40.jpg",
      featured: false,
    },
    {
      id: 6,
      title: "Full Stak",
      company: "Facebook",
      location: "Anand",
      type: "Full-time",
      experience: "Entry-level",
      salary: "₹12k - ₹18k",
      description: "qwdas",
      skills: ["qwf", "qw", "qwqw"],
      posted: "Just now",
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
      featured: true,
    },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        !locationFilter || job.location.includes(locationFilter);
      const matchesExperience =
        !experienceFilter || job.experience.includes(experienceFilter);
      const matchesSkill =
        !skillFilter ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase()),
        );
      const matchesJobType = !jobTypeFilter || job.type === jobTypeFilter;

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

  const jobTypeColors = {
    "Full-time":
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "Part-time":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Contract:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    Internship:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-1 py-8">
        {/* Header */}
        <div className="bg-white mt-4 dark:bg-gray-800 shadow-sm rounded-xl p-6 mb-6 transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Job Listings
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Find your next opportunity from {jobs.length} available
                positions
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {filteredJobs.length} Results
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 mb-6 transition-all duration-200 hover:shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="Job title or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

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
                <option value="San Francisco">San Francisco</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Seattle">Seattle</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

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
                <option value="0-2 years">Entry Level (0-2 years)</option>
                <option value="2-4 years">Mid Level (2-4 years)</option>
                <option value="3-5 years">Mid-Senior (3-5 years)</option>
                <option value="5+ years">Senior (5+ years)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="job-type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Job Type
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
          </div>

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
          {filteredJobs.length === 0 ? (
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
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                {job.featured && (
                  <div className="bg-linear-to-r from-blue-500 to-purple-600 h-1"></div>
                )}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start space-x-4">
                      <img
                        className="h-12 w-12 rounded-lg object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                        src={job.logo}
                        alt={job.company}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200">
                            {job.title}
                          </h3>
                          {job.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-linear-to-r from-blue-500 to-purple-600 text-white">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {job.company}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${jobTypeColors[job.type]}`}
                      >
                        {job.type}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      {job.experience}
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {job.salary}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

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
                      Posted {job.posted}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                          savedJobs.has(job.id)
                            ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400"
                            : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill={savedJobs.has(job.id) ? "currentColor" : "none"}
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
                        {savedJobs.has(job.id) ? "Saved" : "Save Job"}
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl px-6 py-4 mt-6 transition-all duration-200 hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredJobs.length}</span> of{" "}
                  <span className="font-medium">{jobs.length}</span> results
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200">
                  <svg
                    className="h-4 w-4 mr-1"
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
                <button className="relative inline-flex items-center px-4 py-2 rounded-lg border border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-sm font-medium text-blue-600 dark:text-blue-400 transition-all duration-200">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200">
                  3
                </button>
                <button className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200">
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
    </div>
  );
};

export default JobListings;
