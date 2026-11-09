import React from "react";

export const PipelineCardSkeleton = () => (
  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-1.5">
          <div className="w-24 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-16 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
      <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="flex gap-1.5">
      <div className="w-14 h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="w-16 h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
);

export const JobCardSkeleton = () => (
  <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4 animate-pulse">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2 flex-1">
        <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-1/2 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="flex flex-wrap gap-2">
      <div className="w-20 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
      <div className="w-24 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
      <div className="w-16 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
      <div className="w-28 h-4 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="w-20 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3 animate-pulse">
    <div className="w-1/3 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
    <div className="w-1/2 h-8 bg-slate-200 dark:bg-slate-800 rounded" />
    <div className="w-2/3 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
  </div>
);

