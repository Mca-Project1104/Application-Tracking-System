import React from "react";

const statusConfig = {
  applied: {
    label: "Applied",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200/80 dark:border-blue-800/60",
    dot: "bg-blue-500",
  },
  screening: {
    label: "Screening",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200/80 dark:border-cyan-800/60",
    dot: "bg-cyan-500",
  },
  shortlisted: {
    label: "Shortlisted",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200/80 dark:border-indigo-800/60",
    dot: "bg-indigo-500",
  },
  interview: {
    label: "Interview",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200/80 dark:border-purple-800/60",
    dot: "bg-purple-500 animate-pulse",
  },
  offer: {
    label: "Offer",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200/80 dark:border-amber-800/60",
    dot: "bg-amber-500",
  },
  hired: {
    label: "Hired",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200/80 dark:border-rose-800/60",
    dot: "bg-rose-500",
  },
};

export const StatusPill = ({ status = "applied", size = "sm", className = "" }) => {
  const normalizedKey = String(status || "").toLowerCase();
  const config = statusConfig[normalizedKey] || {
    label: status || "Pending",
    bg: "bg-slate-50 dark:bg-slate-800/50",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  };

  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${
        isSmall ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span className="capitalize">{config.label}</span>
    </span>
  );
};

export default StatusPill;

