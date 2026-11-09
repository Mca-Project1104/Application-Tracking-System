/**
 * Utility to generate standard RFC 5545 iCalendar (.ics) format
 * for calendar synchronization across Microsoft Teams / Outlook, Google Calendar, and Apple Calendar.
 */

function formatIcsDateTime(dateObj) {
  return dateObj.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function parseDateTime(dateStr, timeStr) {
  try {
    const baseDate = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(baseDate.getTime())) {
      const now = new Date();
      now.setHours(now.getHours() + 1, 0, 0, 0);
      return { start: now, end: new Date(now.getTime() + 45 * 60 * 1000) };
    }

    let hours = 10;
    let minutes = 0;

    if (timeStr && typeof timeStr === "string") {
      const trimmed = timeStr.trim().toUpperCase();
      const isPM = trimmed.includes("PM");
      const isAM = trimmed.includes("AM");
      const cleanTime = trimmed.replace(/[^\d:]/g, "");
      const parts = cleanTime.split(":");

      if (parts.length >= 1) {
        hours = parseInt(parts[0], 10) || 10;
      }
      if (parts.length >= 2) {
        minutes = parseInt(parts[1], 10) || 0;
      }

      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
    }

    baseDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(baseDate.getTime() + 45 * 60 * 1000); // 45 minute interview duration default
    return { start: baseDate, end: endDate };
  } catch {
    const fallback = new Date();
    fallback.setHours(fallback.getHours() + 1, 0, 0, 0);
    return { start: fallback, end: new Date(fallback.getTime() + 45 * 60 * 1000) };
  }
}

export const generateIcsCalendar = ({
  uid,
  title = "Interview Meeting",
  description = "",
  location = "",
  date,
  time,
  organizerEmail = "no-reply@hireflow.com",
  organizerName = "HireFlow ATS",
  attendeeEmail = "",
  attendeeName = "Participant",
}) => {
  const { start, end } = parseDateTime(date, time);
  const now = new Date();
  const eventUid = uid || `interview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@hireflow.com`;

  const cleanDescription = (description || "")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/[,;]/g, "\\$&");

  const cleanLocation = (location || "")
    .replace(/\r\n|\r|\n/g, " ")
    .replace(/[,;]/g, "\\$&");

  const cleanTitle = (title || "").replace(/[,;]/g, "\\$&");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HireFlow//ATS Microsoft Teams Interview Scheduler//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${eventUid}`,
    `DTSTAMP:${formatIcsDateTime(now)}`,
    `DTSTART:${formatIcsDateTime(start)}`,
    `DTEND:${formatIcsDateTime(end)}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDescription}\\n\\nJoin Online Meeting:\\n${location}`,
    `LOCATION:${cleanLocation}`,
    `ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}`,
    attendeeEmail ? `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${attendeeName}:mailto:${attendeeEmail}` : "",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
};

