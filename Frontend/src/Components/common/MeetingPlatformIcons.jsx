import React from "react";

/**
 * Authentic brand logos for video conferencing platforms:
 * - Microsoft & Microsoft Teams
 * - Zoom
 * - Google Meet
 */

export const MicrosoftLogo = ({ className = "w-4 h-4", size }) => (
  <svg
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-label="Microsoft Logo"
  >
    <rect x="1" y="1" width="9" height="9" fill="#F25022" rx="0.5" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" rx="0.5" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" rx="0.5" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" rx="0.5" />
  </svg>
);

export const MicrosoftTeamsLogo = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-label="Microsoft Teams Logo"
  >
    {/* Small background user avatar */}
    <circle cx="21.5" cy="7.5" r="2.5" fill="#505AC9" />
    <path
      d="M24.5 11h-5a2 2 0 0 0-2 2v5.8c.6.2 1.3.2 2 .2v-6h5v7.6c.7-.4 1.4-1 2-1.7V13a2 2 0 0 0-2-2z"
      fill="#505AC9"
    />
    {/* Main user avatar */}
    <circle cx="15.5" cy="8.5" r="3.5" fill="#7B83EB" />
    {/* Foreground 'T' tile */}
    <rect x="4" y="11" width="16" height="16" rx="3.5" fill="#4B53BC" />
    {/* Stylized White 'T' */}
    <path
      d="M8 15.5h8v2.3h-2.7v6.2h-2.6v-6.2H8v-2.3z"
      fill="#FFFFFF"
    />
  </svg>
);

export const ZoomLogo = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-label="Zoom Logo"
  >
    <rect width="32" height="32" rx="7" fill="#2D8CFF" />
    {/* White Video Camera Body */}
    <rect x="7" y="10" width="12" height="12" rx="2.5" fill="#FFFFFF" />
    {/* White Camera Lens Triangle */}
    <path
      d="M19 14.5l5-3.5a1 1 0 0 1 1.6.8v8.4a1 1 0 0 1-1.6.8l-5-3.5v-3z"
      fill="#FFFFFF"
    />
  </svg>
);

export const GoogleMeetLogo = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-label="Google Meet Logo"
  >
    <rect width="32" height="32" rx="7" fill="#FFFFFF" />
    {/* Google Meet 4-Color Camera Body */}
    <path d="M7 11a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V11z" fill="#00832D" />
    <path d="M19 14.5l5-3.2a1 1 0 0 1 1.5.8v7.8a1 1 0 0 1-1.5.8l-5-3.2v-3.2z" fill="#00AC47" />
    <path d="M7 11a3 3 0 0 1 3-3h6v3H7v-3z" fill="#EA4335" />
    <path d="M16 8h3v7h-3V8z" fill="#FFBA00" />
    <path d="M7 21a3 3 0 0 0 3 3h6v-3H7z" fill="#2684FC" />
  </svg>
);

export const PlatformIcon = ({ platform = "teams", className = "w-5 h-5", size }) => {
  const p = (platform || "").toLowerCase();
  if (p === "teams" || p.includes("microsoft") || p.includes("teams.")) {
    return <MicrosoftTeamsLogo className={className} size={size} />;
  }
  if (p === "zoom" || p.includes("zoom.")) {
    return <ZoomLogo className={className} size={size} />;
  }
  if (p === "meet" || p.includes("google") || p.includes("meet.")) {
    return <GoogleMeetLogo className={className} size={size} />;
  }
  return <MicrosoftLogo className={className} size={size} />;
};

export const PlatformBadge = ({ platform = "teams", className = "" }) => {
  const p = (platform || "").toLowerCase();
  const isTeams = p === "teams" || p.includes("microsoft") || p.includes("teams.");
  const isZoom = p === "zoom" || p.includes("zoom.");
  const isMeet = p === "meet" || p.includes("google") || p.includes("meet.");

  if (isTeams) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#5B5FC7]/10 text-[#464EB8] dark:text-[#7B83EB] border border-[#5B5FC7]/25 shadow-xs ${className}`}
      >
        <MicrosoftTeamsLogo className="w-4 h-4 shrink-0" />
        <span>Microsoft Teams</span>
      </span>
    );
  }

  if (isZoom) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25 shadow-xs ${className}`}
      >
        <ZoomLogo className="w-4 h-4 shrink-0" />
        <span>Zoom</span>
      </span>
    );
  }

  if (isMeet) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 shadow-xs ${className}`}
      >
        <GoogleMeetLogo className="w-4 h-4 shrink-0" />
        <span>Google Meet</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <MicrosoftLogo className="w-3.5 h-3.5 shrink-0" />
      <span>Online Interview</span>
    </span>
  );
};

