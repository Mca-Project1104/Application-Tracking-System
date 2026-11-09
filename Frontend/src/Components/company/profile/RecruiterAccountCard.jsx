import React from "react";
import { User, Mail, ShieldCheck, CheckCircle2, Copy } from "lucide-react";

const RecruiterAccountCard = ({ profileData, onCopy }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Recruiter Account Credentials
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Primary account credentials and authentication identity for this enterprise workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-500" />
            Authorized Contact Name
          </span>
          <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
            {profileData?.firstName} {profileData?.lastName}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-500" />
            Primary Work Email
          </span>
          <div className="flex items-center justify-between mt-1">
            <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
              {profileData?.email || "N/A"}
            </p>
            {profileData?.email && (
              <button
                onClick={() => onCopy(profileData.email, "Email")}
                title="Copy Email"
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            Account Role
          </span>
          <p className="text-base font-semibold text-slate-900 dark:text-white mt-1 capitalize">
            {profileData?.accountType || "company"}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            System Status
          </span>
          <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-1 capitalize">
            {profileData?.status || "Accepted"}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Security & Session
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Protected with encrypted JWT Bearer authentication and Role-Based Access Control (RBAC).
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
          ● Active Session
        </span>
      </div>
    </div>
  );
};

export default RecruiterAccountCard;

