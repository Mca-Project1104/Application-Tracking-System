import React from "react";
import { CreditCard, Calendar, Sparkles, Copy } from "lucide-react";

const CompanySubscriptionCard = ({
  subscription,
  activeJobs = 0,
  maxJobs = 3,
  quotaPercentage = 0,
  onNavigatePricing,
  onCopy,
  formatDate,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Plan & Quota Limits
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active subscription and job posting allowance.
          </p>
        </div>
        <button
          onClick={onNavigatePricing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Upgrade
        </button>
      </div>

      {/* Plan Header Card */}
      <div className="p-4 rounded-xl bg-linear-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/50 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Current Tier
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {subscription?.plan || "FREE"} Plan
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
              subscription?.status === "ACTIVE"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
            }`}
          >
            ● {subscription?.status || "ACTIVE"}
          </span>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>Job Posting Quota</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {activeJobs} / {maxJobs} Used
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${quotaPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
            {maxJobs - activeJobs > 0
              ? `${maxJobs - activeJobs} remaining opening(s) available.`
              : "Active posting limit reached."}
          </p>
        </div>
      </div>

      {/* Renewal & Dates */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            Billing Cycle
          </span>
          <span className="font-semibold text-slate-900 dark:text-white capitalize">
            {subscription?.billingCycle || "Standard Monthly"}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            Next Renewal
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatDate(subscription?.endDate)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
            Payment Ref
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
              {subscription?.paymentId || "Free Tier"}
            </span>
            {subscription?.paymentId && (
              <button
                onClick={() => onCopy(subscription.paymentId, "Payment ID")}
                title="Copy Payment ID"
                className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySubscriptionCard;

