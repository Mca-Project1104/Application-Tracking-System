/**
 * READY-TO-USE SOCKET COMPONENTS
 * Copy and paste these into your components folder
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Socket Status Indicator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SocketStatusIndicator = () => {
  const { isConnected, reconnecting, socketError } = useSocketStatus();

  return (
    <div style={{ padding: "8px 12px", borderRadius: "4px" }}>
      {isConnected && !reconnecting && (
        <span style={{ color: "#10b981", fontWeight: "bold" }}>
          ● Connected
        </span>
      )}
      {reconnecting && (
        <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
          ● Reconnecting...
        </span>
      )}
      {!isConnected && !reconnecting && (
        <span style={{ color: "#ef4444", fontWeight: "bold" }}>
          ● Disconnected
        </span>
      )}
      {socketError && (
        <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
          Error: {socketError}
        </div>
      )}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. Notifications Toast
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const NotificationToast = () => {
  const { notifications, removeNotification } = useSocketNotifications();

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        maxWidth: "400px",
      }}
    >
      {notifications.map((notif) => (
        <div
          key={notif.id}
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h4 style={{ margin: "0 0 4px 0" }}>{notif.title}</h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                {notif.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. Online Users List
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const OnlineUsersList = ({ userId }) => {
  const { onlineUsers } = useSocketPresence(userId);

  return (
    <div style={{ padding: "12px" }}>
      <h3 style={{ marginTop: 0 }}>
        Online Users ({onlineUsers.length})
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {onlineUsers.map((user) => (
          <li
            key={user.id}
            style={{
              padding: "8px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background:
                  user.status === "online" ? "#10b981" : "#f59e0b",
                marginRight: "8px",
              }}
            />
            <span>{user.name || user.id}</span>
            <span style={{ fontSize: "12px", color: "#999", marginLeft: "auto" }}>
              {user.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. Simple Chat Box
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SimpleChatBox = ({ roomId, userId }) => {
  const { messages, sendMessage, clearMessages } = useSocketChat(roomId);
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input, userId);
      setInput("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "500px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        background: "#f9fafb",
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "12px",
              textAlign: msg.sender === userId ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: msg.sender === userId ? "#3b82f6" : "#e5e7eb",
                color: msg.sender === userId ? "white" : "black",
                padding: "8px 12px",
                borderRadius: "12px",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: "8px 16px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
          <button
            onClick={clearMessages}
            style={{
              padding: "8px 12px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. Application Status Monitor
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ApplicationMonitor = ({ jobId }) => {
  const [applications, setApplications] = React.useState([]);
  const socketEmit = useSocketEmit();

  useSocketOn(SOCKET_EVENTS.APPLICATION_RECEIVED, (appData) => {
    if (appData.jobId === jobId) {
      setApplications((prev) => [appData, ...prev]);
      const notification = NOTIFICATION_TEMPLATES.applicationReceived(
        appData.candidateName
      );
      socketEmit(SOCKET_EVENTS.NOTIFICATION, notification);
    }
  });

  useSocketOn(SOCKET_EVENTS.APPLICATION_STATUS_CHANGED, (updateData) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === updateData.appId
          ? { ...app, status: updateData.status }
          : app
      )
    );
  });

  const statusColors = {
    pending: "#f59e0b",
    accepted: "#10b981",
    rejected: "#ef4444",
    shortlisted: "#3b82f6",
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>Applications {applications.length > 0 && `(${applications.length})`}</h2>
      <div style={{ display: "grid", gap: "12px" }}>
        {applications.map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4 style={{ margin: "0 0 4px 0" }}>{app.candidateName}</h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                {app.email}
              </p>
            </div>
            <span
              style={{
                background: statusColors[app.status] || "#d1d5db",
                color: "white",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {app.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. Real-time Job Feed
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RealtimeJobFeed = () => {
  const [jobs, setJobs] = React.useState([]);
  const socketEmit = useSocketEmit();

  useSocketOn(SOCKET_EVENTS.JOB_POSTED, (jobData) => {
    console.log("New job posted:", jobData);
    setJobs((prev) => [jobData, ...prev].slice(0, 20)); // Keep latest 20

    const notification = NOTIFICATION_TEMPLATES.newJobPosted(
      jobData.title,
      jobData.company
    );
    socketEmit(SOCKET_EVENTS.NOTIFICATION, notification);
  });

  return (
    <div style={{ padding: "16px" }}>
      <h2>Latest Job Openings</h2>
      <div style={{ display: "grid", gap: "12px" }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px",
              background: "white",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{job.title}</h3>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
              {job.company} • {job.location}
            </p>
            <p style={{ margin: 0, fontSize: "13px" }}>{job.description}</p>
            <button
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Required Imports (Add these to your component files)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/*
import React from "react";
import { 
  useSocketOn, 
  useSocketEmit, 
  useSocketStatus,
  useSocketPresence,
  useSocketChat
} from "../hooks/useSocketHooks";
import { SOCKET_EVENTS, NOTIFICATION_TEMPLATES } from "../services/socketUtils";
*/

export const COMPONENT_LIBRARY = {
  description: "Copy these components to your components folder",
};
