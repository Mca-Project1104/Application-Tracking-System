import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.jsx";
import hireflow from "../assets/HIRE_FLOW.png";
import { useAppContext } from "../context/AppProvider.jsx";

const Login = ({ setIsAuthenticated, setUserRole }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isActive, setIsActive] = useState("login");
  const { navigate, searchRef } = useAppContext();
  const { email, password, newpassword } = formData;
  const token = localStorage.getItem("token");

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    // If the page was opened as a popup/modal
    if (window.opener) {
      window.close();
    } else {
      // Otherwise navigate back or to home
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (loading) return;

    setLoading(true);
    console.log(isActive);

    switch (isActive) {
      case "forgot_password":
        try {
          const response = await api.post(
            "/api/user/forgetpass",
            { password, newpassword },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          console.log(response);

          if (response.status === 200) {
            console.log(response);
            setIsActive("login");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
        break;
      case "login":
        try {
          const response = await api.post("/api/user/login", {
            email,
            password,
          });

          if (response.status === 200) {
            const { accessToken, user } = response.data;

            // Store token
            if (user.accountType === "admin") {
              localStorage.setItem("admin_token", accessToken);
            } else {
              localStorage.setItem("token", accessToken);
            }

            setIsAuthenticated(true);
            setUserRole(user.accountType);

            // Store user data
            localStorage.setItem("userRole", user.accountType);
            localStorage.setItem("user", JSON.stringify(user));

            // Navigate
            const role = user.accountType;
            navigate(
              role === "company"
                ? "/company"
                : role === "candidate"
                  ? "/candidate"
                  : "/admin",
            );
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
        break;

      default:
        console.log("not found");
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-3 flex bg-white dark:bg-black relative">
      {/* aos animation */}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="ml-4 text-lg">Protected Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form with AOS */}
      <div
        data-aos="slide-right"
        data-aos-duration="1000"
        data-aos-easing="ease-out-cubic"
        className="w-full lg:w-1/2 flex items-center rounded-r-2xl justify-center p-8 bg-gray-200 dark:bg-gray-900"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full  dark:bg-gray-800/90 backdrop-blur-sm shadow-lg  transition-all duration-200 hover:scale-110 group"
          aria-label="Close page"
        >
          <svg
            className="h-6 w-6 text-gray-600  hover:scale-95 duration-200 dark:text-gray-300  dark:group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
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
                  Applicant Tracking System
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
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
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
                  required
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
                  // to="/forgot-password"
                  onClick={() =>
                    setIsActive(
                      isActive === "forgot_password"
                        ? "login"
                        : "forgot_password",
                    )
                  }
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div
              data-aos="zoom-in"
              data-aos-delay="700"
              data-aos-duration="600"
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div
            data-aos="fade-up"
            data-aos-delay="800"
            data-aos-duration="600"
            className="mt-6"
          >
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
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
              >
                <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
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
