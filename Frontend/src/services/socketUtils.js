/**
 * Global Socket.IO Utilities and Helpers
 * 
 * This file provides utility functions and constants for socket communication
 * throughout the application.
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOCKET EVENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // Chat
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  TYPING: "typing",
  STOP_TYPING: "stop_typing",

  // Notifications
  NOTIFICATION: "notification",
  MARK_READ: "mark_read",

  // Room Management
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  ROOM_UPDATED: "room_updated",

  // User Presence
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
  ONLINE_USERS: "online_users",
  USER_PRESENCE: "user_presence",

  // Job Related
  JOB_POSTED: "job_posted",
  JOB_UPDATED: "job_updated",
  APPLICATION_RECEIVED: "application_received",
  APPLICATION_STATUS_CHANGED: "application_status_changed",

  // Interview/Call
  INTERVIEW_REQUEST: "interview_request",
  INTERVIEW_STARTED: "interview_started",
  INTERVIEW_ENDED: "interview_ended",

  // Real-time Updates
  DATA_UPDATED: "data_updated",
  SYNC: "sync",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOCKET MESSAGE TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MESSAGE_TYPES = {
  JOB_ALERT: "job_alert",
  APPLICATION_UPDATE: "application_update",
  INTERVIEW_SCHEDULED: "interview_scheduled",
  OFFER: "offer",
  CHAT: "chat",
  SYSTEM: "system",
  ERROR: "error",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION TEMPLATES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const NOTIFICATION_TEMPLATES = {
  newJobPosted: (jobTitle, company) => ({
    type: MESSAGE_TYPES.JOB_ALERT,
    title: "New Job Posted",
    message: `${company} posted a new job: ${jobTitle}`,
    icon: "briefcase",
    action: "View Job",
  }),

  applicationReceived: (candidateName) => ({
    type: MESSAGE_TYPES.APPLICATION_UPDATE,
    title: "New Application",
    message: `${candidateName} applied for your job`,
    icon: "user-plus",
    action: "Review Application",
  }),

  applicationStatusChanged: (status) => ({
    type: MESSAGE_TYPES.APPLICATION_UPDATE,
    title: "Application Update",
    message: `Your application status changed to: ${status}`,
    icon: "sync",
    action: "View Details",
  }),

  interviewScheduled: (date, company) => ({
    type: MESSAGE_TYPES.INTERVIEW_SCHEDULED,
    title: "Interview Scheduled",
    message: `Interview scheduled with ${company} on ${date}`,
    icon: "calendar",
    action: "View Details",
  }),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOCKET ERROR MESSAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SOCKET_ERRORS = {
  CONNECTION_FAILED: "Failed to connect to server",
  DISCONNECTED: "Connection lost. Reconnecting...",
  TIMEOUT: "Connection timeout",
  INVALID_AUTH: "Invalid authentication token",
  ROOM_NOT_FOUND: "Room not found",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Validate socket event name
 */
export const isValidEvent = (event) => {
  return Object.values(SOCKET_EVENTS).includes(event);
};

/**
 * Create socket room name
 */
export const createRoomName = (type, id) => {
  return `${type}_${id}`.toLowerCase();
};

/**
 * Parse message data
 */
export const parseSocketMessage = (data) => {
  try {
    if (typeof data === "string") {
      return JSON.parse(data);
    }
    return data;
  } catch (error) {
    console.error("Error parsing socket message:", error);
    return null;
  }
};

/**
 * Format socket error
 */
export const formatSocketError = (error) => {
  if (typeof error === "string") {
    return SOCKET_ERRORS[error] || error;
  }
  return SOCKET_ERRORS.CONNECTION_FAILED;
};

export default {
  SOCKET_EVENTS,
  MESSAGE_TYPES,
  NOTIFICATION_TEMPLATES,
  SOCKET_ERRORS,
  isValidEvent,
  createRoomName,
  parseSocketMessage,
  formatSocketError,
};
