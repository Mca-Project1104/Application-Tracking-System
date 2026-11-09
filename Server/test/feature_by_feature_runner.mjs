import axios from "axios";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";
import FormData from "form-data";
import "dotenv/config";

import User from "../model/UserModel.js";
import Candidate from "../model/CandidateModel.js";
import { Company } from "../model/CompanyModel.js";
import Job from "../model/JobModel.js";
import Application from "../model/ApplicationModel.js";

const NODE_URL = "http://localhost:8000";
const PYTHON_URL = "http://127.0.0.1:8080";
const timestamp = Date.now();

// Test Entities
const testCandidateEmail = `cand_${timestamp}@e2etest.com`;
const testCompanyEmail = `comp_${timestamp}@e2etest.com`;
const testAdminEmail = `admin_${timestamp}@e2etest.com`;
const testPassword = "SecurePassword123!";
const testNewPassword = "BrandNewPassword456!";

let candidateUser, candidateToken, candidateDocId;
let companyUser, companyToken, companyDocId;
let adminUser, adminToken;
let testJobId, testAppId;

let totalFeaturesTested = 0;
let totalFeaturesPassed = 0;

function reportResult(featureName, passed, details = "") {
  totalFeaturesTested++;
  if (passed) {
    totalFeaturesPassed++;
    console.log(`   ✅ PASS: ${featureName} ${details ? `(${details})` : ""}`);
  } else {
    console.error(`   ❌ FAIL: ${featureName} - ${details}`);
    throw new Error(`Feature test failed: ${featureName} - ${details}`);
  }
}

