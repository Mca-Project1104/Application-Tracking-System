import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  candidateLinks,
  companyLinks,
  adminLinks,
} from "../assets/dummydata.js";

const Sidebar = ({ userRole, showSidebar }) => {
  const location = useLocation();
  const links =
    userRole === "admin"
      ? adminLinks
      : userRole === "candidate"
        ? candidateLinks
        : companyLinks;

  return (
    <div
      className={`bg-white dark:bg-gray-900 h-screen shadow-md fixed left-0 top-16 z-50 w-64 border-r border-t border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                title={link.name}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "bg-blue-50 dark:bg-white/10 dark:text-blue-400 font-medium border-l-4 border-blue-500 text-blue-500"
                    : "text-gray-700 dark:text-white dark:hover:bg-white/10 hover:bg-gray-100"
                }`}
              >
                {link.icon && <link.icon className="mr-3 text-lg" />}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
