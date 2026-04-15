import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  const date = new Date();

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
      <p>${date.toLocaleString()}</p>
    </div>

  </div>
</div>
`,
  });
};

export const sendSimpleLoginEmail = async (email, ipAddress) => {
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
