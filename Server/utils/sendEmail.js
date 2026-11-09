import nodemailer from "nodemailer";
import "dotenv/config";
import { generateIcsCalendar } from "./calendarHelper.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const currentDate = new Date().toLocaleString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

export const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#4F46E5; padding:20px; text-align:center; color:white;">
      <img 
        src="https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png"
        alt="HireFlow Logo"
        width="100"
        style="display:block; margin:0 auto 10px;"
      />
      <h2 style="margin:0;">HireFlow</h2>
      <p style="margin:0; font-size:14px;">Applicant Tracking System</p>
    </div>

    <!-- Body -->
    <div style="padding:30px; color:#333;">
      <h3>Verify your email</h3>

      <p>Hi there,</p>

      <p>Use the code below:</p>

      <div style="text-align:center; margin:30px 0;">
        <span style="padding:15px 25px; font-size:28px; letter-spacing:6px; background:#f1f5f9; border-radius:8px; font-weight:bold;">
          ${code}
        </span>
      </div>

      <p>This code expires in 10 minutes.</p>

      <p>If you didn’t create this account, ignore this email.</p>

      <p>— HireFlow Team</p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#777;">
      <p>HireFlow, India</p>
      <p>${currentDate}</p>
    </div>

  </div>
</div>
`,
  });
};

export const sendSimpleLoginEmail = async (email, ipAddress) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Login Confirmation - HireFlow",
      html: `
<div style="font-family: Arial; background:#f4f6f8; padding:40px 0;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#2563EB; padding:20px; text-align:center; color:white;">
      <img 
        src="https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png"
        alt="HireFlow Logo"
        width="80"
        style="display:block; margin:0 auto 10px;"
      />
      <h2 style="margin:0;">HireFlow</h2>
      <p style="margin:0; font-size:14px;">Login Activity</p>
    </div>

    <!-- Body -->
    <div style="padding:30px; color:#333;">
      <h3>Login Successful</h3>

      <p>Hello,</p>

      <p>Your account was successfully logged in.</p>

      <p><strong>UserId:</strong> ${email}</p>
      <p><strong>Date & Time:</strong> ${currentDate}</p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>

      <p>If this was you, no action is needed.</p>

      <p style="color:#d32f2f;">
        <strong>If this wasn’t you, change your password immediately.</strong>
      </p>

      <p>— HireFlow Team</p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#777;">
      <p>HireFlow, India</p>
      <p>This is an automated message.</p>
    </div>

  </div>
