import { FaUser } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { MdPostAdd } from "react-icons/md";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { MdWorkHistory } from "react-icons/md";

export const NAVIGATION = [
  {
    name: "Dashboard",
    id: "dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Users",
    id: "users",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    name: "Subscriptions",
    id: "subscriptions",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
];

export const candidate = [
  {
    id: 1,
    name: "jay Bhoi",
    position: "Frontend Developer",
    score: 85,
    skills: ["React", "JavaScript", "CSS"],
    status: "applied",
    avatar: "https://picsum.photos/seed/user1/40/40.jpg",
  },
  {
    id: 2,
    name: "Harsh Patel",
    position: "UI/UX Designer",
    score: 92,
    skills: ["Figma", "Adobe XD", "Sketch"],
    status: "shortlisted",
    avatar: "https://picsum.photos/seed/user2/40/40.jpg",
  },
  {
    id: 3,
    name: "Prem Patel",
    position: "Backend Developer",
    score: 78,
    skills: ["Node.js", "MongoDB", "Express"],
    status: "interview",
    avatar: "https://picsum.photos/seed/user3/40/40.jpg",
  },
  {
    id: 4,
    name: "Om Tridev",
    position: "Product Manager",
    score: 88,
    skills: ["Agile", "Scrum", "JIRA"],
    status: "selected",
    avatar: "https://picsum.photos/seed/user4/40/40.jpg",
  },
  {
    id: 5,
    name: "Om Meshava",
    position: "Frontend Developer",
    score: 72,
    skills: ["Vue.js", "JavaScript", "HTML"],
    status: "rejected",
    avatar: "https://picsum.photos/seed/user5/40/40.jpg",
  },
  {
    id: 6,
    name: "Sarans bhoi",
    position: "Data Analyst",
    score: 90,
    skills: ["Python", "SQL", "Tableau"],
    status: "applied",
    avatar: "https://picsum.photos/seed/user6/40/40.jpg",
  },
  {
    id: 7,
    name: "Brijesh Patel",
    position: "DevOps Engineer",
    score: 82,
    skills: ["Docker", "Kubernetes", "AWS"],
    status: "shortlisted",
    avatar: "https://picsum.photos/seed/user7/40/40.jpg",
  },
  {
    id: 8,
    name: "Jayant parmar",
    position: "Frontend Developer",
    score: 95,
    skills: ["React", "TypeScript", "Node.js"],
    status: "interview",
    avatar: "https://picsum.photos/seed/user8/40/40.jpg",
  },
];

export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Candidate",
    status: "Active",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Alice Smith",
    email: "alice.smith@example.com",
    role: "Candidate",
    status: "Active",
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "Candidate",
    status: "Inactive",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Recruiter",
    status: "Active",
    joinDate: "2023-01-25",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "Recruiter",
    status: "Active",
    joinDate: "2023-04-05",
  },
];

export const jobsData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    postedBy: "Emily Davis",
    status: "Active",
    postedDate: "2023-06-01",
    applicants: 42,
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Creative Agency",
    postedBy: "Emily Davis",
    status: "Active",
    postedDate: "2023-05-28",
    applicants: 35,
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "WebSolutions",
    postedBy: "Michael Wilson",
    status: "Paused",
    postedDate: "2023-05-15",
    applicants: 28,
  },
  {
    id: 4,
    title: "Product Manager",
    company: "TechCorp",
    postedBy: "Michael Wilson",
    status: "Active",
    postedDate: "2023-05-10",
    applicants: 24,
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "DataDriven",
    postedBy: "Emily Davis",
    status: "Closed",
    postedDate: "2023-04-20",
    applicants: 18,
  },
];

//
export const candidateLinks = [
  {
    name: "Dashboard",
    path: "/candidate",
    icon: FaHome,
  },
  {
    name: "Job Listings",
    path: "/candidate/jobs",
    icon: LiaClipboardListSolid,
  },
  {
    name: "Upload Resume",
    path: "/candidate/resume_analyzer",
    icon: MdOutlineDocumentScanner,
  },
  {
    name: "Applied Jobs",
    path: "/candidate/history",
    icon: MdWorkHistory,
  },
  {
    name: "Profile",
    path: "/candidate/profile",
    icon: FaUser,
  },
];

