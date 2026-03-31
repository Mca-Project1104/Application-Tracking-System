import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppProvider";
import Company from "./CompanyStory.jsx";
import { candidateFlow, recruiterFlow } from "../assets/dummydata.js";

function App() {
  // State for Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const { navigate } = useAppContext();

  // State for toggling between Candidate and Recruiter benefits
  const [userType, setUserType] = useState("candidate");

  // Effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Data for sections
  const candidateBenefits = [
    {
      icon: "🎯",
      title: "Get Matched, Not Lost",
      description:
        "Our AI matches your profile to jobs where you'll truly excel. No more black hole applications.",
    },
    {
      icon: "📈",
      title: "Track Your Progress",
      description:
        "See real-time updates on your application status, from 'Applied' to 'Interview'.",
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description:
        "Chat directly with recruiters and get all your questions answered in one place.",
    },
    {
      icon: "🔒",
      title: "Profile Privacy",
      description:
        "Control who sees your profile. Apply confidentially to your current employer.",
    },
  ];

  const recruiterBenefits = [
    {
      icon: "🤖",
      title: "AI-Powered Screening",
      description:
        "Automatically rank candidates based on skills and experience. Save hours of manual work.",
    },
    {
      icon: "👥",
      title: "Team Collaboration",
      description:
        "Share feedback, rate candidates, and make hiring decisions together, seamlessly.",
    },
    {
      icon: "📊",
      title: "Powerful Analytics",
      description:
        "Understand your hiring funnel with data-driven insights and optimize your process.",
    },
    {
      icon: "⚡",
      title: "Automate Your Workflow",
      description:
        "Schedule interviews, send emails, and move candidates through stages with one click.",
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Software Engineer",
      type: "candidate",
      content:
        "I found my dream job in 3 weeks! The matching was spot on, and I loved seeing my application status update in real-time.",
    },
    {
      name: "Sarah Chen",
      role: "HR Director at TechCorp",
      type: "recruiter",
      content:
        "HireFlow cut our time-to-hire by 50%. The AI screening is a game-changer for our small team.",
    },
    {
      name: "Maria Garcia",
      role: "Marketing Manager",
      type: "candidate",
      content:
        "The best job search platform I've used. The direct chat feature with recruiters made all the difference.",
    },
    {
      name: "Michael Rodriguez",
      role: "Founder at StartupX",
      type: "recruiter",
      content:
        "As a startup, we need to be efficient. This platform is our hiring secret weapon.",
    },
  ];

  const trustedByLogos = [
    "TechCorp",
    "Innovate Inc.",
    "Global Solutions",
    "NextGen",
    "DataDrive",
    "CloudBase",
  ];

  return (
    <div className="bg-gray-50  dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a
            href="#"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            HireFlow
          </a>
          <div className="hidden md:flex space-x-6 items-center">
            <a
              href="#how-it-works"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              How It Works
            </a>
            <a
              href="#why-choose-us"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Why Choose Us
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center space-x-5">
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Log In
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* ===== HERO SECTION ===== */}
        <section className="relative bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
              The Right{" "}
              <span className="text-blue-600 dark:text-blue-400">Talent</span>,
              Meets the Right{" "}
              <span className="text-green-600 dark:text-green-400">
                Opportunity
              </span>
              .
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              HireFlow is the modern platform connecting top candidates with
              leading companies. Whether you're hiring or looking for your next
              role, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#candidate-cta"
                className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300 shadow-lg text-center"
              >
                I'm Looking for a Job
              </a>
              <a
                href="#recruiter-cta"
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg text-center"
              >
                I'm Hiring Talent
              </a>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
        </section>

        {/* ===== HOW IT WORKS SECTION (SPLIT VIEW) ===== */}
        <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How It Works for You
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Candidate Flow */}
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
                  For Candidates
                </h3>

                <div className="space-y-6">
                  {candidateFlow?.data.map((item, index) => (
                    <div key={index + 1} className="flex items-start text-left">
                      <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold mr-4">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.heading}</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recruiter Flow */}
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                  For Recruiters
                </h3>
                <div className="space-y-6">
                  {recruiterFlow.data.map((item, index) => (
                    <div key={index} className="flex items-start text-left">
                      <div
                        
                        className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold mr-4"
                      >
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.heading}</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHY CHOOSE US SECTION (TOGGLE) ===== */}
        <section
          id="why-choose-us"
          className="py-20 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Why Choose HireFlow?
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              See the benefits tailored just for you.
            </p>

            {/* Toggle Buttons */}
            <div className="flex justify-center mb-12">
              <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setUserType("candidate")}
                  className={`px-6 py-2 rounded-md font-semibold transition-colors ${userType === "candidate" ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-300"}`}
                >
                  For Candidates
                </button>
                <button
                  onClick={() => setUserType("recruiter")}
                  className={`px-6 py-2 rounded-md font-semibold transition-colors ${userType === "recruiter" ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300"}`}
                >
                  For Recruiters
                </button>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(userType === "candidate"
                ? candidateBenefits
                : recruiterBenefits
              ).map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS SECTION ===== */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl"
                >
                  <p className="text-lg italic mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block ${testimonial.type === "candidate" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}`}
                    >
                      {testimonial.type === "candidate"
                        ? "Candidate"
                        : "Recruiter"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TRUSTED BY SECTION ===== */}
        <section className="py-12 w-full bg-gray-50 dark:bg-gray-700 mb-10">
          <div className="container mx-auto text-center">
            <p className="text-gray-600 dark:text-white mb-6 text-2xl">
              Trusted by leading companies worldwide
            </p>

            <div className="flex flex-wrap justify-center items-center space-x-8 md:space-x-12">
              <Company />
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA SECTION ===== */}
        {/* <section
          id="cta"
          className="py-20 bg-linear-to-r from-blue-600 to-green-600"
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of candidates and recruiters finding their perfect
              match.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#"
                id="candidate-cta"
                className="w-full sm:w-auto bg-white text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg text-center"
              >
                Find Your Dream Job
              </a>
              <a
                href="#"
                id="recruiter-cta"
                className="w-full sm:w-auto bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg text-center"
              >
                Start Hiring Today
              </a>
            </div>
          </div>
        </section> */}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 dark:bg-gray-800 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">HireFlow</h3>
              <p>Connecting talent with opportunity.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                For Candidates
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Career Advice
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Resume Builder
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                For Recruiters
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Recruiting Solutions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} HireFlow. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
