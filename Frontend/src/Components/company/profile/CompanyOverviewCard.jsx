import React from "react";
import {
  Building2,
  MapPin,
  ShieldCheck,
  Layers,
  Copy,
  Sparkles,
  Edit3,
} from "lucide-react";

const CompanyOverviewCard = ({ company, onOpenEdit, onCopy }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Organization Profile
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Core business details and platform credentials presented to prospective talent.
          </p>
        </div>
        <button
          onClick={onOpenEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Modify
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            Legal Company Name
          </span>
          <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
            {company?.name || "Not specified"}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            Headquarters Location
          </span>
          <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
            {company?.location || "Not specified"}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            Verification Status
          </span>
          <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
            {company?.isVerified ? "Enterprise Verified" : "Pending Document Verification"}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Platform Entity ID
          </span>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-mono font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">
              {company?._id || "N/A"}
            </p>
            {company?._id && (
              <button
                onClick={() => onCopy(company._id, "Company ID")}
                title="Copy Company ID"
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
          <p className="font-semibold">Candidate Portal Visibility</p>
          <p>
            Your verified company name and corporate logo are automatically presented to job seekers in active job postings, match results, and interview invitation emails.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverviewCard;

