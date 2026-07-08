import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.jsx";
import { useAppContext } from "../context/AppProvider.jsx";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { FaBuilding } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdGroups } from "react-icons/md";
import { RiLock2Line } from "react-icons/ri";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { HIREFLOWLOGO, navigate, handleClose } = useAppContext();

  const { firstName, lastName, email, password, confirmPassword, accountType } =
    formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    if (password !== confirmPassword) {
      setError("Password do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/v1/users/register", {
        firstName,
        lastName,
        email,
        password,
        accountType,
      });

      if (response.status === 201) {
        alert("Registration successful.");
        localStorage.setItem("verifyEmail", email);
        navigate("/verify-email", { state: { email } });
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;
        if (data.errors) {
          setError(data.errors[0].msg);
        } else {
          setError(data.message || "Registration failed");
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex bg-white dark:bg-black relative">
      <div
        data-aos="slide-left"
        data-aos-duration="1000"
        data-aos-easing="ease-out-cubic"
        className="w-full lg:w-1/2 flex items-center justify-center p-2 lg:p-8  rounded-2xl lg:rounded-r-none bg-gray-200 dark:bg-gray-900"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-50 p-1 rounded-full shadow-sm  transition-all duration-200 "
          aria-label="Close page"
        >
          <IoMdClose className="h-6 w-6 text-gray-600  duration-200 dark:text-gray-300  dark:group-hover:text-white transition-colors" />
        </button>
        <div className="w-full">
          <div
            data-aos="zoom-in"
            data-aos-delay="300"
            data-aos-duration="600"
            className="text-center mb-8"
          >
            <div className="flex justify-center items-center">
              <div className="shrink-0">
                <div className="h-12 w-12 rounded-lg  flex items-center justify-center">
                  <img src={HIREFLOWLOGO} alt="logo" className="rounded" />
                </div>
              </div>
              <div className="ml-3 text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  HireFlow
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applicant Tracking System
                </p>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          {error && (
            <div
              data-aos="shake"
              data-aos-duration="500"
              className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded"
            >
              <div className="flex">
                <div className="shrink-0">
                  <IoMdCloseCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="600"
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="First Name"
                  value={firstName}
                  onChange={onChange}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={onChange}
                />
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-duration="600"
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                placeholder="you@example.com"
                value={email}
                onChange={onChange}
              />
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-duration="600"
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="Enter your password"
                  value={password}
                  onChange={onChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <IoEyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="700"
              data-aos-duration="600"
            >
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={onChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <IoEye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <IoEyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="400"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Account Type
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    value="candidate"
                    required
                    checked={accountType === "candidate"}
                    onChange={onChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 flex items-center">
                    <CiUser className="w-5 h-5 mr-2 text-gray-400" />
                    Job Seeker
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    value="company"
                    checked={accountType === "company"}
                    onChange={onChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 flex items-center">
                    <FaBuilding className="w-5 h-5 mr-2 text-gray-400" />
                    Recruiter
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="agree-terms"
                name="agreeTerms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                required
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 text-sm text-gray-600 dark:text-gray-400"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <ImSpinner2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
              >
                <FaLinkedin className="w-5 h-5" />
                <span className="ml-2">LinkedIn</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        data-aos="slide-right"
        data-aos-duration="1000"
        data-aos-easing="ease-out-cubic"
        className="hidden lg:block lg:w-1/2 relative  overflow-hidden rounded-r-2xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-700">
          <img
            className="inset-0 h-full w-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            alt="People working in office"
          />
        </div>

        <div className="relative h-full flex flex-col justify-center px-12 text-white">
          <div className="max-w-lg p-5">
            <h1
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="800"
              className="text-5xl font-bold mb-6 leading-tight"
            >
              Streamline Your Hiring Process
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="800"
              className="text-xl text-indigo-100 mb-8 leading-relaxed"
            >
              Our Score helps you find, evaluate, and hire the best candidates
              efficiently. Manage applications, track interviews, and
              collaborate with your team all in one place.
            </p>

            <div className="space-y-4">
              <div
                data-aos="slide-right"
                data-aos-delay="500"
                data-aos-duration="600"
                className="flex items-center transform transition-transform hover:translate-x-2"
              >
                <div className="shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <MdGroups className="h-6 w-6 text-white" />
                </div>
                <span className="ml-4 text-lg">Collaborative Hiring</span>
              </div>

              <div
                data-aos="slide-right"
                data-aos-delay="600"
                data-aos-duration="600"
                className="flex items-center transform transition-transform hover:translate-x-2"
              >
                <div className="shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <TbBrandGoogleAnalytics className="h-6 w-6 text-white" />
                </div>
                <span className="ml-4 text-lg">Advanced Analytics</span>
              </div>

              <div
                data-aos="slide-right"
                data-aos-delay="700"
                data-aos-duration="600"
                className="flex items-center transform transition-transform hover:translate-x-2"
              >
                <div className="shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                </div>
                <span className="ml-4 text-lg">Custom Workflows</span>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex items-center mb-2">
                <span className="ml-3 text-sm">+10,000 users</span>
              </div>
              <p className="text-sm text-indigo-100">
                Trusted by leading companies worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
