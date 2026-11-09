import React from "react";
import { Briefcase, Layers, Calendar } from "lucide-react";

const CompanyWorkspaceShortcuts = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        Workspace Quick Links
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate("/company/jobs")}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30 transition text-left group cursor-pointer"
        >
          <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white block">
            Job Postings
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
            Manage live roles
          </span>
        </button>

        <button
          onClick={() => onNavigate("/company/hiring-pipeline")}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 bg-slate-50/50 dark:bg-slate-800/30 transition text-left group cursor-pointer"
        >
          <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white block">
            Hiring Pipeline
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
            Track candidate stages
          </span>
        </button>

        <button
          onClick={() => onNavigate("/company/interviews")}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/30 transition text-left group cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white block">
            Interviews Hub
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
            Teams, Zoom & Meet
          </span>
        </button>
      </div>
    </div>
  );
};

export default CompanyWorkspaceShortcuts;

