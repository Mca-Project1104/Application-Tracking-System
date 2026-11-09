import axios from "axios";
import assert from "assert";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../model/UserModel.js";
import { Company } from "../model/CompanyModel.js";
import Candidate from "../model/CandidateModel.js";
import Job from "../model/JobModel.js";
import Application from "../model/ApplicationModel.js";

dotenv.config();

const NODE_URL = "http://localhost:8000";
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;

const timestamp = Date.now();
const recruiter1Email = `recruiter_h1_${timestamp}@test.com`;
const recruiter2Email = `recruiter_h2_${timestamp}@test.com`;
const candidate1Email = `candidate_h1_${timestamp}@test.com`;
const candidate2Email = `candidate_h2_${timestamp}@test.com`;
const password = "Password@123";

let recruiter1Token, recruiter2Token, candidate1Token, candidate2Token;
let recruiter1User, recruiter2User, candidate1User, candidate2User;
let recruiter1CompanyId, recruiter2CompanyId;
let candidate1Id, candidate2Id;
let job1Id;

async function runHardeningTests() {
  console.log("================================================================================");
  console.log("   🛡️  FEATURE HARDENING & IDOR SECURITY E2E VERIFICATION");
  console.log("================================================================================\n");

  if (MONGO_URI) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
        console.log("📦 Connected to MongoDB Atlas.\n");
        break;
      } catch (err) {
        if (attempt === 3) throw err;
        console.log(`Retrying MongoDB connection (attempt ${attempt + 1})...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  try {
    // 1. SETUP TWO RECRUITERS & THEIR COMPANIES
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 1: SETUP RECRUITER 1 & RECRUITER 2 ACCOUNTS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Register Recruiter 1
    const r1Reg = await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "RecruiterOne",
      lastName: "Corp",
      email: recruiter1Email,
      password: password,
      accountType: "company",
    });
    assert(r1Reg.status === 201, "Recruiter 1 Registered");

    // Verify OTP & Login
    const r1Doc = await User.findOne({ email: recruiter1Email });
    await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
      email: recruiter1Email,
      code: r1Doc.verificationCode,
    });
    await User.updateOne({ email: recruiter1Email }, { status: "accepted" });

    const r1Login = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: recruiter1Email,
      password: password,
    });
    recruiter1Token = r1Login.data.accessToken;
    recruiter1User = r1Login.data.user;

    // Create Company 1
    const comp1Res = await axios.post(
      `${NODE_URL}/api/v1/company/profile`,
      { name: "Alpha Global Tech", location: "New York, NY" },
      { headers: { Authorization: `Bearer ${recruiter1Token}` } }
    );
    assert(comp1Res.status === 201, "Company 1 Created");
    recruiter1CompanyId = comp1Res.data.company._id;

    // Set Subscription to ACTIVE
    await Company.updateOne(
      { _id: recruiter1CompanyId },
      { "subscription.status": "ACTIVE", "subscription.plan": "PRO", "limits.maxJobs": 10 }
    );
    console.log("   ✅ PASS: Recruiter 1 & Company 1 Setup Complete");

    // Register Recruiter 2
    const r2Reg = await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "RecruiterTwo",
      lastName: "Corp",
      email: recruiter2Email,
      password: password,
      accountType: "company",
    });
    assert(r2Reg.status === 201, "Recruiter 2 Registered");
    const r2Doc = await User.findOne({ email: recruiter2Email });
    await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
      email: recruiter2Email,
      code: r2Doc.verificationCode,
    });
    await User.updateOne({ email: recruiter2Email }, { status: "accepted" });

    const r2Login = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: recruiter2Email,
      password: password,
    });
    recruiter2Token = r2Login.data.accessToken;
    recruiter2User = r2Login.data.user;

    // Create Company 2
    const comp2Res = await axios.post(
      `${NODE_URL}/api/v1/company/profile`,
      { name: "Beta Innovations", location: "Austin, TX" },
      { headers: { Authorization: `Bearer ${recruiter2Token}` } }
    );
    assert(comp2Res.status === 201, "Company 2 Created");
    recruiter2CompanyId = comp2Res.data.company._id;
    await Company.updateOne(
      { _id: recruiter2CompanyId },
      { "subscription.status": "ACTIVE", "subscription.plan": "PRO", "limits.maxJobs": 10 }
    );
    console.log("   ✅ PASS: Recruiter 2 & Company 2 Setup Complete");

    // 2. VERIFY PUT /api/v1/company/profile
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 2: TEST PUT /api/v1/company/profile (COMPANY PROFILE UPDATE)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const updateComp1Res = await axios.put(
      `${NODE_URL}/api/v1/company/profile`,
      { name: "Alpha Global Technologies Inc.", location: "San Francisco, CA" },
      { headers: { Authorization: `Bearer ${recruiter1Token}` } }
    );
    assert(updateComp1Res.status === 200, "Company Update API Returns 200");
    assert(updateComp1Res.data.company.name === "Alpha Global Technologies Inc.", "Updated Name Persisted");
    assert(updateComp1Res.data.company.location === "San Francisco, CA", "Updated Location Persisted");
    console.log("   ✅ PASS: Company Profile Successfully Updated via PUT /profile");

    // 3. POST A JOB UNDER RECRUITER 1
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 3: POST JOB UNDER RECRUITER 1");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const jobRes = await axios.post(
      `${NODE_URL}/api/v1/jobs/add`,
      {
        title: "Staff Distributed Systems Engineer",
        description: "Build ultra-low latency microservices in Go and Rust.",
        location: "San Francisco, CA",
        employmentType: "Full-time",
        experienceLevel: "Senior-level",
        workMode: "Hybrid",
        skillsRequired: ["Go", "Kubernetes", "Rust"],
        openingJob: 2,
        status: "Open",
      },
      { headers: { Authorization: `Bearer ${recruiter1Token}` } }
    );
    assert(jobRes.status === 201, "Job Created by Recruiter 1");
    job1Id = jobRes.data.job._id;
    console.log(`   ✅ PASS: Job 1 Created by Recruiter 1 (ID: ${job1Id})`);

    // 4. TEST IDOR SECURITY: RECRUITER 2 ATTEMPTS TO UPDATE OR DELETE RECRUITER 1'S JOB
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 4: IDOR SECURITY TEST — RECRUITER 2 CANNOT MUTATE RECRUITER 1'S JOB");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Recruiter 2 tries to update Recruiter 1's job
    try {
      await axios.patch(
        `${NODE_URL}/api/v1/jobs/update/${job1Id}`,
        { title: "HACKED TITLE BY RECRUITER 2" },
        { headers: { Authorization: `Bearer ${recruiter2Token}` } }
      );
      assert.fail("SECURITY BREACH: Recruiter 2 was able to update Recruiter 1's job!");
    } catch (err) {
      assert(err.response?.status === 403, `IDOR Blocked Update (Status: ${err.response?.status})`);
      console.log("   ✅ PASS: Unauthorized Job Update Blocked with 403 Forbidden");
    }

    // Recruiter 2 tries to delete Recruiter 1's job
    try {
      await axios.delete(
        `${NODE_URL}/api/v1/jobs/delete/${job1Id}`,
        { headers: { Authorization: `Bearer ${recruiter2Token}` } }
      );
      assert.fail("SECURITY BREACH: Recruiter 2 was able to delete Recruiter 1's job!");
    } catch (err) {
      assert(err.response?.status === 403, `IDOR Blocked Delete (Status: ${err.response?.status})`);
      console.log("   ✅ PASS: Unauthorized Job Deletion Blocked with 403 Forbidden");
    }

    // Verify Job 1 still exists intact
    const jobCheck = await Job.findById(job1Id);
    assert(jobCheck !== null, "Job 1 remains intact");
    assert(jobCheck.title === "Staff Distributed Systems Engineer", "Job title was not modified");
    console.log("   ✅ PASS: Job 1 Remains Unharmed");

    // 5. SETUP TWO CANDIDATES
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 5: SETUP TWO CANDIDATE PROFILES");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Candidate 1
    await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "Alice",
      lastName: "Engineer",
      email: candidate1Email,
      password: password,
      accountType: "candidate",
    });
    const c1Doc = await User.findOne({ email: candidate1Email });
    await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
      email: candidate1Email,
      code: c1Doc.verificationCode,
    });
    const c1Login = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: candidate1Email,
      password: password,
    });
    candidate1Token = c1Login.data.accessToken;
    candidate1User = c1Login.data.user;
    const c1Profile = await Candidate.findOne({ user_id: candidate1User.id });
    candidate1Id = c1Profile._id;

    // Candidate 2
    await axios.post(`${NODE_URL}/api/v1/users/register`, {
      firstName: "Bob",
      lastName: "Developer",
      email: candidate2Email,
      password: password,
      accountType: "candidate",
    });
    const c2Doc = await User.findOne({ email: candidate2Email });
    await axios.post(`${NODE_URL}/api/v1/users/verify-email`, {
      email: candidate2Email,
      code: c2Doc.verificationCode,
    });
    const c2Login = await axios.post(`${NODE_URL}/api/v1/users/login`, {
      email: candidate2Email,
      password: password,
    });
    candidate2Token = c2Login.data.accessToken;
    candidate2User = c2Login.data.user;
    const c2Profile = await Candidate.findOne({ user_id: candidate2User.id });
    candidate2Id = c2Profile._id;
    console.log("   ✅ PASS: Both Candidate Accounts Created");

    // 6. TEST IDOR SECURITY: CANDIDATE 2 CANNOT OVERWRITE CANDIDATE 1'S PROFILE
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 6: IDOR SECURITY TEST — CANDIDATE 2 CANNOT EDIT CANDIDATE 1'S PROFILE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    try {
      await axios.put(
        `${NODE_URL}/api/v1/candidates/update/${candidate1Id}`,
        { personal: "HACKED BIO BY CANDIDATE 2" },
        { headers: { Authorization: `Bearer ${candidate2Token}` } }
      );
      assert.fail("SECURITY BREACH: Candidate 2 was able to update Candidate 1's profile!");
    } catch (err) {
      assert(err.response?.status === 403, `IDOR Blocked Update (Status: ${err.response?.status})`);
      console.log("   ✅ PASS: Unauthorized Candidate Update Blocked with 403 Forbidden");
    }

    // 7. TEST CANDIDATE SELF-SERVICE PROFILE UPDATES (SKILLS & CONTACTS)
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 7: CANDIDATE 1 SELF-SERVICE PROFILE UPDATES (SKILLS, PHONE, LOCATION)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const c1UpdateRes = await axios.put(
      `${NODE_URL}/api/v1/candidates/update/${candidate1Id}`,
      {
        skills: ["Go", "Kubernetes", "gRPC", "Docker", "Terraform"],
        phone: "+1 555-0199",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/alice-dist-eng",
        github: "github.com/alice-dist-eng",
        website: "alice.systems",
        personal: "Senior Infrastructure & Distributed Systems Architect",
      },
      { headers: { Authorization: `Bearer ${candidate1Token}` } }
    );
    assert(c1UpdateRes.status === 200, "Candidate 1 Update Returns 200");
    assert(c1UpdateRes.data.candidate.skills.length === 5, "5 Skills Stored");
    assert(c1UpdateRes.data.candidate.phone === "+1 555-0199", "Phone Number Stored");
    assert(c1UpdateRes.data.candidate.location === "San Francisco, CA", "Location Stored");
    console.log("   ✅ PASS: Candidate 1 Successfully Updated Skills & Contact Information");

    // 8. TEST SAFE ERROR HANDLING ON NON-EXISTENT APPLICATION STATUS UPDATE
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 8: TEST SAFE 404 ON INVALID APPLICATION STATUS UPDATE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const fakeAppId = new mongoose.Types.ObjectId();
    try {
      await axios.patch(
        `${NODE_URL}/api/v1/applications/${fakeAppId}/status`,
        { newStatus: "interview" },
        { headers: { Authorization: `Bearer ${recruiter1Token}` } }
      );
      assert.fail("Expected 404 for non-existent application update");
    } catch (err) {
      assert(err.response?.status === 404, `Safe 404 Handled (Status: ${err.response?.status})`);
      console.log("   ✅ PASS: Handled Non-Existent Application Update with Clean 404 (No 500 Crash)");
    }

    // 9. CLEAN DELETION OF JOB 1 BY ITS TRUE OWNER
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 9: RECRUITER 1 DELETES JOB 1 (LEGITIMATE OWNER)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const delRes = await axios.delete(
      `${NODE_URL}/api/v1/jobs/delete/${job1Id}`,
      { headers: { Authorization: `Bearer ${recruiter1Token}` } }
    );
    assert(delRes.status === 200, "Job Deleted Successfully by Owner");
    const comp1PostDelete = await Company.findById(recruiter1CompanyId);
    assert(comp1PostDelete.limits.activeJobs >= 0, "activeJobs is not negative");
    console.log(`   ✅ PASS: Job Successfully Deleted by Owner. Company activeJobs: ${comp1PostDelete.limits.activeJobs}`);

    // 10. TEARDOWN
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 10: TEARDOWN & DATABASE PURGE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    await Job.deleteMany({ _id: job1Id });
    await Company.deleteMany({ _id: { $in: [recruiter1CompanyId, recruiter2CompanyId] } });
    await Candidate.deleteMany({ _id: { $in: [candidate1Id, candidate2Id] } });
    await User.deleteMany({
      email: { $in: [recruiter1Email, recruiter2Email, candidate1Email, candidate2Email] },
    });
    console.log("   ✅ PASS: Database Cleaned Up Successfully\n");

    console.log("================================================================================");
    console.log("🏆 FEATURE HARDENING & SECURITY: ALL TESTS PASSED (100% SUCCESS)");
    console.log("================================================================================\n");

  } catch (err) {
    console.error("❌ TEST FAILED:", err.message);
    if (err.response) {
      console.error("   Response status:", err.response.status);
      console.error("   Response data:", err.response.data);
    }
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("📦 Disconnected from MongoDB Atlas.");
    }
  }
}

runHardeningTests();