export const companyLinks = [
  {
    name: "Dashboard",
    path: "/company",
    icon: FaHome,
  },
  {
    name: "Post a Job",
    path: "/company/post_job",
    icon: MdPostAdd,
  },
  {
    name: "Job Postings",
    path: "/company/jobs",
    icon: BsJournalBookmarkFill,
  },
  {
    name: "Hiring Pipeline",
    path: "/company/hiring-pipeline",
    icon: FaUsersViewfinder,
  },
];

export const adminLinks = [
  {
    name: "Admin Panel",
    path: "/admin",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
];

export const candidateFlow = {
  data: [
    {
      step: 1,
      heading: "Create Your Profile",
      description:
        "Build a rich profile, upload your resume, and showcase your skills.",
    },
    {
      step: 2,
      heading: "Get Matched",
      description:
        "Our smart system suggests jobs that are a perfect fit for your experience and goals. We ensure you discover roles that truly match your skills.",
    },
    {
      step: 3,
      heading: "Apply & Track",
      description:
        "Apply with one click and track your application's progress in real-time.",
    },
  ],
};

export const recruiterFlow = {
  data: [
    {
      step: 1,
      heading: "Post a Job",
      description:
        "Create a detailed job post and publish it to millions of candidates with one click.",
    },
    {
      step: 2,
      heading: "Source & Screen",
      description:
        "Our system screens and ranks applicants, so you can focus on the top talent. Experience a streamlined hiring process that saves time and effort.",
    },
    {
      step: 3,
      heading: "Collaborate & Hire",
      description:
        "Manage interviews, gather feedback, and send offers—all in one platform.",
    },
  ],
};

export const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "5+ years",
    salary: "₹120k - ₹150k",
    description:
      "We are looking for an experienced React Developer to join our growing team. You will be responsible for building and maintaining web applications using React, TypeScript, and modern web technologies.",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    posted: "2 days ago",
    logo: "https://picsum.photos/seed/company1/40/40.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DesignHub",
    location: "New York, NY",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹100k - ₹130k",
    description:
      "Join our creative team as a UX Designer. You'll work on various projects, creating user-centered designs and conducting user research to improve our products.",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
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
    title: "Full Stack",
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
  // Add more jobs for pagination demo
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 7 + i,
    title: `Software Engineer ${i + 1}`,
    company: `Company ${i + 6}`,
    location: ["Remote", "San Francisco, CA", "New York, NY", "Seattle, WA"][
      i % 4
    ],
    type: ["Full-time", "Part-time", "Contract", "Internship"][i % 4],
    experience: ["Entry-level", "2-4 years", "3-5 years", "5+ years"][i % 4],
    salary: `₹${60 + i * 10}k - ₹${80 + i * 10}k`,
    description: `Job description for position ${i + 1}. We are looking for talented individuals to join our team.`,
    skills: ["React", "Node.js", "Python", "AWS"].slice(0, (i % 3) + 2),
    posted: `${i + 1} days ago`,
    logo: `https://picsum.photos/seed/company${7 + i}/40/40.jpg`,
    featured: i % 3 === 0,
  })),
];