</div>
`,
    });
    console.log("\nLogin email sent successfully");
  } catch (error) {
    console.error("\nError sending login email(Network Error.):", error);
  }
};

export const InterviewEmail = async (emailOrObj, optionalData) => {
  try {
    const email =
      typeof emailOrObj === "object" && emailOrObj !== null && emailOrObj.email
        ? emailOrObj.email
        : emailOrObj;
    const data =
      typeof emailOrObj === "object" && emailOrObj !== null && emailOrObj.data
        ? emailOrObj.data
        : optionalData || {};

    const meetingLoc = data?.interviewLocation || "Online";
    const isTeams =
      meetingLoc.includes("teams.microsoft.com") ||
      meetingLoc.includes("teams.live.com") ||
      data?.platform === "teams";
    const isMeet = meetingLoc.includes("meet.google.com") || data?.platform === "meet";
    const isZoom = meetingLoc.includes("zoom.us") || data?.platform === "zoom";

    const platformName = isTeams
      ? "Microsoft Teams"
      : isMeet
      ? "Google Meet"
      : isZoom
      ? "Zoom"
      : "Virtual / Online";

    const brandColor = isTeams
      ? "#5B5FC7"
      : isMeet
      ? "#00897B"
      : isZoom
      ? "#2D8CFF"
      : "#4F46E5";

    const platformLogoUrl = isTeams
      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/120px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png"
      : isZoom
      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/120px-Zoom_Communications_Logo.svg.png"
      : isMeet
      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/120px-Google_Meet_icon_%282020%29.svg.png"
      : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/120px-Microsoft_logo.svg.png";

    const isUrl = meetingLoc.startsWith("http://") || meetingLoc.startsWith("https://");

    // Generate RFC 5545 iCalendar format
    const icsContent = generateIcsCalendar({
      title: `${data?.jobPosition || "Interview"} - ${data?.companyName || "HireFlow"}`,
      description: `Interview for ${data?.jobPosition || "Position"}\\nRound: ${data?.roundType || "General"}\\nInterviewer: ${data?.interviewer || "HR Team"}\\nMeeting Link: ${meetingLoc}`,
      location: meetingLoc,
      date: data?.interviewDate,
      time: data?.interviewTime,
      organizerEmail: data?.recruiterEmail || process.env.EMAIL || "no-reply@hireflow.com",
      organizerName: data?.companyName || "HireFlow ATS",
      attendeeEmail: email,
      attendeeName: data?.userName || data?.username || "Candidate",
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `📅 Interview Scheduled: ${data?.jobPosition || "Job"} with ${data?.companyName || "HireFlow"} (${platformName})`,
      html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f4f6f8; padding:35px 0;">
  <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.08); border:1px solid #e2e8f0;">
    
    <!-- Header with Platform Branding -->
    <div style="background: linear-gradient(135deg, ${brandColor} 0%, #312E81 100%); padding:24px; color:white;">
      <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%;">
        <tr>
          <td width="65" align="left" valign="middle">
            <img 
              src="https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png"
              alt="HireFlow Logo"
              width="50"
              style="display:block; border-radius:8px;"
            />
          </td>
          <td align="left" valign="middle" style="padding-left:12px;">
            <h2 style="margin:0; font-size:22px; font-weight:700; color:#ffffff;">HireFlow</h2>
            <p style="margin:3px 0 0; font-size:13px; color:#e0e7ff;">Online Interview Invitation • ${platformName}</p>
          </td>
          <td width="55" align="right" valign="middle">
            <img 
              src="${platformLogoUrl}"
              alt="${platformName} Logo"
              width="38"
              style="display:block; border-radius:8px; background:#ffffff; padding:4px;"
            />
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content -->
    <div style="padding:30px; color:#1f2937;">
      <h3 style="margin-top:0; font-size:20px; color:#111827;">Interview Scheduled 🎉</h3>
      <p style="font-size:15px; line-height:1.6; color:#374151;">
        Hi <strong>${data?.userName || data?.username || "Candidate"}</strong>,
      </p>
      <p style="font-size:14px; line-height:1.6; color:#4b5563;">
        Great news! You have been selected for an online interview for the position of <strong>${data?.jobPosition || "Job Opening"}</strong> at <strong>${data?.companyName || "the hiring organization"}</strong>.
      </p>

      <!-- Platform Notification Badge -->
      <div style="margin:20px 0; background:#f0f5ff; border:1px solid #c7d2fe; border-radius:8px; padding:10px 14px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td width="26" valign="middle">
              <img src="${platformLogoUrl}" width="20" style="display:block;" />
            </td>
            <td valign="middle" style="padding-left:8px;">
              <span style="font-weight:700; color:${brandColor}; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                ${platformName} Official Video Call
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Schedule Card -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:20px; margin:20px 0;">
        <h4 style="margin:0 0 14px 0; color:#1e293b; font-size:15px; font-weight:600;">📅 Meeting Schedule Details</h4>
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#334155;">
          <tr>
            <td style="padding:6px 0; font-weight:600; width:120px; color:#64748b;">Round:</td>
            <td style="padding:6px 0; font-weight:600; color:#0f172a; text-transform:capitalize;">${data?.roundType || "Technical"} Round</td>
          </tr>
          <tr>
            <td style="padding:6px 0; font-weight:600; color:#64748b;">Interviewer:</td>
            <td style="padding:6px 0; color:#0f172a;">${data?.interviewer || "Hiring Team"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; font-weight:600; color:#64748b;">Date:</td>
            <td style="padding:6px 0; color:#0f172a;">${data?.interviewDate}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; font-weight:600; color:#64748b;">Time:</td>
            <td style="padding:6px 0; color:#0f172a;">${data?.interviewTime}</td>
          </tr>
        </table>
      </div>

      <!-- Join Button CTA -->
      ${
        isUrl
          ? `
      <div style="text-align:center; margin:30px 0 20px;">
        <a 
          href="${meetingLoc}" 
          target="_blank" 
          rel="noreferrer"
          style="display:inline-block; background:${brandColor}; color:#ffffff; font-weight:700; font-size:16px; padding:14px 32px; border-radius:8px; text-decoration:none; box-shadow:0 4px 10px rgba(91,95,199,0.35);"
        >
          🚀 Join ${platformName} Meeting
        </a>
        <p style="margin:10px 0 0; font-size:12px; color:#6b7280;">Direct Link: <a href="${meetingLoc}" style="color:${brandColor}; word-break:break-all;">${meetingLoc}</a></p>
      </div>`
          : `
      <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:8px; padding:14px; margin:20px 0;">
        <p style="margin:0; font-size:13px; color:#92400e;"><strong>Location / Note:</strong> ${meetingLoc}</p>
      </div>`
      }

      ${
        data?.feedback
          ? `
      <div style="background:#f1f5f9; border-left:4px solid ${brandColor}; padding:12px 16px; border-radius:4px; margin:20px 0;">
        <p style="margin:0; font-size:13px; color:#475569;"><strong>Notes / Instructions:</strong> ${data.feedback}</p>
      </div>`
          : ""
      }

      <p style="font-size:13px; color:#64748b; line-height:1.5; margin-top:25px;">
        📌 A calendar invite (.ics) has been attached to this email. You can directly add it to your Outlook, Microsoft Teams, or Google Calendar.
      </p>

      <p style="margin-top:25px; font-size:14px; color:#374151;">Best regards,<br/><strong>HireFlow Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc; padding:18px 24px; text-align:center; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0;">
      <p style="margin:0;">HireFlow ATS Platform • Automated Interview Notification</p>
      <p style="margin:4px 0 0 0;">${new Date().toLocaleString()}</p>
    </div>
  </div>
</div>
`,
      attachments: [
        {
          filename: `interview-${(data?.jobPosition || "meeting").toLowerCase().replace(/\s+/g, "-")}.ics`,
          content: icsContent,
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
      icalEvent: {
        filename: "interview.ics",
        method: "REQUEST",
        content: icsContent,
      },
    });
    console.log(`\nCandidate Interview Email sent successfully to: ${email}`);
  } catch (error) {
    console.error("\nError sending Candidate Interview Email:", error?.message || error);
  }
};

