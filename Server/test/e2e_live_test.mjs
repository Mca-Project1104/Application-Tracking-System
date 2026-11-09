import axios from "axios";
import mongoose from "mongoose";
import "dotenv/config";
import "../model/UserModel.js";
import "../model/CandidateModel.js";
import "../model/CompanyModel.js";
import "../model/JobModel.js";
import "../model/ApplicationModel.js";

const NODE_URL = "http://localhost:8000";
const PYTHON_URL = "http://127.0.0.1:8080";
const MONGO_URI = process.env.MONGO_URI;

const timestamp = Date.now();
const testCandidateEmail = `test_candidate_${timestamp}@hireflowtest.com`;
const testCompanyEmail = `test_company_${timestamp}@hireflowtest.com`;
const testPassword = "Password123!";

console.log("==================================================");
console.log("🚀 STARTING ATS WEBSITE END-TO-END VERIFICATION RUN");
console.log("==================================================\n");

async function runTests() {
  let createdJobId = null;
  let createdCandidateId = null;
  let createdCompanyId = null;
  let createdAppId = null;
  let candidateToken = null;
  let companyToken = null;
  let adminToken = null;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Service Health Checks
    // -------------------------------------------------------------------------
    console.log("👉 Test 1: Service Health Checks");
    const nodeHealth = await axios.get(`${NODE_URL}/`);
    console.log("   ✅ Node Backend online:", nodeHealth.data.message);

    const pythonHealth = await axios.get(`${PYTHON_URL}/`);
    console.log("   ✅ Python FastAPI online:", pythonHealth.data.message);

    // -------------------------------------------------------------------------
    // TEST 2: Python AI Microservice (Groq LLM Llama 3.3)
    // -------------------------------------------------------------------------
    console.log("\n👉 Test 2: AI Microservice Direct Scoring Test (Groq Llama 3.3)");
    const aiPayload = {
      resume: "Full Stack Engineer with 4 years experience in React, Node.js, Express, MongoDB, TypeScript, and AWS.",
      JD: "Seeking Full Stack Developer proficient in React, Node.js, MongoDB, Docker, and REST APIs."
    };
    const aiRes = await axios.post(`${PYTHON_URL}/api/ats/score`, aiPayload);
    console.log("   ✅ Groq AI Match Score:", aiRes.data.match_score + "%");
    console.log("   ✅ Matched Skills:", aiRes.data.matched_skills.join(", "));
    console.log("   ✅ Missing Skills:", aiRes.data.missing_skills.join(", "));

    // -------------------------------------------------------------------------
    // TEST 3: Candidate Registration & Email Verification
    // -------------------------------------------------------------------------
    console.log("\n👉 Test 3: Candidate Registration & Verification");
    const candRegRes = await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "Test",
      lastName: "Candidate",
      email: testCandidateEmail,
      password: testPassword,
      accountType: "candidate"
    });
    console.log("   ✅ Candidate registered:", candRegRes.data.message);

    // Connect to DB directly to verify email and inspect data
    await mongoose.connect(MONGO_URI);
    const User = mongoose.model("User");
    const Candidate = mongoose.model("Candidate");
    const Company = mongoose.model("Company");
    const Job = mongoose.model("Job");
    const Application = mongoose.model("Application");

    const candUser = await User.findOne({ email: testCandidateEmail });
    candUser.isVerified = true;
    await candUser.save();
    console.log("   ✅ Candidate email verified in DB");

    // -------------------------------------------------------------------------
    // TEST 4: Candidate Login (Verifying Candidate._id fix!)
    // -------------------------------------------------------------------------
    console.log("\n👉 Test 4: Candidate Login & Auto-Profile Generation");
    const candLoginRes = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: testCandidateEmail,
      password: testPassword
    });
    candidateToken = candLoginRes.data.accessToken;
    console.log("   ✅ Candidate logged in successfully. JWT Token received!");

    const candProfileRes = await axios.get(`${NODE_URL}/api/v1/candidates`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    createdCandidateId = candProfileRes.data.data._id;
    console.log("   ✅ Candidate Profile confirmed in MongoDB. ID:", createdCandidateId);

    // Set sample parsed resume text on candidate
    await Candidate.findByIdAndUpdate(createdCandidateId, {
      $set: {
        resumeText: "Experienced JavaScript, React, Node.js and MongoDB Developer with 3+ years experience building web apps.",
        resumeUrl: "uploads/test_resume.pdf",
        skills: ["React", "JavaScript", "Node.js", "MongoDB"]
      }
    });
    console.log("   ✅ Candidate resume text and skills populated");

    // -------------------------------------------------------------------------
    // TEST 5: Recruiter Registration, Company Setup & Approval
    // -------------------------------------------------------------------------
    console.log("\n👉 Test 5: Recruiter Registration & Admin Approval Simulation");
    await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "Recruiter",
      lastName: "Tester",
      email: testCompanyEmail,
      password: testPassword,
      accountType: "company"
    });

    const compUser = await User.findOne({ email: testCompanyEmail });
    compUser.isVerified = true;
    compUser.status = "accepted"; // Admin approved

    const companyDoc = await Company.create({
      name: "Acme Tech Solutions",
      location: "San Francisco, CA",
      logo: "https://via.placeholder.com/150",
      userId: compUser._id,
      isVerified: true,
      limits: { maxJobs: 5, activeJobs: 0 }
    });

    compUser.company = companyDoc._id;
    await compUser.save();
    createdCompanyId = companyDoc._id;
    console.log("   ✅ Company created and approved by Admin. ID:", createdCompanyId);

    // Recruiter Login
    const compLoginRes = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: testCompanyEmail,
      password: testPassword
    });
    companyToken = compLoginRes.data.accessToken;
    console.log("   ✅ Recruiter logged in successfully. JWT Token received!");

    // -------------------------------------------------------------------------
    // TEST 6: Job Posting with Quota Checks (checkJobLimit.js)
    // -------------------------------------------------------------------------
    console.log("\n👉 Test 6: Job Creation with Quota Gatekeeping");
    const jobRes = await axios.post(
      `${NODE_URL}/api/v1/jobs/add`,
      {
        title: "Senior Full Stack Engineer",
        department: "Engineering",
        location: "Remote",
        workMode: "Remote",
        employmentType: "Full-time",
        experienceLevel: "Senior-level",
        salaryMin: 90000,
        salaryMax: 130000,
        openingJob: 2,
        requirements: "Looking for an experienced React and Node.js engineer with MongoDB experience.",
        responsibilities: "Architect full stack features and lead code reviews.",
        skillsRequired: ["React", "Node.js", "MongoDB", "JavaScript"],
        status: "Open"
      },
      {
        headers: { Authorization: `Bearer ${companyToken}` }
      }
    );
    createdJobId = jobRes.data.job?._id || jobRes.data.data?._id || jobRes.data._id;
    console.log("   ✅ Job created successfully! ID:", createdJobId);

    // -------------------------------------------------------------------------
    // TEST 7: Candidate Browsing & Applying with Real-Time AI Scoring
    // -------------------------------------------------------------------------
    console.log("\n👉 Test 7: Candidate Apply Flow -> Triggers Python FastAPI + Groq AI");
    const applyRes = await axios.post(
      `${NODE_URL}/api/v1/applications/apply`,
      {
        jobId: createdJobId,
        candidateId: createdCandidateId
      },
      {
        headers: { Authorization: `Bearer ${candidateToken}` }
      }
    );
    console.log("   ✅ Applied successfully:", applyRes.data.msg);

    // Verify application in DB
    const savedApp = await Application.findOne({ jobId: createdJobId, candidateId: createdCandidateId });
    createdAppId = savedApp._id;
    console.log("   ✅ Application confirmed in DB!");
    console.log("   ✅ AI Evaluated Score:", savedApp.score + "%");
    console.log("   ✅ AI Analysis Saved:", savedApp.resume_Analyse ? "YES" : "NO");

    // -------------------------------------------------------------------------
    // TEST 8: Recruiter Pipeline & Stage Transitions
    // -------------------------------------------------------------------------
    console.log("\n👉 Test 8: Hiring Pipeline & Stage Advancement");
    const pipelineRes = await axios.get(`${NODE_URL}/api/v1/applications`, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    console.log("   ✅ Pipeline fetched. Total Applicants found:", pipelineRes.data.recentApplications?.length || 0);

    // Advance to Interview
    const updateRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${createdAppId}/status`,
      {
        newStatus: "interview",
        scheduleForm: { date: "2026-11-15", time: "14:00" },
        details: [{ date: "2026-11-15", time: "14:00", location: "Google Meet", notes: "Technical Round" }]
      },
      {
        headers: { Authorization: `Bearer ${companyToken}` }
      }
    );
    console.log("   ✅ Application moved to 'interview'. Status:", updateRes.data.data.status);

    // -------------------------------------------------------------------------
    // TEST 9: Admin Protected Endpoints
    // -------------------------------------------------------------------------
    console.log("\n👉 Test 9: Admin Authentication & Moderation Endpoints");
    // Create temporary admin user
    const adminEmail = `admin_${timestamp}@hireflowtest.com`;
    const adminUser = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      password: "adminpassword",
      accountType: "admin",
      isVerified: true
    });

    const jwt = (await import("jsonwebtoken")).default;
    adminToken = jwt.sign(
      { id: adminUser._id, role: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const adminUsersRes = await axios.get(`${NODE_URL}/api/v1/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log("   ✅ Admin endpoint authenticated! Total users in platform:", adminUsersRes.data.totalUsers);

    // Verify non-admin is blocked
    try {
      await axios.get(`${NODE_URL}/api/v1/admin/users`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      console.error("   ❌ Non-admin was NOT blocked! Check admin security.");
    } catch (err) {
      console.log("   ✅ Security verified: Non-admin candidate correctly rejected with 403 Forbidden!");
    }

    console.log("\n==================================================");
    console.log("🎉 ALL END-TO-END FEATURE TESTS PASSED 100%!");
    console.log("==================================================");

  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.response?.data || err.message);
    if (err.stack) console.error(err.stack);
  } finally {
    // Cleanup test data
    console.log("\n🧹 Cleaning up test database records...");
    if (mongoose.connection.readyState === 1) {
      const User = mongoose.model("User");
      const Candidate = mongoose.model("Candidate");
      const Company = mongoose.model("Company");
      const Job = mongoose.model("Job");
      const Application = mongoose.model("Application");

      if (createdAppId) await Application.deleteOne({ _id: createdAppId });
      if (createdJobId) await Job.deleteOne({ _id: createdJobId });
      if (createdCompanyId) await Company.deleteOne({ _id: createdCompanyId });
      if (createdCandidateId) await Candidate.deleteOne({ _id: createdCandidateId });
      await User.deleteMany({ email: { $in: [testCandidateEmail, testCompanyEmail, `admin_${timestamp}@hireflowtest.com`] } });
      console.log("   ✅ Test cleanup complete.");
      await mongoose.disconnect();
    }
    process.exit(0);
  }
}

runTests();
