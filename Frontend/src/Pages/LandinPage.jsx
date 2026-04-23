import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppProvider.jsx";
import Company from "../Components/company/CompanyStory.jsx";
import { HiArrowSmallUp } from "react-icons/hi2";
import {
  candidateFlow,
  recruiterFlow,
  pricingPlans,
} from "../assets/dummydata.js";
import Footer from "../Components/LandingPage/Footer.jsx";
import { WineOff } from "lucide-react";

function LandingPage() {
  const { navigate, HIREFLOWLOGO, currency } = useAppContext();
  const [userType, setUserType] = useState("candidate");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isbutton, setIsButton] = useState(false);
  const { theme, setTheme } = useAppContext();

  const handleTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsButton(true);
      } else {
        setIsButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const candidateBenefits = [
    {
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
      title: "Smart Job Matching",
      description:
        "Match your skills and preferences with perfect opportunities.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Real-time Tracking",
      description:
        "Monitor your application status from submission to interview scheduling.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Privacy Control",
      description:
        "Keep your job search confidential with advanced privacy settings.",
    },
  ];

  const recruiterBenefits = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Team Collaboration",
      description:
        "Share feedback and make decisions together with your hiring team.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
          />
        </svg>
      ),
      title: "Advanced Analytics",
      description:
        "Get insights into your hiring funnel and optimize your recruitment strategy.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Workflow Automation",
      description:
        "Automate repetitive tasks and focus on what matters most - finding talent.",
    },
  ];

  return (
    <div className="min-h-screen  bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* ===== NAVBAR ===== */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-all duration-300"
        data-aos="fade-down"
        data-aos-duration="100"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8  rounded-lg flex items-center justify-center">
              <img
                src={HIREFLOWLOGO}
                alt=""
                className="dark:bg-gray-900 bg-white rounded"
              />
            </div>
            <span
              className="text-2xl font-bold bg-linear-to-r from-blue-800 to-green-800 bg-clip-text text-transparent"
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              HireFlow
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              data-aos="fade-down"
              data-aos-duration="800"
              data-aos-delay="100"
            >
              How It Works
            </a>
            <a
              href="#why-choose-us"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              data-aos="fade-up "
              data-aos-duration="800"
              data-aos-delay="200"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              data-aos="fade-down"
              data-aos-duration="800"
              data-aos-delay="300"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setTheme(theme === "true" ? "false" : "true")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="400"
            >
              {theme === "true" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="500"
            >
              Log In
            </button>
          </div>
        </div>
      </nav>

      {isbutton && (
        <div
          data-aos="fade-up"
          data-duration="100"
          className="fixed bottom-5 right-4 z-50 bg-blue-600 rounded-full delay-500   shadow-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
        >
          <button
            onClick={() => handleTop()}
            className="text-2xl rounded-full text-white p-2 font-medium"
          >
            <HiArrowSmallUp />
          </button>
        </div>
      )}

      <div className="h-18.25]"></div>

      <main>
        {/* ===== HERO SECTION ===== */}
        <section
          className="relative top-6 overflow-hidden bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 sm:py-16 md:py-20 lg:py-24"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          <div
            className="absolute inset-0 bg-[linear-linear(rgba(0,0,0,.03)_1px,transparent_1px),linear-linear(90deg,rgba(0,0,0,.03)_1px,transparent_1px)] bg-size[20px_20px] dark:opacity-10"
            data-aos="fade-in"
            data-aos-duration="2000"
            data-aos-delay="500"
          ></div>
          <div className=" mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-xl mx-auto">
              <div
                className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6"
                data-aos="fade-down"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse "></span>
                Now hiring: 5,000+ opportunities
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
                <span
                  data-aos="zoom-in-right"
                  data-aos-duration="1000"
                  data-aos-delay="300"
                  data-aos-easing="ease-out-cubic"
                  className="block"
                >
                  The Right
                </span>
                <span
                  data-aos="zoom-in-left"
                  data-aos-duration="1000"
                  data-aos-delay="500"
                  data-aos-easing="ease-out-cubic"
                  className="block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  Talent
                </span>
                <span
                  data-aos="zoom-in-right"
                  data-aos-duration="1000"
                  data-aos-delay="700"
                  data-aos-easing="ease-out-cubic"
                  className="block"
                >
                  Meets the Right
                </span>
                <span
                  data-aos="zoom-in-left"
                  data-aos-duration="1000"
                  data-aos-delay="900"
                  data-aos-easing="ease-out-cubic"
                  className="block bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                >
                  Opportunity
                </span>
              </h1>

              <p
                className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="1000"
              >
                Revolutionize your hiring journey with real-time tracking, and
                seamless collaboration.
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="1100"
              >
                <button
                  onClick={() => {
                    setUserType("candidate");
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center">
                    I'm Looking for a Job
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setUserType("recruiter");
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center">
                    I'm Hiring Talent
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500 dark:text-gray-400"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="1300"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  100% Free for candidates
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  3 free job posts for recruiters
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS SECTION ===== */}
        <section
          id="how-it-works"
          className="py-24 bg-gray-50 dark:bg-gray-900/50"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-offset="100"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="100"
              >
                How{" "}
                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  HireFlow
                </span>{" "}
                Works
              </h2>
              <p
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                A seamless experience for both candidates and recruiters
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Candidate Flow */}
              <div
                className="relative"
                data-aos="fade-down"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                <div className="absolute top-15 left-10 w-0.5 h-full bg-linear-to-b from-green-800 to-transparent"></div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-9 flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  For Candidates
                </h3>
                <div className="space-y-8">
                  {candidateFlow?.data.map((item, index) => (
                    <div
                      key={index + 1}
                      className="relative flex items-start group"
                      data-aos="fade-down"
                      data-aos-duration="800"
                      data-aos-delay={400 + index * 150}
                    >
                      <div className="absolute left-8 w-4 h-4 bg-white dark:bg-gray-900 border-4 border-green-500 rounded-full group-hover:scale-125 transition-transform"></div>
                      <div className="ml-20 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:translate-x-2">
                        <div className="flex items-center mb-2">
                          <span className="w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                            {item.step}
                          </span>
                          <h4 className="font-semibold text-lg">
                            {item.heading}
                          </h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Flow */}
              <div
                className="relative"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                <div className="absolute top-15 left-10 w-0.5 h-full bg-linear-to-b from-blue-800 to-transparent"></div>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8 flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-6 h-6"
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
                  </div>
                  For Recruiters
                </h3>
                <div className="space-y-8">
                  {recruiterFlow?.data.map((item, index) => (
                    <div
                      key={index}
                      className="relative flex items-start group"
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay={400 + index * 100}
                    >
                      <div className="absolute left-8 w-4 h-4 bg-white dark:bg-gray-900 border-4 border-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                      <div className="ml-20 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:translate-x-2">
                        <div className="flex items-center mb-2">
                          <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                            {item.step}
                          </span>
                          <h4 className="font-semibold text-lg">
                            {item.heading}
                          </h4>
                        </div>
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

        {/* ===== WHY CHOOSE US SECTION ===== */}
        <section
          id="why-choose-us"
          className="py-24 bg-white dark:bg-gray-900/50"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-offset="100"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="100"
              >
                Why Choose{" "}
                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  HireFlow
                </span>
              </h2>
              <p
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                Experience the benefits tailored to your needs
              </p>
            </div>

            <div
              className="flex justify-center mb-12"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="300"
            >
              <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                  onClick={() => setUserType("candidate")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${userType === "candidate" ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  For Candidates
                </button>
                <button
                  onClick={() => setUserType("recruiter")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${userType === "recruiter" ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  For Recruiters
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(userType === "candidate"
                ? candidateBenefits
                : recruiterBenefits
              ).map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  data-aos-delay={400 + index * 200}
                  data-aos-offset="50"
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-linear-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${userType === "candidate" ? "from-green-600 to-emerald-600" : "from-blue-600 to-indigo-600"}`}
                  ></div>
                  <div
                    className={`inline-flex p-3 rounded-xl mb-4 ${userType === "candidate" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING SECTION ===== */}
        <section
          id="pricing"
          className="py-24 bg-linear-to-br  dark:from-gray-900/50 "
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-offset="100"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium mb-4"
                data-aos="fade-down"
                data-aos-duration="800"
                data-aos-delay="100"
              >
                💰 Simple, Transparent Pricing
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                Choose Your{" "}
                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Plan
                </span>
              </h2>
              <p
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                Candidates always use HireFlow for free. Recruiters start free,
                then upgrade to hire more.
              </p>
            </div>

            {/* Billing Toggle */}
            <div
              className="flex items-center justify-center gap-3 mb-12"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="400"
            >
              <span
                className={`text-sm font-medium ${billingCycle === "monthly" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle(
                    billingCycle === "monthly" ? "yearly" : "monthly",
                  )
                }
                className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300"
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${billingCycle === "yearly" ? "translate-x-7.5" : "translate-x-0.5"}`}
                ></div>
              </button>
              <span
                className={`text-sm font-medium ${billingCycle === "yearly" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
              >
                Yearly
              </span>
              {billingCycle === "yearly" && (
                <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                  Save 20%
                </span>
              )}
            </div>
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 ${plan.borderColor} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    plan.popular
                      ? "scale-[1.02] md:scale-105 z-10 shadow-xl"
                      : ""
                  }`}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay={500 + index * 200}
                  data-aos-offset="50"
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2"
                      data-aos="zoom-in"
                      data-aos-duration="600"
                      data-aos-delay={700 + index * 200}
                    >
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold text-white bg-linear-to-r ${plan.color} shadow-lg`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <span
                        className="text-3xl mb-3 block"
                        data-aos="zoom-in"
                        data-aos-duration="600"
                        data-aos-delay={600 + index * 200}
                      >
                        {plan.icon}
                      </span>
                      <h3
                        className="text-xl font-bold text-gray-900 dark:text-white"
                        data-aos="fade-up"
                        data-aos-duration="800"
                        data-aos-delay={650 + index * 200}
                      >
                        {plan.name}
                      </h3>
                      <p
                        className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                        data-aos="fade-up"
                        data-aos-duration="800"
                        data-aos-delay={700 + index * 200}
                      >
                        {plan.subtitle}
                      </p>
                    </div>

                    {/* Price */}
                    <div
                      className="text-center mb-6"
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay={750 + index * 200}
                    >
                      <div className="flex items-baseline justify-center gap-1">
                        {plan.price[billingCycle] === 0 ? (
                          <>
                            <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                              Free
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg text-gray-500 dark:text-gray-400">
                              {currency}
                            </span>
                            <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                              {plan.price[billingCycle]}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              /mo
                            </span>
                          </>
                        )}
                      </div>
                      {plan.price.yearly > 0 && billingCycle === "yearly" && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                          Billed {currency}
                          {plan.price.yearly * 12}/year · Save{currency}
                          {(plan.price.monthly - plan.price.yearly) * 12}
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() =>
                        navigate(
                          plan.price[billingCycle] === 0
                            ? "/register"
                            : "/login",
                        )
                      }
                      className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${plan.ctaStyle}`}
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay={800 + index * 200}
                    >
                      {plan.cta}
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                    {/* Features */}
                    <div className="space-y-3">
                      <p
                        className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        data-aos="fade-up"
                        data-aos-duration="600"
                        data-aos-delay={850 + index * 200}
                      >
                        What's included
                      </p>
                      {plan.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5"
                          data-aos="fade-right"
                          data-aos-duration="600"
                          data-aos-delay={900 + index * 200 + i * 80}
                        >
                          {feature.included ? (
                            <svg
                              className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <span
                            className={`text-sm ${feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* FAQ Hint */}
            <div
              className="text-center mt-12"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="1200"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Have questions?{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Check our FAQ
                </a>{" "}
                or{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  contact sales
                </a>
              </p>
            </div>
          </div>
        </section>

        <section
          className="py-10 bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-offset="50"
        >
          <div className="container mx-auto px-6">
            <p
              className="text-center text-gray-600 dark:text-gray-400 mb-10 text-lg font-medium"
              data-aos="fade-up"
              Works
              data-aos-duration="800"
              data-aos-delay="100"
            >
              Trusted by 10,000+ companies worldwide
            </p>
            <div
              className="flex flex-wrap justify-center items-center gap-12 opacity-60"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <Company />
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <div data-aos="fade-up" data-aos-duration="1000" data-aos-offset="50">
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
