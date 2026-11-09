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
const timestamp = Date.now();

// Test Identifiers
const candidateEmail = `jobseeker_${timestamp}@testflow.com`;
const recruiterEmail = `recruiter_${timestamp}@testflow.com`;
const adminEmail = `admin_${timestamp}@testflow.com`;
const defaultPassword = "Password123!";
const newCandidatePassword = "NewCandidatePass456!";

let candidateUser, candidateToken, candidateDoc;
let recruiterUser, recruiterToken, companyDoc;
let adminUser, adminToken;
let testJobId, testAppId;

let passedCount = 0;
let totalCount = 0;

function check(passCondition, featureId, featureName, details = "") {
  totalCount++;
  if (passCondition) {
    passedCount++;
    console.log(`   ✅ PASS [${featureId}]: ${featureName} ${details ? `(${details})` : ""}`);
  } else {
    console.error(`   ❌ FAIL [${featureId}]: ${featureName} - ${details}`);
    throw new Error(`Assertion failed for ${featureId}: ${featureName} - ${details}`);
  }
}

async function runJobSeekerAndRecruiterE2E() {
  console.log("\n================================================================================");
  console.log("   🚀 HIREFLOW ATS: JOB SEEKER & RECRUITER COMPLETE END-TO-END VERIFICATION");
  console.log("================================================================================\n");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB Atlas.\n");

    // =========================================================================
    // ═════════════════════════════════════════════════════════════════════════
    // PART 1: JOB SEEKER (CANDIDATE) TRACK - ONE BY ONE VERIFICATION
    // ═════════════════════════════════════════════════════════════════════════
    // =========================================================================
    console.log("╔═════════════════════════════════════════════════════════════════════════════╗");
    console.log("║               TRACK 1: JOB SEEKER (CANDIDATE) FEATURES                      ║");
    console.log("╚═════════════════════════════════════════════════════════════════════════════╝");

    // JS-1.1: Candidate Registration
    console.log("\n▶ JS-1.1: Candidate Registration [POST /api/v1/users/register]");
    const regRes = await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "Devin",
      lastName: "Seeker",
      email: candidateEmail,
      password: defaultPassword,
      accountType: "candidate"
    });
    check(regRes.status === 201 && regRes.data.message.includes("verify your email"), "JS-1.1", "Candidate Registration", `Status: ${regRes.status}`);

    // JS-1.2: Duplicate Email Rejection
    console.log("\n▶ JS-1.2: Duplicate Registration Rejection [POST /api/v1/users/register]");
    try {
      await axios.post(`${NODE_URL}/api/v1/users/register`, {
        firstName: "Duplicate",
        lastName: "Candidate",
        email: candidateEmail,
        password: defaultPassword,
        accountType: "candidate"
      });
      check(false, "JS-1.2", "Duplicate Registration Rejection", "Allowed duplicate registration!");
    } catch (err) {
      check(err.response?.status === 400, "JS-1.2", "Duplicate Registration Rejection", `Rejected with 400: ${err.response?.data?.message}`);
    }

    // JS-1.3: Resend Verification OTP
    console.log("\n▶ JS-1.3: Resend Verification OTP [POST /api/v1/users/resend & /user/resend]");
    const resendRes1 = await axios.post(`${NODE_URL}/api/v1/users/resend`, { email: candidateEmail });
    const resendRes2 = await axios.post(`${NODE_URL}/api/v1/user/resend`, { email: candidateEmail });
    check(resendRes1.status === 200 && resendRes2.status === 200, "JS-1.3", "Resend Verification OTP (Plural & Singular Routes)");

    // JS-1.4: Email Verification OTP (Invalid & Valid)
    console.log("\n▶ JS-1.4: Email Verification OTP [POST /api/v1/users/verify-email]");
    try {
      await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
        email: candidateEmail,
        code: "000000"
      });
      check(false, "JS-1.4", "Invalid OTP Rejection", "Accepted invalid OTP!");
    } catch (err) {
      check(err.response?.status === 400, "JS-1.4", "Invalid OTP Rejection", `Rejected invalid OTP: ${err.response?.data?.message}`);
    }

    candidateUser = await User.findOne({ email: candidateEmail });
    const validCandidateOtp = candidateUser.verificationCode;
    const verifyRes = await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
      email: candidateEmail,
      code: validCandidateOtp
    });
    check(verifyRes.status === 200 && verifyRes.data.message === "Email verified successfully", "JS-1.4", "Valid Email Verification OTP");

    // JS-1.5: Candidate Login & Candidate Profile Auto-Creation
    console.log("\n▶ JS-1.5: Candidate Login & Auto-Profile [POST /api/v1/users/login]");
    try {
      await axios.post(`${NODE_URL}/api/v1/users/login`, {
        email: candidateEmail,
        password: "IncorrectPassword!"
      });
      check(false, "JS-1.5", "Wrong Password Rejection", "Allowed incorrect password!");
    } catch (err) {
      check(err.response?.status === 400, "JS-1.5", "Wrong Password Rejection", `Rejected with 400: ${err.response?.data?.message}`);
    }

    const loginRes = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: candidateEmail,
      password: defaultPassword
    });
    candidateToken = loginRes.data.accessToken;
    check(loginRes.status === 200 && !!candidateToken, "JS-1.5", "Candidate Login JWT Issuance");

    // Verify auto-profile creation
    candidateDoc = await Candidate.findOne({ user_id: candidateUser._id });
    check(!!candidateDoc && candidateDoc.email === candidateEmail, "JS-1.5", "Candidate Auto-Profile in MongoDB", `Doc ID: ${candidateDoc._id}`);

    // JS-1.6: Change Password Flow
    console.log("\n▶ JS-1.6: Change Password Flow [POST /api/v1/users/forgetpass]");
    const changePassRes = await axios.post(`${NODE_URL}/api/v1/users/forgetpass`, {
      email: candidateEmail,
      password: defaultPassword,
      newpassword: newCandidatePassword
    });
    check(changePassRes.status === 200 && changePassRes.data.message === "Password Change Successfully", "JS-1.6", "Change Password Request");

    const reAuthRes = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: candidateEmail,
      password: newCandidatePassword
    });
    candidateToken = reAuthRes.data.accessToken;
    check(reAuthRes.status === 200 && !!candidateToken, "JS-1.6", "Re-Authentication with Updated Password");

    // JS-2.1: Get Candidate Profile
    console.log("\n▶ JS-2.1: Get Candidate Profile [GET /api/v1/candidates]");
    const getProfileRes = await axios.get(`${NODE_URL}/api/v1/candidates`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    check(getProfileRes.status === 200 && getProfileRes.data.data.email === candidateEmail, "JS-2.1", "Get Candidate Profile", `Candidate: ${getProfileRes.data.data.email}`);

    // JS-2.2: Update Candidate Profile Details (Bio, Skills, Phone, Location)
    console.log("\n▶ JS-2.2: Update Candidate Profile [PUT /api/v1/candidates/update/:id]");
    const updateProfileRes = await axios.put(
      `${NODE_URL}/api/v1/candidates/update/${candidateDoc._id}`,
      {
        personal: "Senior Cloud Engineer with deep expertise in Kubernetes, AWS, Go, and Terraform.",
        phone: "+1-555-0987",
        location: "Seattle, WA",
        linkedin: "https://linkedin.com/in/devin-seeker",
        github: "https://github.com/devin-seeker",
        skills: ["Kubernetes", "AWS", "Terraform", "Go", "Docker", "CI/CD"]
      },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    check(updateProfileRes.status === 200 && updateProfileRes.data.candidate.skills.includes("Kubernetes"), "JS-2.2", "Update Candidate Profile", `Skills count: ${updateProfileRes.data.candidate.skills.length}`);

    // Attach resume text & URL to candidate profile
    candidateDoc.resumeText = "Senior Cloud Architect with 6+ years experience in Kubernetes, AWS, Terraform, Go, Docker, Microservices, and Prometheus monitoring.";
    candidateDoc.resumeUrl = "uploads/Companied.pdf";
    await candidateDoc.save();

    // JS-2.3: Candidate Resume Download
    console.log("\n▶ JS-2.3: Candidate Resume Download [GET /api/v1/candidates/resume/:id]");
    const candResumeDlRes = await axios.get(`${NODE_URL}/api/v1/candidates/resume/${candidateDoc._id}`, {
      responseType: "arraybuffer"
    });
    check(candResumeDlRes.status === 200 && candResumeDlRes.data.length > 0, "JS-2.3", "Candidate Resume Download", `Delivered ${candResumeDlRes.data.length} bytes`);

    // JS-4.1: Standalone AI ATS Resume Scoring
    console.log("\n▶ JS-4.1: Standalone AI ATS Resume Scoring [POST /api/v1/resume/analyze]");
    const uploadFiles = fs.readdirSync("uploads").filter(f => f.endsWith(".pdf"));
    if (uploadFiles.length === 0) throw new Error("No PDF found in uploads directory for ATS testing");
    const testPdfPath = `uploads/${uploadFiles[0]}`;

    const form = new FormData();
    form.append("resume", fs.createReadStream(testPdfPath), {
      filename: "devin_resume.pdf",
      contentType: "application/pdf"
    });
    form.append("jobDescription", "Senior Cloud Engineer proficient in Kubernetes, AWS, Terraform, Docker, Go, and Cloud Architecture.");

    const atsRes = await axios.post(`${NODE_URL}/api/v1/resume/analyze`, form, {
      headers: {
        Authorization: `Bearer ${candidateToken}`,
        ...form.getHeaders()
      }
    });
    check(atsRes.status === 200 && atsRes.data.success, "JS-4.1", "Standalone AI ATS Evaluation", `Score: ${atsRes.data.data.atsScore.score}%`);
    const detectedSections = Object.keys(atsRes.data.data.sectionsDetected || {});
    check(detectedSections.length > 0, "JS-4.1", "ATS Resume Sections Detected", `Sections: ${detectedSections.join(", ")}`);

    // =========================================================================
    // ═════════════════════════════════════════════════════════════════════════
    // PART 2: RECRUITER (COMPANY) TRACK - ONE BY ONE VERIFICATION
    // ═════════════════════════════════════════════════════════════════════════
    // =========================================================================
    console.log("\n╔═════════════════════════════════════════════════════════════════════════════╗");
    console.log("║               TRACK 2: RECRUITER (COMPANY) FEATURES                         ║");
    console.log("╚═════════════════════════════════════════════════════════════════════════════╝");

    // RC-1.1: Recruiter Registration & Email Verification
    console.log("\n▶ RC-1.1: Recruiter Registration [POST /api/v1/users/register]");
    const recruiterRegRes = await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "Samantha",
      lastName: "TalentLead",
      email: recruiterEmail,
      password: defaultPassword,
      accountType: "company"
    });
    check(recruiterRegRes.status === 201, "RC-1.1", "Recruiter Registration", `Email: ${recruiterEmail}`);

    recruiterUser = await User.findOne({ email: recruiterEmail });
    await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
      email: recruiterEmail,
      code: recruiterUser.verificationCode
    });
    check(true, "RC-1.1", "Recruiter Email Verification via OTP");

    // RC-1.2: Recruiter Login
    console.log("\n▶ RC-1.2: Recruiter Login [POST /api/v1/users/login]");
    const recruiterLoginRes = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: recruiterEmail,
      password: defaultPassword
    });
    recruiterToken = recruiterLoginRes.data.accessToken;
    check(recruiterLoginRes.status === 200 && !!recruiterToken, "RC-1.2", "Recruiter Login & JWT Issuance");

    // RC-2.1: Company Profile Setup
    console.log("\n▶ RC-2.1: Company Profile Setup [POST /api/v1/company/profile]");
    const createCompanyRes = await axios.post(
      `${NODE_URL}/api/v1/company/profile`,
      {
        name: "CloudScale Technologies",
        location: "Seattle, WA, USA",
        logo: "https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png"
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    companyDoc = createCompanyRes.data.company;
    check(createCompanyRes.status === 201 && !!companyDoc._id, "RC-2.1", "Create Company Profile", `Company ID: ${companyDoc._id}`);

    // Refresh recruiter token to include linked company
    const refreshLogin = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: recruiterEmail,
      password: defaultPassword
    });
    recruiterToken = refreshLogin.data.accessToken;

    // RC-2.2: Pre-Approval Job Posting Gatekeeping
    console.log("\n▶ RC-2.2: Pre-Approval Gatekeeping [POST /api/v1/jobs/add before admin approval]");
    try {
      await axios.post(
        `${NODE_URL}/api/v1/jobs/add`,
        {
          title: "Premature Job",
          department: "IT",
          location: "Remote",
          status: "Open"
        },
        { headers: { Authorization: `Bearer ${recruiterToken}` } }
      );
      check(false, "RC-2.2", "Pre-Approval Gatekeeping", "Allowed job posting without admin approval!");
    } catch (err) {
      check(err.response?.status === 403, "RC-2.2", "Pre-Approval Gatekeeping", `Blocked with 403: ${err.response?.data?.message}`);
    }

    // RC-2.3: Admin Approval Workflow
    console.log("\n▶ RC-2.3: Admin Approval Workflow [PUT /api/v1/admin/user/status/:id]");
    adminUser = await User.create({
      firstName: "Root",
      lastName: "Admin",
      email: adminEmail,
      password: "adminpassword",
      accountType: "admin",
      isVerified: true
    });
    adminToken = jwt.sign(
      { id: adminUser._id, role: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const approveRes = await axios.put(
      `${NODE_URL}/api/v1/admin/user/status/${recruiterUser._id}`,
      { status: "accepted" },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    check(approveRes.status === 200 && approveRes.data.user.status === "accepted", "RC-2.3", "Admin Approved Recruiter Account");

    // Grant PRO subscription to company
    await Company.findByIdAndUpdate(companyDoc._id, {
      $set: {
        isVerified: true,
        "subscription.plan": "PRO",
        "subscription.status": "ACTIVE",
        "limits.maxJobs": 50,
        "limits.activeJobs": 0
      }
    });

    // RC-3.1: Query Subscription Status & Quota
    console.log("\n▶ RC-3.1: Query Subscription Status & Quota [GET /api/v1/company/subscriptions]");
    const subRes = await axios.get(`${NODE_URL}/api/v1/company/subscriptions`, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    check(subRes.status === 200 && subRes.data.data.subscription.plan === "PRO", "RC-3.1", "Subscription Query Verified", `Plan: ${subRes.data.data.subscription.plan}`);

    // RC-3.2: Stripe Checkout Session Creation
    console.log("\n▶ RC-3.2: Stripe Checkout Session Creation [POST /api/v1/payment/create-checkout-session]");
    const stripeRes = await axios.post(`${NODE_URL}/api/v1/payment/create-checkout-session`, {
      plan: "BASIC",
      billingCycle: "monthly",
      id: companyDoc._id
    });
    check(stripeRes.status === 200 && stripeRes.data.url?.includes("checkout.stripe.com"), "RC-3.2", "Stripe Checkout URL Generated");

    // RC-4.1: Recruiter Post Job
    console.log("\n▶ RC-4.1: Recruiter Post Job [POST /api/v1/jobs/add]");
    const jobPostRes = await axios.post(
      `${NODE_URL}/api/v1/jobs/add`,
      {
        title: "Principal Cloud Native Architect",
        department: "Infrastructure",
        location: "Seattle, WA (Hybrid)",
        workMode: "Hybrid",
        employmentType: "Full-time",
        experienceLevel: "Senior-level",
        salaryMin: 175000,
        salaryMax: 235000,
        openingJob: 2,
        requirements: "6+ years of cloud native systems engineering. Strong expertise in Kubernetes, AWS, Terraform, Docker, Go, and Prometheus.",
        responsibilities: "Scale multi-region Kubernetes clusters and lead infrastructure automation.",
        skillsRequired: ["Kubernetes", "AWS", "Terraform", "Go", "Docker", "Prometheus"],
        status: "Open"
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    testJobId = jobPostRes.data.job._id;
    check(jobPostRes.status === 201 && !!testJobId, "RC-4.1", "Post New Job with 2 Openings", `Job ID: ${testJobId}`);

    // RC-4.2: Job Limit Quota Enforcement
    console.log("\n▶ RC-4.2: Job Limit Quota Enforcement [POST /api/v1/jobs/add over quota]");
    await Company.findByIdAndUpdate(companyDoc._id, {
      $set: { "limits.activeJobs": 10, "limits.maxJobs": 10 }
    });
    try {
      await axios.post(
        `${NODE_URL}/api/v1/jobs/add`,
        {
          title: "Blocked Job Over Quota",
          department: "IT",
          location: "Remote",
          status: "Open"
        },
        { headers: { Authorization: `Bearer ${recruiterToken}` } }
      );
      check(false, "RC-4.2", "Job Limit Quota Enforcement", "Allowed posting over limit!");
    } catch (err) {
      check(err.response?.status === 403, "RC-4.2", "Job Limit Quota Enforcement", `Blocked by quota with 403: ${err.response?.data?.message}`);
    }
    // Restore quota
    await Company.findByIdAndUpdate(companyDoc._id, {
      $set: { "limits.activeJobs": 1, "limits.maxJobs": 50 }
    });

    // RC-4.3: Recruiter List Posted Jobs
    console.log("\n▶ RC-4.3: Recruiter List Posted Jobs [GET /api/v1/jobs/company]");
    const compJobsRes = await axios.get(`${NODE_URL}/api/v1/jobs/company`, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    check(compJobsRes.status === 200 && compJobsRes.data.data.length > 0, "RC-4.3", "Recruiter List Jobs", `Jobs found: ${compJobsRes.data.total}`);

    // RC-4.4: Update Job Posting
    console.log("\n▶ RC-4.4: Update Job Posting [PATCH /api/v1/jobs/update/:jobId]");
    const updateJobRes = await axios.patch(
      `${NODE_URL}/api/v1/jobs/update/${testJobId}`,
      {
        salaryMin: 180000,
        salaryMax: 245000,
        openingJob: 3
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    check(updateJobRes.status === 200 && updateJobRes.data.message === "Updated successfully", "RC-4.4", "Job Updated Successfully");

    // =========================================================================
    // CROSS-TRACK: CANDIDATE DISCOVERS AND APPLIES TO THE JOB
    // =========================================================================
    console.log("\n───────────────────────────────────────────────────────────────────────────────");
    console.log("CROSS-TRACK: CANDIDATE DISCOVERY, APPLICATION & AI ATS SCORING");
    console.log("───────────────────────────────────────────────────────────────────────────────");

    // JS-3.1: Candidate Search & Browsing
    console.log("\n▶ JS-3.1: Candidate Job Search [GET /api/v1/jobs/candidate?search=Architect]");
    const searchRes = await axios.get(`${NODE_URL}/api/v1/jobs/candidate?search=Architect`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    check(searchRes.status === 200 && searchRes.data.data.length > 0, "JS-3.1", "Candidate Job Search API", `Matches: ${searchRes.data.data.length}`);

    // JS-3.2: Get Single Job Details
    console.log("\n▶ JS-3.2: Single Job Details [GET /api/v1/jobs/:jobId]");
    const singleJobRes = await axios.get(`${NODE_URL}/api/v1/jobs/${testJobId}`);
    check(singleJobRes.status === 200 && singleJobRes.data.data._id === String(testJobId), "JS-3.2", "Single Job Details Retrieval", `Title: ${singleJobRes.data.data.title}`);

    // JS-5.1: Candidate Apply to Job (End-to-End AI Scoring via Python FastAPI)
    console.log("\n▶ JS-5.1: Candidate Apply Flow -> FastAPI Groq AI Match Scoring");
    const applyRes = await axios.post(
      `${NODE_URL}/api/v1/applications/apply`,
      {
        jobId: testJobId,
        candidateId: candidateDoc._id
      },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    check(applyRes.status === 201 && applyRes.data.msg === "Applied successfully", "JS-5.1", "Candidate Apply to Job API");

    const savedApplication = await Application.findOne({ jobId: testJobId, candidateId: candidateDoc._id });
    testAppId = savedApplication._id;
    check(typeof savedApplication.score === "number" && savedApplication.score >= 0, "JS-5.1", "Groq AI Match Score Stored", `Score: ${savedApplication.score}%`);
    check(!!savedApplication.resume_Analyse?.matched_skills, "JS-5.1", "AI Matched Skills Breakdown Stored", `Skills: ${savedApplication.resume_Analyse?.matched_skills?.join(", ")}`);

    // JS-5.2: Duplicate Application Prevention
    console.log("\n▶ JS-5.2: Duplicate Application Prevention [POST /api/v1/applications/apply duplicate]");
    try {
      await axios.post(
        `${NODE_URL}/api/v1/applications/apply`,
        {
          jobId: testJobId,
          candidateId: candidateDoc._id
        },
        { headers: { Authorization: `Bearer ${candidateToken}` } }
      );
      check(false, "JS-5.2", "Duplicate Application Prevention", "Allowed duplicate application!");
    } catch (err) {
      check(err.response?.status === 400, "JS-5.2", "Duplicate Application Prevention", `Rejected with 400: ${err.response?.data?.msg}`);
    }

    // JS-6.1: Candidate Applications History
    console.log("\n▶ JS-6.1: Candidate Applications History [POST /api/v1/applications/find/application]");
    const candHistoryRes = await axios.post(
      `${NODE_URL}/api/v1/applications/find/application`,
      { candidateId: candidateDoc._id },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    check(candHistoryRes.status === 200 && candHistoryRes.data.data.length > 0, "JS-6.1", "Candidate History Retrieved", `Applications: ${candHistoryRes.data.data.length}`);

    // =========================================================================
    // RECRUITER PIPELINE, INTERVIEW SCHEDULING & DECISIONS
    // =========================================================================
    console.log("\n───────────────────────────────────────────────────────────────────────────────");
    console.log("RECRUITER PIPELINE, INTERVIEW SCHEDULING & HIRING DECISIONS");
    console.log("───────────────────────────────────────────────────────────────────────────────");

    // RC-5.1: Recruiter Dashboard Overview
    console.log("\n▶ RC-5.1: Recruiter Dashboard Overview [GET /api/v1/applications]");
    const dashboardRes = await axios.get(`${NODE_URL}/api/v1/applications`, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    check(dashboardRes.status === 200, "RC-5.1", "Recruiter Dashboard API 200 OK");
    check(dashboardRes.data.stats.totalApplicants >= 1, "RC-5.1", "Stats: Total Applicants Count", `Count: ${dashboardRes.data.stats.totalApplicants}`);
    check(dashboardRes.data.recentApplications.length >= 1, "RC-5.1", "Recent Applications List Populated", `Count: ${dashboardRes.data.recentApplications.length}`);

    // RC-6.1: Hiring Pipeline Capacity-Driven Intake & ATS Ranking
    console.log("\n▶ RC-6.1: Pipeline Capacity & ATS Ranking");
    const appliedStage = dashboardRes.data.pipeline?.find(s => s.name === "applied");
    check(appliedStage && appliedStage.count >= 1, "RC-6.1", "Pipeline 'applied' Stage Contains Candidate", `Count: ${appliedStage?.count}`);

    // RC-6.2: Pipeline Stage Advancement to Shortlisted
    console.log("\n▶ RC-6.2: Stage Advancement to Shortlisted [PATCH /api/v1/applications/:id/status]");
    const shortlistRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${testAppId}/status`,
      { newStatus: "shortlisted" },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    check(shortlistRes.status === 200 && shortlistRes.data.data.status === "shortlisted", "RC-6.2", "Moved to 'shortlisted'");

    // RC-7.1: Schedule Technical Interview
    console.log("\n▶ RC-7.1: Schedule Technical Interview [PATCH /api/v1/applications/:id/status]");
    const interviewData = {
      date: "2026-11-28",
      time: "02:00 PM",
      type: "technical",
      interviewer: "Dr. Evelyn Reed (Principal Cloud Architect)",
      location: "https://meet.google.com/hireflow-tech-interview",
      notes: "System design deep dive: Kubernetes multi-cluster failover & etcd consensus."
    };

    const scheduleRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${testAppId}/status`,
      {
        newStatus: "interview",
        scheduleForm: interviewData,
        details: [interviewData]
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    check(scheduleRes.status === 200 && scheduleRes.data.data.status === "interview", "RC-7.1", "Candidate Moved to 'interview'");
    check(scheduleRes.data.data.scheduleForm?.location.includes("meet.google.com"), "RC-7.1", "Interview Google Meet Link Saved", scheduleRes.data.data.scheduleForm?.location);

    // RC-7.2: Query Scheduled Interviews API
    console.log("\n▶ RC-7.2: Query Scheduled Interviews API [GET /api/v1/applications/interviews/:id]");
    const queryInterviewsRes = await axios.get(`${NODE_URL}/api/v1/applications/interviews/${testAppId}`);
    check(queryInterviewsRes.status === 200 && queryInterviewsRes.data.length > 0, "RC-7.2", "Recruiter Queries Scheduled Interviews", `Count: ${queryInterviewsRes.data.length}`);
    const intvItem = queryInterviewsRes.data[0];
    const sForm = intvItem.scheduleForm || intvItem;
    check(sForm.location === "https://meet.google.com/hireflow-tech-interview", "RC-7.2", "Interview Meeting Link Verified", sForm.location);

    // RC-7.3: Reschedule / Update Interview
    console.log("\n▶ RC-7.3: Reschedule / Update Interview [PATCH /api/v1/applications/:id/status]");
    const rescheduleData = {
      date: "2026-11-30",
      time: "04:30 PM",
      type: "managerial",
      interviewer: "Marcus Vance (VP of Engineering)",
      location: "https://meet.google.com/hireflow-managerial-round",
      notes: "Leadership principles and team scale discussion."
    };

    const rescheduleRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${testAppId}/status`,
      {
        newStatus: "interview",
        scheduleForm: rescheduleData,
        details: [rescheduleData]
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    check(rescheduleRes.status === 200 && rescheduleRes.data.data.scheduleForm?.date === "2026-11-30", "RC-7.3", "Interview Rescheduled to 2026-11-30");

    // JS-6.2: Candidate View Scheduled Interview Details
    console.log("\n▶ JS-6.2: Candidate View Scheduled Interview Details in Application");
    const candAppViewRes = await axios.post(
      `${NODE_URL}/api/v1/applications/find/application`,
      { candidateId: candidateDoc._id },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    const candidateAppObj = candAppViewRes.data.data.find(a => String(a._id) === String(testAppId));
    check(candidateAppObj?.status === "interview", "JS-6.2", "Candidate Sees Application Status === 'interview'");
    check(candidateAppObj?.scheduleForm?.location.includes("hireflow-managerial-round"), "JS-6.2", "Candidate Sees Rescheduled Meeting URL in Application Details");

    // RC-8.1: Application Resume Download
    console.log("\n▶ RC-8.1: Application Resume Download [GET /api/v1/applications/resume/:id]");
    const appResumeDlRes = await axios.get(`${NODE_URL}/api/v1/applications/resume/${testAppId}`, {
      responseType: "arraybuffer"
    });
    check(appResumeDlRes.status === 200 && appResumeDlRes.data.length > 0, "RC-8.1", "Recruiter Application Resume Download", `Delivered ${appResumeDlRes.data.length} bytes`);

    // RC-9.1: Extend Offer & Mark as Hired
    console.log("\n▶ RC-9.1: Extend Offer & Mark as Hired [PATCH /api/v1/applications/:id/status]");
    const hiredRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${testAppId}/status`,
      {
        newStatus: "hired",
        details: {
          date: "2026-12-15",
          joiningBonus: "$15,000",
          notes: "Official offer extended with stock units."
        }
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    check(hiredRes.status === 200 && hiredRes.data.data.status === "hired", "RC-9.1", "Candidate Marked as Hired in MongoDB", `Final Status: ${hiredRes.data.data.status}`);

    // Verify candidate history reflects 'hired'
    const finalCandView = await axios.post(
      `${NODE_URL}/api/v1/applications/find/application`,
      { candidateId: candidateDoc._id },
      { headers: { Authorization: `Bearer ${candidateToken}` } }
    );
    const hiredApp = finalCandView.data.data.find(a => String(a._id) === String(testAppId));
    check(hiredApp?.status === "hired", "RC-9.1", "Candidate Sees 'Hired' Status in Application Detail");

    // RC-10.1: Job Deletion & Cascade Clean
    console.log("\n▶ RC-10.1: Job Deletion & Cascade Verification [DELETE /api/v1/jobs/delete/:id]");
    const deleteJobRes = await axios.delete(`${NODE_URL}/api/v1/jobs/delete/${testJobId}`, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    check(deleteJobRes.status === 200 && deleteJobRes.data.message === "Job deleted successfully", "RC-10.1", "Job Deleted via API");

    const jobInDb = await Job.findById(testJobId);
    const appInDb = await Application.findById(testAppId);
    check(!jobInDb && !appInDb, "RC-10.1", "Cascade Cleanup: Job & Application Completely Purged");

    // =========================================================================
    // TEARDOWN & DATABASE PURGE
    // =========================================================================
    console.log("\n───────────────────────────────────────────────────────────────────────────────");
    console.log("TEARDOWN & DATABASE PURGE");
    console.log("───────────────────────────────────────────────────────────────────────────────");

    if (candidateDoc?._id) await Candidate.findByIdAndDelete(candidateDoc._id);
    if (companyDoc?._id) await Company.findByIdAndDelete(companyDoc._id);
    await User.deleteMany({
      email: { $in: [candidateEmail, recruiterEmail, adminEmail] }
    });
    check(true, "RC-10.2", "Teardown: Ephemeral Users & Profiles Purged From Atlas");

    // =========================================================================
    // FINAL SUMMARY
    // =========================================================================
    console.log("\n================================================================================");
    console.log(`🏆 COMPLETE VERIFICATION: ${passedCount} / ${totalCount} PASSED (100% SUCCESS)`);
    console.log("================================================================================\n");

  } catch (err) {
    console.error("\n💥 UNEXPECTED FAILURE DURING VERIFICATION:");
    console.error(err.response?.data || err.message);
    if (err.stack) console.error(err.stack);

    // Teardown on failure
    try {
      if (testAppId) await Application.findByIdAndDelete(testAppId);
      if (testJobId) await Job.findByIdAndDelete(testJobId);
      if (candidateDoc?._id) await Candidate.findByIdAndDelete(candidateDoc._id);
      if (companyDoc?._id) await Company.findByIdAndDelete(companyDoc._id);
      await User.deleteMany({
        email: { $in: [candidateEmail, recruiterEmail, adminEmail] }
      });
      console.log("   🧹 Cleaned up created entities after error.");
    } catch (cleanErr) {
      console.error("   ⚠️ Failed to complete cleanup:", cleanErr.message);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("📦 Disconnected from MongoDB Atlas.\n");
  }
}

runJobSeekerAndRecruiterE2E();
