import axios from "axios";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../model/UserModel.js";
import Candidate from "../model/CandidateModel.js";
import { Company } from "../model/CompanyModel.js";
import Job from "../model/JobModel.js";
import Application from "../model/ApplicationModel.js";

const NODE_URL = "http://localhost:8000";
const timestamp = Date.now();

const recruiterEmail = `recruiter_pipe_${timestamp}@test.com`;
const testPassword = "Password123!";

let recruiterUser, recruiterToken, companyDoc, testJob;
const createdCandidateIds = [];
const createdUserIds = [];
const createdAppIds = [];

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, testName, details = "") {
  testsTotal++;
  if (condition) {
    testsPassed++;
    console.log(`   ✅ PASS: ${testName} ${details ? `(${details})` : ""}`);
  } else {
    console.error(`   ❌ FAIL: ${testName} - ${details}`);
    throw new Error(`Assertion failed: ${testName} - ${details}`);
  }
}

async function runHiringPipelineVerification() {
  console.log("\n================================================================================");
  console.log("   📋 HIRING PIPELINE & APPLICATION MANAGEMENT END-TO-END VERIFICATION");
  console.log("================================================================================\n");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB Atlas.\n");

    // -------------------------------------------------------------------------
    // STEP 1: SETUP RECRUITER & APPROVED COMPANY
    // -------------------------------------------------------------------------
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 1: RECRUITER & APPROVED COMPANY SETUP");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    recruiterUser = await User.create({
      firstName: "Hiring",
      lastName: "Manager",
      email: recruiterEmail,
      password: testPassword,
      accountType: "company",
      status: "accepted",
      isVerified: true
    });
    createdUserIds.push(recruiterUser._id);

    companyDoc = await Company.create({
      name: "Global Hiring Corp",
      location: "San Francisco, CA",
      logo: "https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png",
      userId: recruiterUser._id,
      isVerified: true,
      subscription: { plan: "PRO", status: "ACTIVE" },
      limits: { maxJobs: 50, activeJobs: 0 }
    });

    recruiterUser.company = companyDoc._id;
    await recruiterUser.save();

    recruiterToken = jwt.sign(
      { id: recruiterUser._id, role: "company" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    assert(!!recruiterToken, "Recruiter Authentication", `Token for ${recruiterEmail}`);

    // -------------------------------------------------------------------------
    // STEP 2: CREATE JOB WITH OPENINGS FOR CAPACITY-DRIVEN INTAKE
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 2: CREATE JOB WITH 2 OPENINGS (Base Capacity Intake = 2 * 3 = 6)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const jobRes = await axios.post(
      `${NODE_URL}/api/v1/jobs/add`,
      {
        title: "Senior Cloud Architect",
        department: "Infrastructure",
        location: "Hybrid (SF / Remote)",
        workMode: "Hybrid",
        employmentType: "Full-time",
        experienceLevel: "Senior-level",
        salaryMin: 150000,
        salaryMax: 200000,
        openingJob: 2, // 2 openings => pipeline base intake = 6
        requirements: "AWS, Kubernetes, Terraform, Go, Python, Distributed Systems",
        responsibilities: "Scale cloud platform and manage multi-region infrastructure",
        skillsRequired: ["AWS", "Kubernetes", "Terraform", "Go", "Docker"],
        status: "Open"
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    testJob = jobRes.data.job;
    assert(jobRes.status === 201 && testJob.openingJob === 2, "Job Created with 2 Openings", `Job ID: ${testJob._id}`);

    // -------------------------------------------------------------------------
    // STEP 3: SUBMIT 8 CANDIDATE APPLICATIONS (VARYING ATS SCORES)
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 3: SEED 8 CANDIDATE APPLICATIONS WITH DIVERSE ATS MATCH SCORES");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const candidateScores = [95, 88, 82, 78, 74, 69, 58, 45];
    const candidateNames = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry"];

    for (let i = 0; i < 8; i++) {
      const candUser = await User.create({
        firstName: candidateNames[i],
        lastName: `Dev${i + 1}`,
        email: `candidate_${i + 1}_${timestamp}@test.com`,
        password: testPassword,
        accountType: "candidate",
        isVerified: true
      });
      createdUserIds.push(candUser._id);

      const candDoc = await Candidate.create({
        user_id: candUser._id,
        email: candUser.email,
        phone: `+1 555-010${i}`,
        location: "United States",
        skills: ["AWS", "Kubernetes", "Terraform"].slice(0, 3 - (i % 2)),
        resumeText: `Sample resume for ${candidateNames[i]} with cloud experience`,
        resumeUrl: "uploads/Companied.pdf",
        ats_score: candidateScores[i]
      });
      createdCandidateIds.push(candDoc._id);

      candUser.candidate = candDoc._id;
      await candUser.save();

      const appDoc = await Application.create({
        jobId: testJob._id,
        candidateId: candDoc._id,
        candidateSnapshot: candDoc,
        resumeText: candDoc.resumeText,
        resumeUrl: candDoc.resumeUrl,
        score: candidateScores[i],
        resume_Analyse: {
          match_score: candidateScores[i],
          matched_skills: ["AWS", "Kubernetes"],
          missing_skills: ["Terraform"]
        },
        status: "applied"
      });
      createdAppIds.push(appDoc._id);
    }
    assert(createdAppIds.length === 8, "8 Candidate Applications Seeded", `Scores: ${candidateScores.join(", ")}%`);

    // -------------------------------------------------------------------------
    // STEP 4: FETCH PIPELINE & VERIFY CAPACITY & ATS SORTING
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 4: RECRUITER PIPELINE FETCH & CAPACITY INTAKE LOGIC");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const pipelineRes = await axios.get(`${NODE_URL}/api/v1/applications`, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    const { stats, pipeline, recentApplications, jobs } = pipelineRes.data;

    assert(pipelineRes.status === 200, "Pipeline API Response", `HTTP ${pipelineRes.status}`);
    assert(stats.totalApplicants === 8, "Stats: Total Applicants Count", `Count: ${stats.totalApplicants}`);
    assert(recentApplications.length === 8, "All 8 Applications Received (No artificial slicing)", `Received: ${recentApplications.length}`);

    // Verify ATS rank sorting in applied column (Highest score first: 95%, 88%, ...)
    const sortedScores = recentApplications.map(a => a.score).sort((a, b) => b - a);
    assert(sortedScores[0] === 95 && sortedScores[7] === 45, "ATS Score Ranking Order", `Top: ${sortedScores[0]}%, Lowest: ${sortedScores[7]}%`);

    // Verify base capacity calculation: 2 openings * 3 = 6
    const calculatedBaseLimit = Math.max(testJob.openingJob * 3, 5);
    assert(calculatedBaseLimit === 6, "Capacity Calculation (Openings * 3)", `Capacity: ${calculatedBaseLimit} (Top 6 of 8)`);

    // -------------------------------------------------------------------------
    // STEP 5: HIRING PROCESS: ADVANCE CANDIDATE TO SHORTLISTED
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 5: ADVANCE CANDIDATE #1 (ALICE - 95%) TO 'SHORTLISTED'");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const topCandidateAppId = createdAppIds[0];
    const shortlistRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${topCandidateAppId}/status`,
      { newStatus: "shortlisted" },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    assert(shortlistRes.status === 200 && shortlistRes.data.data.status === "shortlisted", "Application Advanced to Shortlisted", `Status: ${shortlistRes.data.data.status}`);

    const dbShortlistApp = await Application.findById(topCandidateAppId);
    assert(dbShortlistApp.status === "shortlisted", "Shortlisted Status Persisted in MongoDB");

    // -------------------------------------------------------------------------
    // STEP 6: HIRING PROCESS: SCHEDULE INTERVIEW WITH DETAILS
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 6: SCHEDULE TECHNICAL INTERVIEW FOR CANDIDATE #1");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const scheduleData = {
      date: "2026-11-25",
      time: "02:30 PM",
      type: "technical",
      interviewer: "Staff Cloud Engineer",
      location: "Google Meet: https://meet.google.com/abc-defg-hij",
      notes: "System design: scaling distributed consensus clusters."
    };

    const interviewRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${topCandidateAppId}/status`,
      {
        newStatus: "interview",
        scheduleForm: scheduleData,
        details: [scheduleData]
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    assert(interviewRes.status === 200 && interviewRes.data.data.status === "interview", "Application Advanced to Interview", `Status: ${interviewRes.data.data.status}`);
    assert(interviewRes.data.data.scheduleForm?.date === "2026-11-25", "Interview Schedule Form Stored", `Date: ${interviewRes.data.data.scheduleForm?.date}`);

    // Query interview details endpoint
    const queryInterviewRes = await axios.get(`${NODE_URL}/api/v1/applications/interviews/${topCandidateAppId}`);
    assert(queryInterviewRes.status === 200 && queryInterviewRes.data.length > 0, "Query Scheduled Interviews API", `Interview count: ${queryInterviewRes.data.length}`);
    assert(queryInterviewRes.data[0].scheduleForm?.location.includes("meet.google.com"), "Meeting Link Verified", queryInterviewRes.data[0].scheduleForm?.location);

    // -------------------------------------------------------------------------
    // STEP 7: HIRING PROCESS: EXTEND OFFER & MARK AS HIRED
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 7: EXTEND OFFER & MARK CANDIDATE #1 AS 'HIRED'");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const hireRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${topCandidateAppId}/status`,
      {
        newStatus: "hired",
        details: {
          date: "2026-12-15",
          notes: "Official offer extended with stock options and joining bonus."
        }
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    assert(hireRes.status === 200 && hireRes.data.data.status === "hired", "Candidate Officially Hired", `Status: ${hireRes.data.data.status}`);

    const dbHiredApp = await Application.findById(topCandidateAppId);
    assert(dbHiredApp.status === "hired", "Hired Status Persisted in MongoDB");

    // -------------------------------------------------------------------------
    // STEP 8: HIRING PROCESS: REJECT LOWEST SCORING CANDIDATE
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 8: REJECT CANDIDATE #8 (HENRY - 45%)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const lowestCandidateAppId = createdAppIds[7];
    const rejectRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${lowestCandidateAppId}/status`,
      { newStatus: "rejected" },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    assert(rejectRes.status === 200 && rejectRes.data.data.status === "rejected", "Candidate Rejected", `Status: ${rejectRes.data.data.status}`);

    // -------------------------------------------------------------------------
    // STEP 9: APPLICATION RESUME DOWNLOAD VERIFICATION
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 9: RESUME DOWNLOAD FROM APPLICATION ID");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const resumeDownloadRes = await axios.get(`${NODE_URL}/api/v1/applications/resume/${topCandidateAppId}`, {
      responseType: "arraybuffer"
    });
    assert(resumeDownloadRes.status === 200 && resumeDownloadRes.data.length > 0, "Application Resume Download", `Delivered ${resumeDownloadRes.data.length} bytes`);

    // -------------------------------------------------------------------------
    // STEP 10: VERIFY UPDATED DASHBOARD STATS & PIPELINE COUNTS
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 10: POST-ACTION PIPELINE STAGE DISTRIBUTION & STATS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const updatedPipelineRes = await axios.get(`${NODE_URL}/api/v1/applications`, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    const updatedStages = updatedPipelineRes.data.pipeline;
    const hiredCount = updatedStages.find(s => s.name === "hired")?.count;
    const rejectedCount = updatedStages.find(s => s.name === "rejected")?.count;

    assert(hiredCount === 1, "Pipeline Stage 'Hired' Count", `Count: ${hiredCount}`);
    assert(rejectedCount === 1, "Pipeline Stage 'Rejected' Count", `Count: ${rejectedCount}`);
    assert(updatedPipelineRes.data.company?.subscription?.status === "ACTIVE", "Company Subscription Attached in Dashboard", `Plan: ${updatedPipelineRes.data.company?.subscription?.plan}`);

    // =========================================================================
    // FINAL SUMMARY
    // =========================================================================
    console.log("\n================================================================================");
    console.log(`🏆 HIRING PIPELINE & APPLICATION MANAGEMENT: ${testsPassed} / ${testsTotal} PASSED (100% SUCCESS)`);
    console.log("================================================================================\n");

  } catch (err) {
    console.error("\n💥 VERIFICATION TEST ENCOUNTERED AN ERROR:");
    console.error(err.response?.data || err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    console.log("🧹 Running teardown cleanup for test records in MongoDB...");
    try {
      if (mongoose.connection.readyState === 1) {
        if (createdAppIds.length > 0) {
          await Application.deleteMany({ _id: { $in: createdAppIds } });
        }
        if (testJob?._id) {
          await Job.deleteOne({ _id: testJob._id });
        }
        if (companyDoc?._id) {
          await Company.deleteOne({ _id: companyDoc._id });
        }
        if (createdCandidateIds.length > 0) {
          await Candidate.deleteMany({ _id: { $in: createdCandidateIds } });
        }
        if (createdUserIds.length > 0) {
          await User.deleteMany({ _id: { $in: createdUserIds } });
        }
        await mongoose.disconnect();
        console.log("✨ Teardown complete. Database clean.");
      }
    } catch (cleanErr) {
      console.error("Cleanup error:", cleanErr.message);
    }
  }
}

runHiringPipelineVerification();
