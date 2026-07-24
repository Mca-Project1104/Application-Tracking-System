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
import { GiConfirmed } from "react-icons/gi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { RiLock2Line } from "react-icons/ri";
import { MdGroups } from "react-icons/md";
import { RiPieChart2Fill } from "react-icons/ri";
import { MdElectricBolt } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { PiBagFill } from "react-icons/pi";

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
      icon: <GiConfirmed className="w-8 h-8" />,
      title: "Smart Job Matching",
      description:
        "Match your skills and preferences with perfect opportunities.",
    },
    {
      icon: <TbBrandGoogleAnalytics className="w-8 h-8" />,
      title: "Real-time Tracking",
      description:
        "Monitor your application status from submission to interview scheduling.",
    },
    {
      icon: <RiLock2Line className="w-8 h-8" />,
      title: "Privacy Control",
      description:
        "Keep your job search confidential with advanced privacy settings.",
    },
  ];

  const recruiterBenefits = [
    {
      icon: <MdGroups className="w-8 h-8" />,
      title: "Team Collaboration",
      description:
        "Share feedback and make decisions together with your hiring team.",
    },
    {
      icon: <RiPieChart2Fill className="w-8 h-8" />,
      title: "Advanced Analytics",
      description:
        "Get insights into your hiring funnel and optimize your recruitment strategy.",
    },
    {
      icon: <MdElectricBolt className="w-8 h-8" />,
      title: "Workflow Automation",
      description:
        "Automate repetitive tasks and focus on what matters most - finding talent.",
    },
  ];

  return (
    <div className="min-h-screen select-none scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200  bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
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
                alt="logo"
                className="dark:bg-gray-900  bg-white rounded"
              />
            </div>
            <span
              className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
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
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400   transition-colors"
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
                <CiLight className="w-5 h-5" />
              ) : (
                <CiDark className="w-5 h-5 font-bold" />
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
          className="fixed bottom-5 right-4 z-50 bg-blue-600 rounded-full delay-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
        >
          <button
            onClick={() => handleTop()}
            className="text-2xl rounded-full text-white p-2 font-medium"
          >
            <HiArrowSmallUp />
          </button>
        </div>
      )}

      <div className="[h-18.25]"></div>

      <main>
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
                data-aos-delay="1000"
              >
                <button
                  onClick={() => {
                    setUserType("candidate");
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center">
                    I'm Looking for a Job
                    <FaArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button
                  onClick={() => {
                    setUserType("recruiter");
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center">
                    I'm Hiring Talent
                    <FaArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
                  <GiConfirmed className="w-5 h-5 text-green-500 mr-2" />
                  100% Free for candidates
                </div>
                <div className="flex items-center">
                  <GiConfirmed className="w-5 h-5 text-green-500 mr-2" />3 free
                  job posts for recruiters
                </div>
                <div className="flex items-center">
                  <GiConfirmed className="w-5 h-5 text-green-500 mr-2" />
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>

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
              <div
                className="relative"
                data-aos="fade-down"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                <div className="absolute top-15 left-10 w-0.5 h-full bg-linear-to-b from-green-800 to-transparent"></div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-9 flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                    <CiUser className="w-6 h-6" />
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

              <div
                className="relative"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                <div className="absolute top-15 left-10 w-0.5 h-full bg-linear-to-b from-blue-800 to-transparent"></div>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8 flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                    <PiBagFill className="w-6 h-6" />
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
              <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-xl flex">
                <button
                  onClick={() => setUserType("candidate")}
                  className={`px-6 py-1 rounded-lg font-semibold transition-all duration-300 ${userType === "candidate" ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  For Candidates
                </button>
                <button
                  onClick={() => setUserType("recruiter")}
                  className={`px-6 py-1 rounded-lg font-semibold transition-all duration-300 ${userType === "recruiter" ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
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

                    <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

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
                            <GiConfirmed className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <GiConfirmed className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
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
