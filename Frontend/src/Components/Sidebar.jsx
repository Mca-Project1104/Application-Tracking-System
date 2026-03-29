import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  candidateLinks,
  companyLinks,
  adminLinks,
} from "../assets/dummydata.js";

const Sidebar = ({ userRole }) => {
  const location = useLocation();
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (userRole === "admin") {
      setLinks(adminLinks);
    } else {
      setLinks(userRole === "candidate" ? candidateLinks : companyLinks);
    }
  }, []);

  return (
    <div className="w-64 bg-white dark:bg-white/6 h-screen shadow-md fixed left-0 top-0 pt-16 z-0 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                title={link.name}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors  ${
                  location.pathname === link.path
                    ? "bg-blue-50 dark:bg-white/10 dark:text-blue-400 font-medium border-l-4 border-blue-500 text-blue-500"
                    : "text-gray-700 dark:text-white dark:hover:bg-white/10 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={link.icon} //access all icons
                  ></path>
                </svg>
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
