import nodemailer from "nodemailer";

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

export const InterviewEmail = async (email, data) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Application Update & Interview Schedule",
      html: `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    
    <div style="background:#4F46E5; padding:20px; color:white;">
      <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%;">
        <tr>
          <!-- Left Side: Logo -->
          <td width="80" align="left" valign="middle" style="width: 80px;">
            <img 
              src="https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png"
              alt="HireFlow Logo"
              width="60"
              style="display:block;"
            />
          </td>
          <td align="center" valign="middle">
            <h2 style="margin:0; font-size:24px;">HireFlow</h2>
            <p style="margin:5px 0 0; font-size:13px; opacity:0.9;">Resume Ranking System</p>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding:30px; color:#333;">
      
      <h3 style="margin-top:0; color:#1f2937;">Application Update</h3>

      <p>Hi <strong>${data?.userName}</strong>,</p>

      <p>We have reviewed your application for the <strong>${data?.jobPosition}</strong> role. Below is your evaluation result and next steps.</p>

      <div style="margin:20px 0;">
        <span style="background:#e0e7ff; color:#3730a3; padding:6px 14px; border-radius:20px; font-size:13px; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">
          Status: ${data?.status}
        </span>
      </div>

      <div style="margin:25px 0; padding:20px; background:#f8fafc; border-radius:8px; text-align:center; border:1px solid #e2e8f0;">
        <p style="margin:0 0 10px; font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Resume Score</p>
        <div style="font-size:38px; font-weight:bold; color:#4F46E5; line-height:1;">
          ${data?.resumeScore}<span style="font-size:18px; color:#94a3b8;">/100</span>
        </div>
      </div>
      
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:20px;">
        <h4 style="margin:0 0 15px 0; color:#1e40af; font-size:16px;">📅 Interview Schedule</h4>
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#1e3a8a;">
          <tr>
            <td style="padding-bottom:10px; font-weight:bold; width:80px;">Date:</td>
            <td style="padding-bottom:10px;">${data.interviewDate}</td>
          </tr>
          <tr>
            <td style="padding-bottom:10px; font-weight:bold;">Time:</td>
            <td style="padding-bottom:10px;">${data.interviewTime}</td>
          </tr>
          <tr>
            <td style="font-weight:bold;">Location:</td>
            <td>${data?.interviewLocation}</td>
          </tr>
        </table>
      </div>

      <p style="margin-top:30px; font-size:14px; color:#6b7280;">If you have any questions, feel free to reply to this email.</p>
      <p style="margin-bottom:0;">— HireFlow Team</p>
    </div>

    <div style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb;">
      <p style="margin:0;">HireFlow, India</p>
      <p style="margin:5px 0 0 0;">${new Date().toLocaleString()}</p>
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
export const HiredEmial = async ({ email, data }) => {
  try {
    console.log(email, data);
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
