import React from "react";

const CompanyMetricRibbon = ({
  activeJobs = 0,
  maxJobs = 3,
  accountStatus = "Accepted",
  subscriptionStatus = "Active",
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 divide-x divide-slate-200/80 dark:divide-slate-800 text-center rounded-b-3xl">
      <div className="p-3.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
          Active Jobs
        </span>
        <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">
          {activeJobs}
        </span>
      </div>
      <div className="p-3.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
          Posting Limit
        </span>
        <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">
          {maxJobs} max
        </span>
      </div>
      <div className="p-3.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
          Account Status
        </span>
        <span className="text-lg font-bold capitalize text-emerald-600 dark:text-emerald-400 mt-0.5 block">
          {accountStatus}
        </span>
      </div>
      <div className="p-3.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
          Subscription
        </span>
        <span className="text-lg font-bold uppercase text-purple-600 dark:text-purple-400 mt-0.5 block">
          {subscriptionStatus}
        </span>
      </div>
    </div>
  );
};

export default CompanyMetricRibbon;

