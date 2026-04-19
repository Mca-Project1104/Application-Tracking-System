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
  const { navigate, companydata, candidate } = useAppContext();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const Logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setIsAuthenticated(false);
      setUserRole(null);
      window.location.href = "/";
    }
  };

  return (
    // ✅ h-16 for consistent height; z-50 above sidebar (z-40)
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 fixed top-0 left-0 right-0 z-50 flex items-center px-3 sm:px-4">
      <div className="flex items-center justify-between w-full">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-2">
          {userRole !== "admin" && (
            <button
              type="button"
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              aria-label="Toggle sidebar"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <Link
            to={`/${userRole}`}
            className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap"
          >
            {titleName}
          </Link>
        </div>

        {/* ✅ Desktop: hidden below md, flex at md+ (matches sidebar breakpoint) */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center">
            <div
              onClick={() => navigate(`/${userRole}/profile`)}
              className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-white cursor-pointer"
            >
              {userRole !== "company" ? (
                <img
                  src={candidate?.profile_image}
                  className="w-full h-full object-cover rounded-full"
                  alt="profile"
                />
              ) : (
                <img
                  src={companydata?.company?.logo}
                  className="w-full h-full object-cover rounded-full"
                  alt="logo"
                />
              )}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className="capitalize text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {userRole}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={Logout}
            className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 whitespace-nowrap"
          >
            Logout
          </button>
        </div>

        {/* ✅ Mobile menu button: visible below md */}
        <button
          type="button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          aria-label="Open menu"
        >
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
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {/* ✅ Mobile Menu Dropdown */}
      {showMobileMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 top-16 bg-black/40 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Panel — fixed below navbar */}
          <div className="fixed top-16 right-2 w-[90%] max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-4 md:hidden">
            {/* Profile */}
            <div
              onClick={() => {
                navigate(`/${userRole}/profile`);
                setShowMobileMenu(false);
              }}
              className="flex items-center cursor-pointer mb-4"
            >
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 mb-3" />

            {/* Logout */}
            <button
              onClick={Logout}
              className="w-full px-4 py-2 text-sm text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;