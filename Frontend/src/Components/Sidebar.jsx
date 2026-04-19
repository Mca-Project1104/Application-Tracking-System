import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  candidateLinks,
  companyLinks,
  adminLinks,
} from "../assets/dummydata.js";

const Sidebar = ({ userRole, showSidebar, setShowSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinks = (link) => {
    navigate(link);
    setShowSidebar(false); // close on mobile after navigation
  };

  const links =
    userRole === "admin"
      ? adminLinks
      : userRole === "candidate"
        ? candidateLinks
        : companyLinks;

  return (
    <>
      {/* ✅ Overlay — only on mobile (< md), z-30 (below sidebar z-40) */}
      {showSidebar && (
        <div
          className="fixed inset-0 top-16 bg-black/50 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* ✅ Sidebar: always fixed, top-16 matches navbar height, z-40 below navbar z-50 */}
      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 sm:w-64
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto overscroll-contain
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <ul className="space-y-1 p-3">
          {links.map((link) => (
            <li key={link.name}>
              <button
                onClick={() => handleLinks(link.path)}
                className={`flex items-center px-4 py-3 w-full rounded-lg transition-colors text-sm ${
                  location.pathname === link.path
                    ? "bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-medium border-l-4 border-blue-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                {link.icon && <link.icon className="mr-3 text-lg shrink-0" />}
                <span className="truncate">{link.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
