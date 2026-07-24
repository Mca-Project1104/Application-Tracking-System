import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.jsx";
import hireflow from "../assets/HIRE_FLOW.png";
import { useAppContext } from "../context/AppProvider.jsx";
import { RiLock2Line } from "react-icons/ri";
import { MdElectricBolt } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = ({ setIsAuthenticated, setUserRole }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isActive, setIsActive] = useState("login");
  const { navigate, searchRef, token, handleClose } = useAppContext();
  const { email, password, newpassword } = formData;
  const isAvilable = localStorage.getItem("verifyEmail");

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgot = async () => {
    try {
      if (!password | !newpassword | !email) {
        toast.error("all fields are required");
      }

      const response = await api.post("/api/v1/users/forgetpass", {
        password,
        newpassword,
        email,
      });

      if (response.status === 200) {
        setIsActive("login");
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await api.post("/api/v1/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { accessToken, user } = response.data;
        const { email, accountType, name } = user;

        localStorage.setItem("user", JSON.stringify(user));
        if (accountType === "admin") {
          localStorage.setItem("verifyEmail", email);
          navigate("/verify-email", { state: { email, user, accessToken } });
          return;
        }

        localStorage.setItem("token", accessToken);

        setIsAuthenticated(true);
        setUserRole(user.accountType);

        localStorage.setItem("userRole", user.accountType);

        const role = user.accountType;
        navigate(role === "company" ? "/company" : "/candidate");
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;
        setError(data.message || "Login failed");
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (loading) return;
    setLoading(true);

    switch (isActive) {
      case "forgot_password":
        await handleForgot();
        break;
      case "login":
        await handleLogin();
        break;
      default:
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-3 flex bg-white dark:bg-black relative">
      <div
        data-aos="slide-left"
        data-aos-duration="1000"
        data-aos-easing="ease-out-cubic"
        className="hidden lg:block lg:w-1/2 relative rounded-l-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-700">
          <img
            className="inset-0 h-full w-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            alt="People working in office"
          />
        </div>

        <div className="relative h-full flex flex-col justify-center px-12 text-white">
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
            className="max-w-lg"
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome Back to HireFlow
            </h1>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Sign in to access your dashboard and continue streamlining your
              hiring process.
            </p>

            <div className="space-y-4">
              <div
                data-aos="fade-right"
                data-aos-delay="300"
                data-aos-duration="600"
                className="flex items-center transform transition-transform hover:translate-x-2"
              >
                <div className="shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <RiLock2Line className="h-6 w-6 text-white" />
                </div>
                <span className="ml-4 text-lg">Secure Authentication</span>
              </div>

              <div
                data-aos="fade-right"
                data-aos-delay="400"
                data-aos-duration="600"
                className="flex items-center transform transition-transform hover:translate-x-2"
              >
                <div className="shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <MdElectricBolt className="h-6 w-6 text-white" />
                </div>
                <span className="ml-4 text-lg">Fast & Efficient</span>
              </div>

              <div
                data-aos="fade-right"
                data-aos-delay="500"
                data-aos-duration="600"
                className="flex items-center transform transition-transform hover:translate-x-2"
              >
                <div className="shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <RiSecurePaymentFill className="h-6 w-6 text-white" />
                </div>
                <span className="ml-4 text-lg">Protected Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        data-aos="slide-right"
        data-aos-duration="1000"
        data-aos-easing="ease-out-cubic"
        className="w-full lg:w-1/2 flex items-center rounded-2xl lg:rounded-l-none justify-center p-8 bg-gray-200 dark:bg-gray-900"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-1 rounded-full shadow-sm transition-all duration-200"
          aria-label="Close page"
        >
          <IoMdClose className="h-6 w-6 text-gray-600  duration-200 dark:text-gray-300  dark:group-hover:text-white transition-colors" />

          <span className="sr-only">Close</span>
        </button>
        <div className="w-full max-w-md">
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="600"
            className="text-center mb-8"
          >
            <div className="flex justify-center items-center">
              <div className="shrink-0">
                <div className="h-12 w-12 rounded-lg  flex items-center justify-center">
                  <img
                    src={hireflow}
                    alt="logo"
                    className="rounded object-fill"
                  />
                </div>
              </div>
              <div className="ml-3 text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  HireFlow
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Resume Ranking System
                </p>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                create a new account
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
                ref={searchRef}
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
              data-aos-delay="500"
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
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2  border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="Enter your password"
                  value={password}
                  onChange={onChange}
                />

                {isActive === "forgot_password" && (
                  <>
                    <label
                      htmlFor="password"
                      className="block text-sm mt-6 font-medium text-gray-700 dark:text-gray-300"
                    >
                      New Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="newpassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2  border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                        placeholder="Enter new password"
                        value={newpassword}
                        onChange={onChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-duration="600"
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  onClick={() =>
                    setIsActive(
                      isActive === "forgot_password"
                        ? "login"
                        : "forgot_password",
                    )
                  }
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {isActive === "forgot_password"
                    ? "back to login"
                    : "Forgot your password?"}
                </Link>
              </div>
            </div>

            <div
              data-aos="zoom-in"
              data-aos-delay="700"
              data-aos-duration="600"
            >
              {isAvilable && (
                <p
                  className="cursor-pointer text-center font-medium text-indigo-600 hover:text-indigo-500 mb-1"
                  onClick={() => navigate("/verify-email")}
                >
                  Verify Your Email
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                title="Click Me"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <ImSpinner2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
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
                title="Please enter Gmail id"
                className="cursor-no-drop w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                className="cursor-no-drop w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
              >
                <FaLinkedin className="w-5 h-5" />
                <span className="ml-2">LinkedIn</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
