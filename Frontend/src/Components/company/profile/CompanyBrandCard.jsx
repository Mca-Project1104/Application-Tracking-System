import React from "react";
import { Building2, Upload } from "lucide-react";

const CompanyBrandCard = ({ company, onOpenEdit }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        Official Brand Mark
      </h3>
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-inner border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
          {company?.logo ? (
            <img
              src={company.logo}
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <Building2 className="w-10 h-10 text-slate-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Primary Corporate Logo
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Recommended: 512x512 transparent PNG or SVG
          </p>
        </div>
        <button
          onClick={onOpenEdit}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          Update Logo Image
        </button>
      </div>
    </div>
  );
};

export default CompanyBrandCard;

