import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";

const Navbar = ({
  userRole,
  setShowSidebar,
  titleName,
  showSidebar,
  setIsAuthenticated,
  setUserRole,
}) => {
  const { navigate } = useAppContext();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const notification = [1];

  const user = JSON.parse(localStorage.getItem("user")) || { name: "User" };

  const Logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setIsAuthenticated(false);
      setUserRole(null);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-3 fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center">
          {userRole !== "admin" && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          )}
          <Link
            to="/"
            className="ml-2 sm:ml-4 text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            {titleName}
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full px-4 py-2 border ${isSearchFocused ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""} border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            />
            <svg
              className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 relative focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            {notification > 0 && (
              <span className="absolute animate-pulse top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                {notification.length}
              </span>
            )}
          </button>

          <div className="flex  items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              <button
                className="cursor-pointer "
                onClick={() => navigate("/candidate-profile/2")}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
            </div>
            <div className="ml-2 hidden sm:block">
              <p className="capitalize text-sm font-medium text-gray-700 dark:text-gray-200">
                {user.name}
              </p>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {userRole}
              </p> */}
            </div>
          </div>

          <button
            onClick={Logout}
            className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Mobile Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <svg
              className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-2">
                  <p className="capitalize text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {userRole}
                  </p>
                </div>
              </div>
              <button className="p-2  rounded-full text-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 relative">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
                <span className="absolute  top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  1
                </span>
              </button>
            </div>
            <button
              onClick={Logout}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
