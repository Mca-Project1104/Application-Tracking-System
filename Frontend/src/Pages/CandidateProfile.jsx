import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";

const CandidateProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("resume");

  const { navigate } = useAppContext();

  // In a real app, you would fetch the candidate data based on the ID
  const candidate = {
    id: id,
    name: "Jay Bhoi",
    position: "Senior Frontend Developer",
    email: "jaydoe@example.com",
    phone: "(555) 123-4567",
    location: "-",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    portfolio: "-",
    summary:
      "Experienced frontend developer with 5+ years of experience building responsive web applications. Proficient in React, JavaScript, and modern CSS frameworks.",
    skills: [
      { name: "React", level: "Expert" },
      { name: "JavaScript", level: "Expert" },
      { name: "TypeScript", level: "Advanced" },
      { name: "HTML/CSS", level: "Expert" },
      { name: "Node.js", level: "Intermediate" },
      { name: "Git", level: "Advanced" },
      { name: "REST API", level: "Advanced" },
      { name: "GraphQL", level: "Intermediate" },
    ],
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "Tech Innovations Inc.",
        location: "San Francisco, CA",
        startDate: "2020-01",
        endDate: "Present",
        description:
          "Led the development of the company's flagship product using React and TypeScript. Mentored junior developers and implemented best practices for code quality and performance.",
      },
      {
        title: "Frontend Developer",
        company: "WebSolutions",
        location: "New York, NY",
        startDate: "2018-06",
        endDate: "2019-12",
        description:
          "Developed responsive web applications using modern JavaScript frameworks. Collaborated with UX designers to implement pixel-perfect designs.",
      },
      {
        title: "Junior Developer",
        company: "StartUpXYZ",
        location: "Boston, MA",
        startDate: "2016-07",
        endDate: "2018-05",
        description:
          "Assisted in the development of various client projects. Gained experience in full-stack development and agile methodologies.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        location: "Berkeley, CA",
        startDate: "2012-09",
        endDate: "2016-05",
        description:
          "Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems.",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2022-03",
        credentialId: "AWS-DEV-123456",
      },
      {
        name: "React Developer Certification",
        issuer: "Meta",
        date: "2021-08",
        credentialId: "REACT-789012",
      },
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description:
          "Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented features like user authentication, payment processing, and inventory management.",
        technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
        link: "https://github.com/johndoe/ecommerce-platform",
      },
      {
        name: "Task Management App",
        description:
          "Developed a task management application with drag-and-drop functionality, real-time updates, and team collaboration features.",
        technologies: ["React", "Firebase", "Material-UI"],
        link: "https://github.com/johndoe/task-manager",
      },
    ],
    score: 85,
    status: "interview",
    appliedDate: "2023-06-10",
    avatar: "https://picsum.photos/seed/user1/200/200.jpg",
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

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6 mt-15 min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center">
            <img
              className="h-20 w-20 rounded-full"
              src={candidate.avatar}
              alt={candidate.name}
            />
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {candidate.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {candidate.position}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}
                >
                  {candidate.status.charAt(0).toUpperCase() +
                    candidate.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Applied on {formatDate(candidate.appliedDate)}
                </span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1">
                    Score:
                  </span>
                  <span
                    className={`text-lg font-bold ${getScoreColor(candidate.score)}`}
                  >
                    {candidate.score}/100
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Download Resume
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
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
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {candidate.summary}
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
                      {skill.name}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}
                    >
                      {skill.level}
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
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Education
              </h3>
              {candidate.education.map((edu, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 dark:border-blue-400 pl-4"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {edu.degree}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {edu.school} • {edu.location}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {edu.description}
                  </p>
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