export const dummyCandidate = {
  _id: "69cbff64216e377c6661ef99",
  name: "John Doe",
  position: "Frontend Developer",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  location: "Ahmedabad, India",
  linkedin: "linkedin.com/in/johndoe",
  github: "github.com/johndoe",
  portfolio: "johndoe.dev",
  summary:
    "Passionate frontend developer with 3+ years of experience building responsive web applications using React and modern JavaScript.",

  status: "shortlisted",
  appliedDate: "2024-06-15",
  score: 85,

  profile_image: "",

  skills: [
    { name: "React", level: "Advanced" },
    { name: "JavaScript", level: "Advanced" },
    { name: "HTML/CSS", level: "Expert" },
    { name: "Node.js", level: "Intermediate" },
    { name: "Tailwind CSS", level: "Advanced" },
  ],

  experience: [
    {
      title: "Frontend Developer",
      company: "Tech Solutions Pvt Ltd",
      location: "Ahmedabad",
      startDate: "2022-01-01",
      endDate: "Present",
      description:
        "Developed and maintained responsive web applications using React, improving performance by 30%.",
    },
    {
      title: "Junior Developer",
      company: "WebSoft",
      location: "Surat",
      startDate: "2020-06-01",
      endDate: "2021-12-31",
      description:
        "Worked on UI components and fixed bugs, contributing to improved user experience.",
    },
  ],

  education: [
    {
      degree: "B.Tech in Computer Engineering",
      school: "Gujarat Technological University",
      location: "Gujarat",
      startDate: "2016-06-01",
      endDate: "2020-05-30",
      description: "Graduated with First Class Distinction.",
    },
  ],

  projects: [
    {
      name: "Job Portal App",
      link: "https://github.com/johndoe/job-portal",
      description:
        "A full-stack job portal application with authentication, resume upload, and admin dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Tailwind"],
    },
    {
      name: "E-commerce Website",
      link: "https://johndoe.dev/ecommerce",
      description:
        "Built a fully responsive e-commerce UI with cart and payment integration.",
      technologies: ["React", "Redux", "Stripe"],
    },
  ],

  certifications: [
    {
      name: "React Developer Certification",
      issuer: "Coursera",
      date: "2023-08-10",
      credentialId: "ABC123XYZ",
    },
    {
      name: "JavaScript Advanced",
      issuer: "Udemy",
      date: "2022-05-15",
      credentialId: "JS456DEF",
    },
  ],
};