export const InterviewEmailToRecruiter = async (emailOrObj, optionalData) => {
  try {
    const email =
      typeof emailOrObj === "object" && emailOrObj !== null && emailOrObj.email
        ? emailOrObj.email
        : emailOrObj;
    const data =
      typeof emailOrObj === "object" && emailOrObj !== null && emailOrObj.data
        ? emailOrObj.data
        : optionalData || {};

    const meetingLoc = data?.interviewLocation || "Online";
    const isTeams =
      meetingLoc.includes("teams.microsoft.com") ||
      meetingLoc.includes("teams.live.com") ||
      data?.platform === "teams";
    const isMeet = meetingLoc.includes("meet.google.com") || data?.platform === "meet";
    const isZoom = meetingLoc.includes("zoom.us") || data?.platform === "zoom";

    const platformName = isTeams
      ? "Microsoft Teams"
      : isMeet
      ? "Google Meet"
      : isZoom
      ? "Zoom"
      : "Virtual / Online";

    const brandColor = isTeams
      ? "#5B5FC7"
      : isMeet
      ? "#00897B"
      : isZoom
      ? "#2D8CFF"
      : "#4F46E5";

    const platformLogoUrl = isTeams
      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/120px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png"
      : isZoom
      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/120px-Zoom_Communications_Logo.svg.png"
      : isMeet
      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/120px-Google_Meet_icon_%282020%29.svg.png"
      : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/120px-Microsoft_logo.svg.png";

    const isUrl = meetingLoc.startsWith("http://") || meetingLoc.startsWith("https://");

    const icsContent = generateIcsCalendar({
      title: `Interview: ${data?.candidateName || "Candidate"} - ${data?.jobPosition || "Job"}`,
      description: `Interview with ${data?.candidateName || "Candidate"} for ${data?.jobPosition || "Position"}\\nRound: ${data?.roundType || "General"}\\nContact: ${data?.candidateEmail || "N/A"}\\nMeeting Link: ${meetingLoc}`,
      location: meetingLoc,
      date: data?.interviewDate,
      time: data?.interviewTime,
      organizerEmail: email,
      organizerName: data?.interviewer || "Interviewer",
      attendeeEmail: data?.candidateEmail || "",
      attendeeName: data?.candidateName || "Candidate",
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `📋 Interview Confirmed: ${data?.candidateName || "Candidate"} for ${data?.jobPosition || "Job"} (${platformName})`,
      html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f4f6f8; padding:35px 0;">
  <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.08); border:1px solid #e2e8f0;">
    
    <!-- Recruiter Header -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, ${brandColor} 100%); padding:24px; color:white;">
      <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%;">
        <tr>
          <td width="65" align="left" valign="middle">
            <img 
              src="https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png"
              alt="HireFlow Logo"
              width="50"
              style="display:block; border-radius:8px;"
            />
          </td>
          <td align="left" valign="middle" style="padding-left:12px;">
            <h2 style="margin:0; font-size:22px; font-weight:700; color:#ffffff;">HireFlow ATS</h2>
            <p style="margin:3px 0 0; font-size:13px; color:#cbd5e1;">Interviewer Confirmation • ${platformName}</p>
          </td>
          <td width="55" align="right" valign="middle">
            <img 
              src="${platformLogoUrl}"
              alt="${platformName} Logo"
              width="38"
              style="display:block; border-radius:8px; background:#ffffff; padding:4px;"
            />
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content -->
    <div style="padding:30px; color:#1f2937;">
      <h3 style="margin-top:0; font-size:20px; color:#111827;">Interview Schedule Confirmed</h3>
      <p style="font-size:14px; line-height:1.6; color:#4b5563;">
        You have scheduled an interview with <strong>${data?.candidateName || "Candidate"}</strong> for the role of <strong>${data?.jobPosition || "Position"}</strong>.
      </p>

      <!-- Candidate Dossier Card -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:18px; margin:20px 0;">
        <h4 style="margin:0 0 12px 0; font-size:14px; font-weight:700; color:#0f172a; text-transform:uppercase; letter-spacing:0.5px;">
          👤 Candidate Summary
        </h4>
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#334155;">
          <tr>
            <td style="padding:5px 0; font-weight:600; width:120px; color:#64748b;">Candidate:</td>
            <td style="padding:5px 0; color:#0f172a; font-weight:600;">${data?.candidateName || "Candidate"}</td>
          </tr>
          <tr>
            <td style="padding:5px 0; font-weight:600; color:#64748b;">Email:</td>
            <td style="padding:5px 0; color:#0f172a;">${data?.candidateEmail || "N/A"}</td>
          </tr>
          ${
            data?.resumeScore !== undefined
              ? `
          <tr>
            <td style="padding:5px 0; font-weight:600; color:#64748b;">ATS Score:</td>
            <td style="padding:5px 0; color:#4F46E5; font-weight:700;">${data.resumeScore} / 100</td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding:5px 0; font-weight:600; color:#64748b;">Round:</td>
            <td style="padding:5px 0; color:#0f172a; text-transform:capitalize;">${data?.roundType || "Technical"} Round</td>
          </tr>
          <tr>
            <td style="padding:5px 0; font-weight:600; color:#64748b;">Date & Time:</td>
            <td style="padding:5px 0; color:#0f172a; font-weight:600;">${data?.interviewDate} at ${data?.interviewTime}</td>
          </tr>
        </table>
      </div>

      <!-- Host Action CTA -->
      ${
        isUrl
          ? `
      <div style="text-align:center; margin:30px 0 20px;">
        <a 
          href="${meetingLoc}" 
          target="_blank" 
          rel="noreferrer"
          style="display:inline-block; background:${brandColor}; color:#ffffff; font-weight:700; font-size:16px; padding:14px 32px; border-radius:8px; text-decoration:none; box-shadow:0 4px 10px rgba(91,95,199,0.35);"
        >
          🚀 Start / Join ${platformName} Meeting
        </a>
        <p style="margin:10px 0 0; font-size:12px; color:#6b7280;">Direct Meeting Link: <a href="${meetingLoc}" style="color:${brandColor}; word-break:break-all;">${meetingLoc}</a></p>
      </div>`
          : `
      <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:8px; padding:14px; margin:20px 0;">
        <p style="margin:0; font-size:13px; color:#92400e;"><strong>Location / Room:</strong> ${meetingLoc}</p>
      </div>`
      }

      <p style="font-size:13px; color:#64748b; line-height:1.5; margin-top:25px;">
        📌 The calendar file (.ics) is attached so this event is automatically synced to your Outlook, Microsoft Teams, or Google Calendar.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc; padding:18px 24px; text-align:center; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0;">
      <p style="margin:0;">HireFlow ATS Platform • Recruiter Confirmation</p>
      <p style="margin:4px 0 0 0;">${new Date().toLocaleString()}</p>
    </div>
  </div>
</div>
`,
      attachments: [
        {
          filename: `interview-host-${(data?.candidateName || "candidate").toLowerCase().replace(/\s+/g, "-")}.ics`,
          content: icsContent,
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
      icalEvent: {
        filename: "interview-host.ics",
        method: "REQUEST",
        content: icsContent,
      },
    });
    console.log(`\nRecruiter Interview Email sent successfully to: ${email}`);
  } catch (error) {
    console.error("\nError sending Recruiter Interview Email:", error?.message || error);
  }
};

export const sendDualInterviewEmail = async ({
  candidateEmail,
  recruiterEmail,
  candidateData,
  recruiterData,
}) => {
  const tasks = [];
  if (candidateEmail) {
    tasks.push(InterviewEmail(candidateEmail, candidateData));
  }
  if (recruiterEmail) {
    tasks.push(InterviewEmailToRecruiter(recruiterEmail, recruiterData));
  }
  return Promise.allSettled(tasks);
};
export const hiredEmail = async ({ email, data }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "🎉 Congratulations! You're Hired",
      html: `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background:#16a34a; padding:20px; color:white;">
      <table width="100%">
        <tr>
          <td width="80">
            <img 
              src="https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png"
              width="60"
            />
          </td>
          <td align="center">
            <h2 style="margin:0;">HireFlow</h2>
            <p style="margin:5px 0 0; font-size:13px;">Hiring Platform</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Body -->
    <div style="padding:30px; color:#333;">
      
      <h2 style="color:#16a34a; margin-top:0;">🎉 Congratulations, ${data?.username}!</h2>

      <p>We are thrilled to inform you that you have been <strong>selected and hired</strong> for the role of <strong>${data?.jobPosition}</strong>.</p>

      <p>Your skills, experience, and performance throughout the hiring process truly stood out, and we are excited to have you join the team.</p>

      <!-- Offer Box -->
      <div style="margin:25px 0; padding:20px; background:#ecfdf5; border-radius:8px; border:1px solid #bbf7d0;">
        <h4 style="margin-top:0; color:#065f46;">📄 Offer Details</h4>
        <p style="margin:8px 0;"><strong>Company:</strong> ${data?.companyName}</p>
        <p style="margin:8px 0;"><strong>Joining Date:</strong> ${data?.joiningDate}</p>
        <p style="margin:8px 0;"><strong>Location:</strong> ${data?.jobLocation}</p>
      </div>

      <p>Please review the offer details and confirm your acceptance at your earliest convenience.</p>

      <p>We look forward to working with you and wish you a successful journey ahead!</p>

      <p style="margin-top:30px;">Warm regards,<br><strong>HireFlow Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb;">
      <p style="margin:0;">HireFlow, India</p>
      <p style="margin:5px 0 0;">${new Date().toLocaleString()}</p>
    </div>

  </div>
</div>
`,
    });
    console.log("\nApplication sent successfully");
  } catch (error) {
    console.error("\nError sending Application (Network Error.):", error);
  }
};
