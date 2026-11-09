import React from "react";
import { Sun, Moon } from "lucide-react";
import { useAppContext } from "../../context/AppProvider";

const ThemeToggle = ({ variant = "header", className = "" }) => {
  const { theme, setTheme } = useAppContext();
  const isDark = theme === "true";

  const toggleTheme = (e) => {
    e?.stopPropagation?.();
    setTheme(isDark ? "false" : "true");
  };

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`group flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
          isDark
            ? "text-slate-300 hover:text-white hover:bg-slate-800/80"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        } ${className}`}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className="flex items-center gap-2.5">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 group-hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500 shrink-0 transition-transform duration-200 group-hover:-rotate-12" />
          )}
          <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider transition-colors ${
            isDark
              ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
              : "bg-slate-200 text-slate-700 border border-slate-300"
          }`}
        >
          {isDark ? "DARK" : "LIGHT"}
        </span>
      </button>
    );
  }

  if (variant === "menu") {
    return (
      <div className={`flex items-center justify-between py-2 px-1 ${className}`}>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
          <span>Appearance</span>
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    );
  }

  // Default: "header" icon button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl border transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isDark
          ? "bg-slate-800/90 text-amber-400 border-slate-700 hover:bg-slate-700 hover:border-slate-600 shadow-xs"
          : "bg-slate-100/90 text-slate-600 border-slate-200 hover:bg-slate-200/80 hover:text-slate-900 shadow-xs"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-4.5 h-4.5 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4.5 h-4.5 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};

export default React.memo(ThemeToggle);