export const testimonials = [
  {
    name: "Alex Johnson",
    role: "Software Engineer",
    type: "candidate",
    content:
      "Found my dream job in just 3 weeks! The matching technology was incredibly accurate.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Sarah Chen",
    role: "HR Director at TechCorp",
    type: "recruiter",
    content:
      "Cut our time-to-hire by 50%. The platform is a game-changer for recruitment.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Maria Garcia",
    role: "Marketing Manager",
    type: "candidate",
    content:
      "The direct chat feature with recruiters made all the difference in my job search.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Michael Rodriguez",
    role: "Founder at StartupX",
    type: "recruiter",
    content:
      "As a startup, we need efficiency. This platform is our hiring secret weapon.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export const PLANS = {
  FREE: {
    name: "FREE",
    price: 0,
    jobLimit: 3,
    features: [
      "Up to 3 job postings",
      "Basic applicant tracking",
      "Email notifications",
      "7-day job listing duration",
    ],
    color: "gray",
    bgColor: "bg-gray-100 dark:bg-gray-700",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-300 dark:border-gray-600",
    badgeColor: "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300",
  },
  BASIC: {
    name: "BASIC",
    price: 199,
    jobLimit: 15,
    features: [
      "Up to 15 job postings",
      "Advanced applicant tracking",
      "Priority email support",
      "30-day job listing duration",
      "Company branding",
      "Resume downloads",
    ],
    color: "blue",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    badgeColor:
      "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  },
  PRO: {
    name: "PRO",
    price: 299,
    jobLimit: 50,
    features: [
      "Up to 50 job postings",
      "Advanced resume screening", // Changed from AI-powered
      "Dedicated account manager",
      "60-day job listing duration",
      "Advanced analytics",
      "Team collaboration",
      "Custom application forms",
    ],
    color: "purple",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
    badgeColor:
      "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  },
};

export const pricingPlans = [
  {
    name: "Starter",
    subtitle: "For small teams getting started",
    price: { monthly: 0, yearly: 0 },
    icon: "🚀",
    color: "from-gray-500 to-gray-600",
    borderColor: "border-gray-200 dark:border-gray-700",
    badge: null,
    features: [
      { text: "Up to 3 job postings", included: true },
      { text: "Basic applicant tracking", included: true },
      { text: "Basic candidate profile view", included: true },
      { text: "Manual screening", included: true },
    ],
    cta: "Get Started Free",
    ctaStyle:
      "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600",
  },
  {
    name: "Basic",
    subtitle: "For growing companies",
    price: { monthly: 299, yearly: 240 },
    icon: "⚡",
    color: "from-blue-600 to-indigo-600",
    borderColor: "border-blue-200 dark:border-blue-800",
    badge: "Most Popular",
    popular: true,
    features: [
      { text: "Up to 15 job postings", included: true },
      { text: "Full pipeline management", included: true },
      { text: "Email notifications", included: true },
      { text: "Priority email support", included: true },
    ],
    cta: "Start Pro Trial",
    ctaStyle:
      "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30",
  },
  {
    name: "Prime",
    subtitle: "For large organizations",
    price: { monthly: 799, yearly: 639 },
    icon: "🏢",
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-200 dark:border-amber-800",
    badge: "Best Value",
    features: [
      { text: "Full pipeline management", included: true },
      { text: "Advanced hiring analytics", included: true },
      { text: "Complete candidate profiles", included: true },
      { text: "Interview scheduling", included: true },
      { text: "Email notifications", included: true },
    ],
    cta: "Contact Sales",
    ctaStyle:
      "bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/30",
  },
];

export const getpipelineColor = (name) => {
  if (name === "applied")
    return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:border-2 border-blue-400";
  else if (name === "screening")
    return "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 hover:border-2 border-yellow-400";
  else if (name === "interview")
    return "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 hover:border-2 border-purple-400";
  else if (name === "hired")
    return "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 hover:border-2 border-green-400";
  else if (name === "shortlisted")
    return "bg-green-50 text-green-400 dark:bg-green-900/15 dark:text-green-400 hover:border-2 border-green-600";
  else if (name === "rejected")
    return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:border-2 border-red-400";
  else
    return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:border-2 border-red-400";
};

export const getStatusColors = (status) => {
  if (!status)
    return {
      badge:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
      bar: "bg-gray-400",
      ring: "ring-gray-200 dark:ring-gray-800",
      icon: "⏳",
    };

  switch (status.toLowerCase()) {
    case "hired":
      return {
        badge:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800",
        bar: "bg-green-500",
        ring: "ring-green-200 dark:ring-green-800",
        icon: "✓",
      };
    case "rejected":
      return {
        badge:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800",
        bar: "bg-red-500",
        ring: "ring-red-200 dark:ring-red-800",
        icon: "✕",
      };
    case "interview":
      return {
        badge:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800",
        bar: "bg-purple-500",
        ring: "ring-purple-200 dark:ring-purple-800",
        icon: "📅",
      };
    case "shortlisted":
      return {
        badge:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
        bar: "bg-blue-500",
        ring: "ring-blue-200 dark:ring-blue-800",
        icon: "★",
      };
    default:
      return {
        badge:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800",
        bar: "bg-yellow-500",
        ring: "ring-yellow-200 dark:ring-yellow-800",
        icon: "⏳",
      };
  }
};

export const getStatusConfig = (status) => {
  const configs = {
    applied: {
      bg: "bg-blue-500",
      lightBg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      headerBg: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    shortlisted: {
      bg: "bg-amber-500",
      lightBg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      headerBg: "bg-gradient-to-r from-amber-500 to-amber-600",
    },
    interview: {
      bg: "bg-purple-400",
      lightBg: "bg-purple-50 dark:bg-purple-200/20",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-600",
      headerBg: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    selected: {
      bg: "bg-green-500",
      lightBg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
      headerBg: "bg-gradient-to-r from-green-500 to-green-600",
    },
    rejected: {
      bg: "bg-red-500",
      lightBg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      headerBg: "bg-gradient-to-r from-red-500 to-red-600",
    },
  };
  return configs[status] || configs.applied;
};

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getSvgIcons = (state) => {
  if (state === "totalApplicants")
    return "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z";
  else if (state === "activeJobs")
    return "M9 6V4h6v2m-9 0h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z";
  else if (state === "shortlisted")
    return "M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z";
  else if (state === "interviewsToday")
    return "M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z";
  else {
    return "";
  }
};

export const getPlanStyles = (plan) => {
  switch (plan) {
    case "PRO":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "BASIC":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "FREE":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
  }
};

export const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "hired":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "interview":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "shortlisted":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
  }
};

export const jobTypeColors = {
  "Full-time":
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "On-site": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Contract:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Hybrid:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Internship:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Remote:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  Closed: "bg-red-300 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};
