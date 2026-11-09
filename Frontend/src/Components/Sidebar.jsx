import React from "react";
import { useLocation } from "react-router-dom";
import {
  candidateLinks,
  companyLinks,
  adminLinks,
} from "../assets/dummydata.js";
import { useAppContext } from "../context/AppProvider.jsx";
import ThemeToggle from "./common/ThemeToggle.jsx";

const Sidebar = ({ userRole, showSidebar, setShowSidebar }) => {
  const location = useLocation();

  const { navigate } = useAppContext();
  const handleLinks = (link) => {
    navigate(link);
    setShowSidebar(false);
  };

  const links =
    userRole === "admin"
      ? adminLinks
      : userRole === "candidate"
        ? candidateLinks
        : companyLinks;

  return (
    <>
      {showSidebar && (
        <div
          className="fixed inset-0 top-16 bg-black/50 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 sm:w-64
          bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800
          transform transition-transform duration-300 ease-in-out
          flex flex-col justify-between
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <div className="overflow-y-auto overscroll-contain flex-1 p-3">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => handleLinks(link.path)}
                  className={`flex items-center px-3.5 py-2.5 w-full rounded-xl transition-all duration-150 text-sm font-medium ${
                    location.pathname === link.path
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {link.icon && <link.icon className="mr-3 text-lg shrink-0" />}
                  <span className="truncate">{link.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <ThemeToggle variant="sidebar" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