async function runFeatureByFeatureTests() {
  console.log("\n================================================================================");
  console.log("   🚀 COMPREHENSIVE END-TO-END FEATURE-BY-FEATURE VERIFICATION SUITE");
  console.log("================================================================================\n");

  try {
    // 0. Database Connection for direct verification & OTP extraction
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB Atlas for state assertions.\n");

    // =========================================================================
    // SUITE 1: AUTHENTICATION & USER LIFECYCLE
    // =========================================================================
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUITE 1: AUTHENTICATION & USER LIFECYCLE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Feature 1.1: Candidate Registration
    console.log("\n▶ Feature 1.1: Candidate Registration [POST /api/v1/users/register]");
    const regRes = await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "Alex",
      lastName: "Candidate",
      email: testCandidateEmail,
      password: testPassword,
      accountType: "candidate"
    });
    reportResult("Candidate Registration", regRes.status === 201 && regRes.data.message.includes("verify your email"), `Status: ${regRes.status}`);

    // Feature 1.2: Duplicate Email Rejection
    console.log("\n▶ Feature 1.2: Duplicate Email Rejection [POST /api/v1/users/register]");
    try {
      await axios.post(`${NODE_URL}/api/v1/users/register`, {
        firstName: "Duplicate",
        lastName: "User",
        email: testCandidateEmail,
        password: testPassword,
        accountType: "candidate"
      });
      reportResult("Duplicate Email Rejection", false, "Allowed duplicate email!");
    } catch (err) {
      reportResult("Duplicate Email Rejection", err.response?.status === 400, `Rejected with 400: ${err.response?.data?.message}`);
    }

    // Feature 1.3: Resend OTP (Testing both plural and singular routes)
    console.log("\n▶ Feature 1.3: Resend Verification OTP [POST /api/v1/users/resend & /user/resend]");
    const resendPlural = await axios.post(`${NODE_URL}/api/v1/users/resend`, { email: testCandidateEmail });
    const resendSingular = await axios.post(`${NODE_URL}/api/v1/user/resend`, { email: testCandidateEmail });
    reportResult("Resend OTP (Plural Route)", resendPlural.status === 200 && resendPlural.data.message === "OTP resent");
    reportResult("Resend OTP (Singular Route Alias)", resendSingular.status === 200 && resendSingular.data.message === "OTP resent");

    // Feature 1.4: Email Verification OTP (Invalid & Valid)
    console.log("\n▶ Feature 1.4: Email Verification OTP [POST /api/v1/users/verify-email]");
    try {
      await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
        email: testCandidateEmail,
        code: "000000"
      });
      reportResult("Invalid OTP Rejection", false, "Accepted fake OTP!");
    } catch (err) {
      reportResult("Invalid OTP Rejection", err.response?.status === 400, `Rejected invalid OTP with 400: ${err.response?.data?.message}`);
    }

    // Retrieve active OTP from DB
    candidateUser = await User.findOne({ email: testCandidateEmail });
    const validOtp = candidateUser.verificationCode;
    const verifyRes = await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
      email: testCandidateEmail,
      code: validOtp
    });
    reportResult("Valid Email OTP Verification", verifyRes.status === 200 && verifyRes.data.message === "Email verified successfully");

    // Feature 1.5: Candidate Login & Candidate Profile Auto-Creation
    console.log("\n▶ Feature 1.5: Candidate Login & Auto-Profile [POST /api/v1/users/login]");
    try {
      await axios.post(`${NODE_URL}/api/v1/users/login`, {
        email: testCandidateEmail,
        password: "WrongPassword!"
      });
      reportResult("Wrong Password Rejection", false, "Allowed wrong password!");
    } catch (err) {
      reportResult("Wrong Password Rejection", err.response?.status === 400, `Rejected wrong password: ${err.response?.data?.message}`);
    }

    const loginRes = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: testCandidateEmail,
      password: testPassword
    });
    candidateToken = loginRes.data.accessToken;
    reportResult("Candidate Login", loginRes.status === 200 && !!candidateToken, `JWT Token length: ${candidateToken?.length}`);

    // Verify Candidate auto-profile in DB
    const candidateProfileInDb = await Candidate.findOne({ user_id: candidateUser._id });
    candidateDocId = candidateProfileInDb._id;
    reportResult("Candidate Auto-Profile in MongoDB", !!candidateProfileInDb && candidateProfileInDb.email === testCandidateEmail, `Candidate Doc ID: ${candidateDocId}`);

    // Feature 1.6: Change / Reset Password Flow
    console.log("\n▶ Feature 1.6: Change Password [POST /api/v1/users/forgetpass]");
    const changePassRes = await axios.post(`${NODE_URL}/api/v1/users/forgetpass`, {
      email: testCandidateEmail,
      password: testPassword,
      newpassword: testNewPassword
    });
    reportResult("Change Password", changePassRes.status === 200 && changePassRes.data.message === "Password Change Successfully");

    // Verify login with new password
    const newLoginRes = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: testCandidateEmail,
      password: testNewPassword
    });
    candidateToken = newLoginRes.data.accessToken;
    reportResult("Login with Updated Password", newLoginRes.status === 200, "Successfully re-authenticated with new password");


    // =========================================================================
    // SUITE 2: CANDIDATE PROFILE & RESUME MANAGEMENT
    // =========================================================================
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUITE 2: CANDIDATE PROFILE & RESUME MANAGEMENT");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Feature 2.1: Get Candidate Profile
    console.log("\n▶ Feature 2.1: Get Candidate Profile [GET /api/v1/candidates]");
    const candProfileRes = await axios.get(`${NODE_URL}/api/v1/candidates`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    reportResult("Get Candidate Profile", candProfileRes.status === 200 && candProfileRes.data.data.user_id.firstName === "Alex", `Profile loaded for ${candProfileRes.data.data.user_id.firstName}`);

    // Feature 2.2: Update Candidate Profile Details (Bio, Skills, Links)
    console.log("\n▶ Feature 2.2: Update Candidate Profile [PUT /api/v1/candidates/update/:id]");
    const updateProfileRes = await axios.put(
      `${NODE_URL}/api/v1/candidates/update/${candidateDocId}`,
      {
        personal: "Passionate Full Stack Engineer with 4 years building scalable MERN web applications.",
        phone: "+91 9876543210",
        location: "Mumbai, India",
        linkedin: "https://linkedin.com/in/alex-dev",
        github: "https://github.com/alex-dev",
        skills: ["React", "Node.js", "Express", "MongoDB", "TypeScript", "Tailwind CSS"]
      },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    reportResult("Update Candidate Profile", updateProfileRes.status === 200 && updateProfileRes.data.candidate.skills.includes("React"), `Skills updated: ${updateProfileRes.data.candidate.skills.length} skills`);

    // Feature 2.3: Resume Parsing & ATS Analyzer
    console.log("\n▶ Feature 2.3: Resume Parsing & Scoring [POST /api/v1/resume/analyze]");
    // Find an existing PDF file from uploads directory
    const uploadFiles = fs.readdirSync("uploads").filter(f => f.endsWith(".pdf"));
    if (uploadFiles.length === 0) {
      throw new Error("No sample PDF resume found in uploads directory for testing");
    }
    const sampleResumeFile = `uploads/${uploadFiles[0]}`;

    const form = new FormData();
    form.append("resume", fs.createReadStream(sampleResumeFile), {
      filename: "test_resume.pdf",
      contentType: "application/pdf"
    });
    form.append("jobDescription", "Senior Full Stack Engineer proficient in React, Node.js, MongoDB, Express and REST APIs.");

    const resumeAnalyzeRes = await axios.post(`${NODE_URL}/api/v1/resume/analyze`, form, {
      headers: {
        Authorization: `Bearer ${candidateToken}`,
        ...form.getHeaders()
      }
    });
    reportResult("Resume Extraction & Scoring", resumeAnalyzeRes.status === 200 && resumeAnalyzeRes.data.success, `ATS Score: ${resumeAnalyzeRes.data.data.atsScore.score}%, Sections: ${Object.keys(resumeAnalyzeRes.data.data.sectionsDetected).length}`);

    // Feature 2.4: Candidate Resume Download
    console.log("\n▶ Feature 2.4: Download Candidate Resume [GET /api/v1/candidates/resume/:id]");
    const resumeDownloadRes = await axios.get(`${NODE_URL}/api/v1/candidates/resume/${candidateDocId}`, {
      responseType: "arraybuffer"
    });
    reportResult("Candidate Resume Download", resumeDownloadRes.status === 200 && resumeDownloadRes.data.length > 0, `Bytes received: ${resumeDownloadRes.data.length}`);


    // =========================================================================
    // SUITE 3: RECRUITER ONBOARDING & COMPANY PROFILE
    // =========================================================================
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUITE 3: RECRUITER ONBOARDING & COMPANY PROFILE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Feature 3.1: Recruiter Registration & Email Verification
    console.log("\n▶ Feature 3.1: Recruiter Registration [POST /api/v1/users/register]");
    const compRegRes = await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "Sarah",
      lastName: "Recruiter",
      email: testCompanyEmail,
      password: testPassword,
      accountType: "company"
    });
    reportResult("Recruiter Registration", compRegRes.status === 201);

    // Verify recruiter OTP directly from DB
    companyUser = await User.findOne({ email: testCompanyEmail });
    await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
      email: testCompanyEmail,
      code: companyUser.verificationCode
    });
    reportResult("Recruiter Email Verification", true, "Verified via OTP");

    // Recruiter Login
    const compLoginRes = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: testCompanyEmail,
      password: testPassword
    });
    companyToken = compLoginRes.data.accessToken;
    reportResult("Recruiter Login", compLoginRes.status === 200 && !!companyToken);

    // Feature 3.2: Create Company Profile
    console.log("\n▶ Feature 3.2: Create Company Profile [POST /api/v1/company/profile]");
    const createCompRes = await axios.post(
      `${NODE_URL}/api/v1/company/profile`,
      {
        name: "InnovateTech Corp",
        location: "Bengaluru, Karnataka, India",
        logo: "https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png"
      },
      { headers: { Authorization: `Bearer ${companyToken}` } }
    );
    companyDocId = createCompRes.data.company._id;
    reportResult("Create Company Profile", createCompRes.status === 201 && createCompRes.data.success, `Company ID: ${companyDocId}`);

    // Re-login to get updated JWT with company link attached
    const refreshedCompLogin = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: testCompanyEmail,
      password: testPassword
    });
    companyToken = refreshedCompLogin.data.accessToken;

    // Feature 3.3: Fetch Company Profile
    console.log("\n▶ Feature 3.3: Fetch Company Profile [GET /api/v1/company/profile]");
    const fetchCompRes = await axios.get(`${NODE_URL}/api/v1/company/profile`, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    reportResult("Fetch Company Profile", fetchCompRes.status === 200 && fetchCompRes.data.companyData.company.name === "InnovateTech Corp");

    // Feature 3.4: Recruiter Blocked From Posting Jobs Before Admin Approval
    console.log("\n▶ Feature 3.4: Recruiter Authorization Gatekeeping [POST /api/v1/jobs/add before Admin Approval]");
    try {
      await axios.post(
        `${NODE_URL}/api/v1/jobs/add`,
        {
          title: "Early Job Attempt",
          department: "IT",
          location: "Remote",
          status: "Open"
        },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      );
      reportResult("Pre-Approval Job Posting Blocked", false, "Allowed job posting without admin approval!");
    } catch (err) {
      reportResult("Pre-Approval Job Posting Blocked", err.response?.status === 403, `Correctly blocked with 403: ${err.response?.data?.message}`);
    }


    // =========================================================================
    // SUITE 4: ADMIN MODERATION & PLATFORM SECURITY
    // =========================================================================
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUITE 4: ADMIN MODERATION & PLATFORM SECURITY");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Feature 4.1: Admin Security & Role-Based Access Control (RBAC)
    console.log("\n▶ Feature 4.1: RBAC Protection [GET /api/v1/admin/users without Admin role]");
    try {
      await axios.get(`${NODE_URL}/api/v1/admin/users`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      reportResult("Non-Admin RBAC Block", false, "Non-admin accessed admin route!");
    } catch (err) {
      reportResult("Non-Admin RBAC Block", err.response?.status === 403, `Correctly rejected non-admin with 403: ${err.response?.data?.message}`);
    }

    // Create verified Admin User in DB
    adminUser = await User.create({
      firstName: "Super",
      lastName: "Administrator",
      email: testAdminEmail,
      password: "adminpassword",
      accountType: "admin",
      isVerified: true
    });
    adminToken = jwt.sign(
      { id: adminUser._id, role: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Feature 4.2: Admin List Users & Platform Statistics
    console.log("\n▶ Feature 4.2: Admin List Users & Statistics [GET /api/v1/admin/users]");
    const adminUsersRes = await axios.get(`${NODE_URL}/api/v1/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    reportResult("Admin List Users", adminUsersRes.status === 200 && adminUsersRes.data.totalUsers > 0, `Total Users: ${adminUsersRes.data.totalUsers}, Candidates: ${adminUsersRes.data.totalCandidates}, Companies: ${adminUsersRes.data.totalCompanies}`);

    // Feature 4.3: Admin List Companies
    console.log("\n▶ Feature 4.3: Admin List Companies [GET /api/v1/admin/companys]");
    const adminCompaniesRes = await axios.get(`${NODE_URL}/api/v1/admin/companys`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    reportResult("Admin List Companies", adminCompaniesRes.status === 200 && Array.isArray(adminCompaniesRes.data.company), `Found ${adminCompaniesRes.data.company.length} companies, Total: ${adminCompaniesRes.data.total}`);

    // Feature 4.4: Admin Approve Recruiter Company
    console.log("\n▶ Feature 4.4: Admin Approve Company [PUT /api/v1/admin/user/status/:id]");
    const approveCompRes = await axios.put(
      `${NODE_URL}/api/v1/admin/user/status/${companyUser._id}`,
      { status: "accepted" },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    reportResult("Admin Approve Recruiter Company", approveCompRes.status === 200 && approveCompRes.data.user.status === "accepted", `Updated company status: ${approveCompRes.data.user.status}`);

    // Feature 4.5: Admin Get User Detail
    console.log("\n▶ Feature 4.5: Admin User Detail Inspection [POST /api/v1/admin/user/detail]");
    const adminUserDetailRes = await axios.post(
      `${NODE_URL}/api/v1/admin/user/detail`,
      { id: companyUser._id },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    reportResult("Admin User Detail", adminUserDetailRes.status === 200 && adminUserDetailRes.data.data.user.email === testCompanyEmail, `User: ${adminUserDetailRes.data.data.user.email}, Type: ${adminUserDetailRes.data.data.type?.name}`);


    // =========================================================================
    // SUITE 5: JOB POSTING, QUOTA MANAGEMENT & BROWSING
    // =========================================================================
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUITE 5: JOB POSTING, QUOTA MANAGEMENT & BROWSING");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Feature 5.1: Recruiter Job Creation
    console.log("\n▶ Feature 5.1: Recruiter Post Job [POST /api/v1/jobs/add]");
    const createJobRes = await axios.post(
      `${NODE_URL}/api/v1/jobs/add`,
      {
        title: "Staff Software Engineer - React & Node.js",
        department: "Engineering",
        location: "Bengaluru (Hybrid)",
        workMode: "Hybrid",
        employmentType: "Full-time",
        experienceLevel: "Senior-level",
        salaryMin: 120000,
        salaryMax: 160000,
        openingJob: 3,
        requirements: "5+ years of software engineering experience. Strong expertise in React, Node.js, Express, and MongoDB. Experience designing scalable microservices.",
        responsibilities: "Lead frontend architecture, review pull requests, mentor junior developers, and scale backend services.",
        skillsRequired: ["React", "Node.js", "Express", "MongoDB", "TypeScript", "Microservices"],
        status: "Open"
      },
      { headers: { Authorization: `Bearer ${companyToken}` } }
    );
    testJobId = createJobRes.data.job._id;
    reportResult("Recruiter Job Creation", createJobRes.status === 201 && !!testJobId, `Job ID: ${testJobId}, Title: ${createJobRes.data.job.title}`);

    // Feature 5.2: Recruiter List Posted Jobs
    console.log("\n▶ Feature 5.2: Recruiter List Jobs [GET /api/v1/jobs/company]");
    const compJobsRes = await axios.get(`${NODE_URL}/api/v1/jobs/company`, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    reportResult("Recruiter List Jobs", compJobsRes.status === 200 && compJobsRes.data.data.length > 0, `Total Jobs found: ${compJobsRes.data.total}`);

    // Feature 5.3: Candidate Public Job Search & Browsing
    console.log("\n▶ Feature 5.3: Candidate Job Search [GET /api/v1/jobs/candidate?search=Staff]");
    const candJobsSearchRes = await axios.get(`${NODE_URL}/api/v1/jobs/candidate?search=Staff`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    reportResult("Candidate Job Search", candJobsSearchRes.status === 200 && candJobsSearchRes.data.data.length > 0, `Search returned ${candJobsSearchRes.data.data.length} matching jobs`);

    // Feature 5.4: Get Single Job Details
    console.log("\n▶ Feature 5.4: Get Job Details [GET /api/v1/jobs/:jobId]");
    const singleJobRes = await axios.get(`${NODE_URL}/api/v1/jobs/${testJobId}`);
    reportResult("Get Single Job", singleJobRes.status === 200 && singleJobRes.data.data._id === testJobId, `Retrieved job: ${singleJobRes.data.data.title}`);

    // Feature 5.5: Update Job Posting
    console.log("\n▶ Feature 5.5: Update Job Posting [PATCH /api/v1/jobs/update/:jobId]");
    const updateJobRes = await axios.patch(
      `${NODE_URL}/api/v1/jobs/update/${testJobId}`,
      {
        salaryMin: 130000,
        salaryMax: 175000,
        openingJob: 4
      },
      { headers: { Authorization: `Bearer ${companyToken}` } }
    );
    reportResult("Update Job Posting", updateJobRes.status === 200 && updateJobRes.data.message === "Updated successfully");

    // Feature 5.6: Quota Gatekeeping (Job Limit Enforcement)
    console.log("\n▶ Feature 5.6: Job Limit Quota Gatekeeping [POST /api/v1/jobs/add with reached limits]");
    // Temporarily set activeJobs equal to maxJobs
    await Company.findByIdAndUpdate(companyDocId, {
      $set: { "limits.activeJobs": 5, "limits.maxJobs": 5 }
    });
    try {
      await axios.post(
        `${NODE_URL}/api/v1/jobs/add`,
        {
          title: "Over-Quota Job",
          department: "IT",
          location: "Remote",
          status: "Open"
        },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      );
      reportResult("Job Quota Gatekeeping", false, "Allowed job posting over limit!");
    } catch (err) {
      reportResult("Job Quota Gatekeeping", err.response?.status === 403, `Correctly blocked by limit: ${err.response?.data?.message}`);
    }
    // Restore accurate activeJobs
    await Company.findByIdAndUpdate(companyDocId, {
      $set: { "limits.activeJobs": 1, "limits.maxJobs": 5 }
    });


    // =========================================================================
    // SUITE 6: JOB APPLICATION, PYTHON AI ATS SCORING & PIPELINE
    // =========================================================================
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUITE 6: JOB APPLICATION, PYTHON AI ATS SCORING & PIPELINE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Feature 6.1: Candidate Apply to Job (End-to-End AI Scoring)
    console.log("\n▶ Feature 6.1: Candidate Apply Flow -> Triggers Python FastAPI + Groq AI");
    const applyRes = await axios.post(
      `${NODE_URL}/api/v1/applications/apply`,
      {
        jobId: testJobId,
        candidateId: candidateDocId
      },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    reportResult("Candidate Apply to Job", applyRes.status === 201 && applyRes.data.msg === "Applied successfully");

    // Assert application stored in MongoDB with AI scores
    const savedApp = await Application.findOne({ jobId: testJobId, candidateId: candidateDocId });
    testAppId = savedApp._id;
    reportResult("AI Match Score Evaluated & Persisted", typeof savedApp.score === "number" && savedApp.score >= 0, `Groq Match Score: ${savedApp.score}%`);
    reportResult("AI Breakdown Persisted", !!savedApp.resume_Analyse?.matched_skills, `Matched Skills: ${savedApp.resume_Analyse?.matched_skills?.join(", ")}`);

    // Feature 6.2: Duplicate Application Prevention
    console.log("\n▶ Feature 6.2: Duplicate Application Prevention [POST /api/v1/applications/apply duplicate]");
    try {
      await axios.post(
        `${NODE_URL}/api/v1/applications/apply`,
        {
          jobId: testJobId,
          candidateId: candidateDocId
        },
        { headers: { Authorization: `Bearer ${candidateToken}` } }
      );
      reportResult("Duplicate Apply Prevention", false, "Allowed duplicate job application!");
    } catch (err) {
      reportResult("Duplicate Apply Prevention", err.response?.status === 400, `Rejected duplicate application: ${err.response?.data?.msg}`);
    }

    // Feature 6.3: Candidate View Applied Jobs
    console.log("\n▶ Feature 6.3: Candidate Applied Jobs [POST /api/v1/applications/find/application]");
    const candAppsRes = await axios.post(
      `${NODE_URL}/api/v1/applications/find/application`,
      { candidateId: candidateDocId },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    reportResult("Candidate View Applied Jobs", candAppsRes.status === 200 && candAppsRes.data.data.length > 0, `Found ${candAppsRes.data.data.length} applied jobs`);

    // Feature 6.4: Recruiter Pipeline & Stats Query
    console.log("\n▶ Feature 6.4: Recruiter Pipeline [GET /api/v1/applications]");
    const recruiterPipelineRes = await axios.get(`${NODE_URL}/api/v1/applications`, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    reportResult("Recruiter Pipeline & Dashboard", recruiterPipelineRes.status === 200 && recruiterPipelineRes.data.recentApplications.length > 0, `Total Applicants: ${recruiterPipelineRes.data.stats.totalApplicants}, Stages: ${recruiterPipelineRes.data.pipeline.length}`);

    // Feature 6.5: Stage Advancement to Interview (with Schedule & Notification)
    console.log("\n▶ Feature 6.5: Stage Advancement to Interview [PATCH /api/v1/applications/:id/status]");
    const interviewRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${testAppId}/status`,
      {
        newStatus: "interview",
        scheduleForm: { date: "2026-11-20", time: "11:00 AM", type: "technical" },
        details: [
          {
            date: "2026-11-20",
            time: "11:00 AM",
            location: "Google Meet (meet.google.com/xyz-abc-hire)",
            notes: "Technical round focusing on React architecture and Node.js microservices."
          }
        ]
      },
      { headers: { Authorization: `Bearer ${companyToken}` } }
    );
    reportResult("Stage Advancement to Interview", interviewRes.status === 200 && interviewRes.data.data.status === "interview", `Status: ${interviewRes.data.data.status}`);

    // Feature 6.6: Query Scheduled Interviews
    console.log("\n▶ Feature 6.6: Query Scheduled Interviews [GET /api/v1/applications/interviews/:id]");
    const interviewQueryRes = await axios.get(`${NODE_URL}/api/v1/applications/interviews/${testAppId}`);
    reportResult("Query Scheduled Interviews", interviewQueryRes.status === 200 && interviewQueryRes.data.length > 0, `Interview date: ${interviewQueryRes.data[0].scheduleForm?.date}`);

    // Feature 6.7: Application Resume Download
    console.log("\n▶ Feature 6.7: Application Resume Download [GET /api/v1/applications/resume/:id]");
    const appResumeDownloadRes = await axios.get(`${NODE_URL}/api/v1/applications/resume/${testAppId}`, {
      responseType: "arraybuffer"
    });
    reportResult("Application Resume Download", appResumeDownloadRes.status === 200 && appResumeDownloadRes.data.length > 0, `Bytes received: ${appResumeDownloadRes.data.length}`);

    // Feature 6.8: Stage Advancement to Hired
    console.log("\n▶ Feature 6.8: Stage Advancement to Hired [PATCH /api/v1/applications/:id/status]");
    const hireRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${testAppId}/status`,
      {
        newStatus: "hired",
        details: {
          date: "2026-12-01",
          joiningBonus: "$10,000",
          notes: "Official Offer Letter extended."
        }
      },
      { headers: { Authorization: `Bearer ${companyToken}` } }
    );
    reportResult("Stage Advancement to Hired", hireRes.status === 200 && hireRes.data.data.status === "hired", `Final Status: ${hireRes.data.data.status}`);


    // =========================================================================
    // SUITE 7: SUBSCRIPTION, BILLING & STRIPE INTEGRATION
    // =========================================================================
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUITE 7: SUBSCRIPTION, BILLING & STRIPE INTEGRATION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Feature 7.1: Query Subscription Status
    console.log("\n▶ Feature 7.1: Query Subscription Status [GET /api/v1/company/subscriptions]");
    const subRes = await axios.get(`${NODE_URL}/api/v1/company/subscriptions`, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    reportResult("Query Subscription Status", subRes.status === 200 && subRes.data.data.subscription.status === "ACTIVE", `Plan: ${subRes.data.data.subscription.plan}, Status: ${subRes.data.data.subscription.status}`);

    // Feature 7.2: Create Stripe Checkout Session
    console.log("\n▶ Feature 7.2: Stripe Checkout Session Creation [POST /api/v1/payment/create-checkout-session]");
    const stripeRes = await axios.post(`${NODE_URL}/api/v1/payment/create-checkout-session`, {
      plan: "BASIC",
      billingCycle: "monthly",
      id: companyDocId
    });
    reportResult("Stripe Checkout Session Creation", stripeRes.status === 200 && stripeRes.data.url?.startsWith("https://checkout.stripe.com"), `Checkout URL: ${stripeRes.data.url?.slice(0, 45)}...`);


    // =========================================================================
    // SUITE 8: JOB DELETION & CASCADE CLEANUP
    // =========================================================================
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUITE 8: JOB DELETION & CASCADE CLEANUP");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Feature 8.1: Recruiter Delete Job & Verify Cascade
    console.log("\n▶ Feature 8.1: Delete Job [DELETE /api/v1/jobs/delete/:id]");
    const deleteJobRes = await axios.delete(`${NODE_URL}/api/v1/jobs/delete/${testJobId}`, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    reportResult("Delete Job", deleteJobRes.status === 200 && deleteJobRes.data.message === "Job deleted successfully");

    // Verify cascade in DB
    const jobInDbAfterDelete = await Job.findById(testJobId);
    const appInDbAfterDelete = await Application.findById(testAppId);
    reportResult("Job & Application Cascade Cleanup", !jobInDbAfterDelete && !appInDbAfterDelete, "Job and applications completely removed from DB");


    // =========================================================================
    // SUITE 9: ADMIN USER DELETION & MODERATION CLEANUP
    // =========================================================================
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUITE 9: ADMIN USER DELETION & MODERATION CLEANUP");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Feature 9.1: Admin Delete User
    console.log("\n▶ Feature 9.1: Admin Delete User [DELETE /api/v1/admin/user/:id]");
    const adminDeleteUserRes = await axios.delete(`${NODE_URL}/api/v1/admin/user/${candidateUser._id}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    reportResult("Admin Delete User", adminDeleteUserRes.status === 200 && adminDeleteUserRes.data.message === "User deleted successfully", `Remaining Users: ${adminDeleteUserRes.data.totalUsers}`);

    const candidateDocAfterDelete = await Candidate.findById(candidateDocId);
    reportResult("Cascade Delete of Candidate Profile", !candidateDocAfterDelete, "Candidate document removed from DB");

    // =========================================================================
    // FINAL SUMMARY
    // =========================================================================
    console.log("\n================================================================================");
    console.log(`🏆 ALL FEATURES VERIFIED: ${totalFeaturesPassed} / ${totalFeaturesTested} PASSED (100% SUCCESS)`);
    console.log("================================================================================\n");

  } catch (error) {
    console.error("\n💥 UNEXPECTED FAILURE DURING FEATURE VERIFICATION:");
    console.error(error.response?.data || error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  } finally {
    // Thorough Cleanup of test records
    console.log("🧹 Running teardown cleanup for remaining test artifacts in DB...");
    try {
      if (mongoose.connection.readyState === 1) {
        if (testAppId) await Application.deleteOne({ _id: testAppId });
        if (testJobId) await Job.deleteOne({ _id: testJobId });
        if (companyDocId) await Company.deleteOne({ _id: companyDocId });
        if (candidateDocId) await Candidate.deleteOne({ _id: candidateDocId });
        await User.deleteMany({
          email: { $in: [testCandidateEmail, testCompanyEmail, testAdminEmail] }
        });
        await mongoose.disconnect();
        console.log("✨ Teardown complete. Database clean.");
      }
    } catch (cleanErr) {
      console.error("Cleanup error:", cleanErr.message);
    }
  }
}

runFeatureByFeatureTests();
