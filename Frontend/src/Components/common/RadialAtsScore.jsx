import React from "react";

export const RadialAtsScore = ({
  score = 0,
  size = 56,
  strokeWidth = 5,
  showLabel = false,
  className = "",
}) => {
  const numericScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numericScore / 100) * circumference;

  const colorConfig =
    numericScore >= 85
      ? {
          stroke: "stroke-emerald-500",
          text: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-950/30",
        }
      : numericScore >= 65
      ? {
          stroke: "stroke-indigo-500",
          text: "text-indigo-600 dark:text-indigo-400",
          bg: "bg-indigo-50 dark:bg-indigo-950/30",
        }
      : numericScore >= 45
      ? {
          stroke: "stroke-amber-500",
          text: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-950/30",
        }
      : {
          stroke: "stroke-rose-500",
          text: "text-rose-600 dark:text-rose-400",
          bg: "bg-rose-50 dark:bg-rose-950/30",
        };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={`ATS Match Score: ${numericScore}%`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-200 dark:stroke-slate-700/60"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`transition-all duration-700 ease-out ${colorConfig.stroke}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className={`font-mono font-bold tracking-tight ${colorConfig.text}`}
          style={{ fontSize: size <= 48 ? "11px" : size <= 72 ? "14px" : "22px" }}
        >
          {numericScore}%
        </span>
        {showLabel && size > 72 && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
            ATS Score
          </span>
        )}
      </div>
    </div>
  );
};

export default RadialAtsScore;

