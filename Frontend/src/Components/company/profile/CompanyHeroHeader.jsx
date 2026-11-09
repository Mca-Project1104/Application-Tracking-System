import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  User,
  Calendar,
  Edit3,
  Sparkles,
  Plus,
} from "lucide-react";
import { getPlanStyles } from "../../../assets/dummydata.js";

const CompanyHeroHeader = ({
  company,
  profileData,
  subscription,
  onOpenEdit,
  onNavigatePricing,
  onNavigatePostJob,
  formatDate,
}) => {
  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Cover Backdrop */}
      <div className="h-36 sm:h-44 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Enterprise Portal
          </span>
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
          {/* Logo / Avatar with Quick Change Trigger */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xl border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt={company.name || "Company Logo"}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-inner">
                  {company?.name ? company.name.substring(0, 2) : "CP"}
                </div>
              )}
            </div>
            <button
              onClick={onOpenEdit}
              title="Change Company Logo"
              className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* Action Button Group */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenEdit}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Edit Profile
            </button>
            <button
              onClick={onNavigatePricing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Subscription Plan
            </button>
            <button
              onClick={onNavigatePostJob}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </button>
          </div>
        </div>

        {/* Title, Badges & Metadata */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {company?.name || "Corporate Enterprise"}
            </h1>
            {company?.isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Company
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <ShieldAlert className="w-3.5 h-3.5" />
                Pending Verification
              </span>
            )}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getPlanStyles(
                subscription?.plan || "FREE",
              )}`}
            >
              {subscription?.plan || "FREE"} Plan
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{company?.location || "Headquarters: Remote / Global"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-500 shrink-0" />
              <span>
                Managed by {profileData?.firstName || "Lead"} {profileData?.lastName || "Recruiter"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Member Since {formatDate(company?.createdAt || profileData?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeroHeader;

