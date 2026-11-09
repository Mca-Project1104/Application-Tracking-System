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

const recruiterEmail = `recruiter_sched_${timestamp}@test.com`;
const candAEmail = `alice_sched_${timestamp}@test.com`;
const candBEmail = `bob_sched_${timestamp}@test.com`;
const testPassword = "Password123!";

let recruiterUser, recruiterToken, companyDoc, testJob;
let candidateAUser, candidateADoc, candidateBUser, candidateBDoc;
let appAId, appBId;

const createdUserIds = [];
const createdCandidateIds = [];
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

async function runPipelineScheduleE2ETest() {
  console.log("\n================================================================================");
  console.log("   📅 PIPELINE SCHEDULE FEATURES END-TO-END VERIFICATION");
  console.log("================================================================================\n");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB Atlas.\n");

    // -------------------------------------------------------------------------
    // STEP 1: RECRUITER & APPROVED COMPANY SETUP
    // -------------------------------------------------------------------------
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 1: RECRUITER & VERIFIED COMPANY SETUP");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    recruiterUser = await User.create({
      firstName: "Interview",
      lastName: "Coordinator",
      email: recruiterEmail,
      password: testPassword,
      accountType: "company",
      status: "accepted",
      isVerified: true
    });
    createdUserIds.push(recruiterUser._id);

    companyDoc = await Company.create({
      name: "Apex Scheduling Systems",
      location: "San Jose, CA",
      logo: "https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png",
      userId: recruiterUser._id,
      isVerified: true,
      subscription: { plan: "PRO", status: "ACTIVE" },
      limits: { maxJobs: 100, activeJobs: 0 }
    });

    recruiterUser.company = companyDoc._id;
    await recruiterUser.save();

    recruiterToken = jwt.sign(
      { id: recruiterUser._id, role: "company" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    assert(!!recruiterToken, "Recruiter Authentication Token Generated", recruiterEmail);

    // -------------------------------------------------------------------------
    // STEP 2: CREATE TEST JOB
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 2: POST JOB FOR INTERVIEW TESTING");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const jobRes = await axios.post(
      `${NODE_URL}/api/v1/jobs/add`,
      {
        title: "Principal Infrastructure Architect",
        department: "Cloud Engineering",
        location: "San Jose, CA (Hybrid)",
        workMode: "Hybrid",
        employmentType: "Full-time",
        experienceLevel: "Senior-level",
        salaryMin: 180000,
        salaryMax: 240000,
        openingJob: 3,
        skillsRequired: ["Kubernetes", "AWS", "Terraform", "Go", "Distributed Systems"],
        description: "Leading multi-region Kubernetes cloud infrastructure orchestration.",
        responsibilities: "Lead cloud architecture and conduct technical interviews.",
        requirements: "10+ years backend/cloud engineering, expertise in distributed consensus",
        status: "Open"
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    assert(jobRes.status === 201 && jobRes.data.success, "Job Created Successfully", `Job ID: ${jobRes.data.job._id}`);
    testJob = jobRes.data.job;

    // -------------------------------------------------------------------------
    // STEP 3: CREATE CANDIDATES & SUBMIT APPLICATIONS
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 3: CREATE CANDIDATES & APPLY TO JOB");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Candidate A: Alice
    candidateAUser = await User.create({
      firstName: "Alice",
      lastName: "Engineer",
      email: candAEmail,
      password: testPassword,
      accountType: "candidate",
      status: "accepted",
      isVerified: true
    });
    createdUserIds.push(candidateAUser._id);

    candidateADoc = await Candidate.create({
      user_id: candidateAUser._id,
      email: candAEmail,
      name: "Alice Engineer",
      phone: "+1-555-0101",
      location: "San Jose, CA",
      skills: ["Kubernetes", "AWS", "Terraform", "Go", "Docker"],
      resumeText: "Experienced Senior Cloud Architect skilled in Kubernetes, AWS, Terraform, Go, Docker, distributed systems and cloud infrastructure.",
      resumeUrl: "uploads/Companied.pdf"
    });
    createdCandidateIds.push(candidateADoc._id);
    candidateAUser.candidate = candidateADoc._id;
    await candidateAUser.save();

    const candAToken = jwt.sign(
      { id: candidateAUser._id, role: "candidate" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const appARes = await axios.post(
      `${NODE_URL}/api/v1/applications/apply`,
      {
        jobId: testJob._id,
        candidateId: candidateADoc._id
      },
      { headers: { Authorization: `Bearer ${candAToken}` } }
    );
    assert(appARes.status === 201, "Candidate A (Alice) Applied Successfully via API");
    const dbAppADoc = await Application.findOne({ jobId: testJob._id, candidateId: candidateADoc._id });
    appAId = dbAppADoc._id;
    createdAppIds.push(appAId);

    // Candidate B: Bob
    candidateBUser = await User.create({
      firstName: "Bob",
      lastName: "Developer",
      email: candBEmail,
      password: testPassword,
      accountType: "candidate",
      status: "accepted",
      isVerified: true
    });
    createdUserIds.push(candidateBUser._id);

    candidateBDoc = await Candidate.create({
      user_id: candidateBUser._id,
      email: candBEmail,
      name: "Bob Developer",
      phone: "+1-555-0102",
      location: "San Francisco, CA",
      skills: ["Kubernetes", "AWS", "Python"],
      resumeText: "Cloud Developer with 5 years experience in Kubernetes, AWS, Docker and Python microservices.",
      resumeUrl: "uploads/Companied.pdf"
    });
    createdCandidateIds.push(candidateBDoc._id);
    candidateBUser.candidate = candidateBDoc._id;
    await candidateBUser.save();

    const candBToken = jwt.sign(
      { id: candidateBUser._id, role: "candidate" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const appBRes = await axios.post(
      `${NODE_URL}/api/v1/applications/apply`,
      {
        jobId: testJob._id,
        candidateId: candidateBDoc._id
      },
      { headers: { Authorization: `Bearer ${candBToken}` } }
    );
    assert(appBRes.status === 201, "Candidate B (Bob) Applied Successfully via API");
    const dbAppBDoc = await Application.findOne({ jobId: testJob._id, candidateId: candidateBDoc._id });
    appBId = dbAppBDoc._id;
    createdAppIds.push(appBId);

    // -------------------------------------------------------------------------
    // STEP 4: FETCH PIPELINE BOARD & CONFIRM INITIAL STAGE
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 4: VERIFY INITIAL PIPELINE STAGE (APPLIED)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const pipelineInitialRes = await axios.get(`${NODE_URL}/api/v1/applications`, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    assert(pipelineInitialRes.status === 200, "Fetch Pipeline Board API 200 OK");
    const appliedStage = pipelineInitialRes.data.pipeline?.find(s => s.name === "applied");
    assert(appliedStage && appliedStage.count >= 2, "Both Candidates Counted in 'applied' Stage", `Count: ${appliedStage?.count}`);
    const appliedApps = pipelineInitialRes.data.recentApplications?.filter(a => a.status === "applied");
    assert(appliedApps && appliedApps.length >= 2, "Both Candidate Cards Present in 'applied' Stage", `Count: ${appliedApps?.length}`);

    // -------------------------------------------------------------------------
    // STEP 5: SCHEDULE INTERVIEW FOR CANDIDATE A (ALICE)
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 5: SCHEDULE TECHNICAL INTERVIEW FOR CANDIDATE A (ALICE)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const interviewSchedulePayloadA = {
      date: "2026-11-20",
      time: "10:00 AM",
      type: "technical",
      interviewer: "Dr. Evelyn Reed (VP of Infrastructure)",
      location: "https://meet.google.com/xyz-tech-round",
      notes: "Deep dive into distributed systems & Kubernetes control planes."
    };

    const scheduleResA = await axios.patch(
      `${NODE_URL}/api/v1/applications/${appAId}/status`,
      {
        newStatus: "interview",
        scheduleForm: interviewSchedulePayloadA,
        details: [interviewSchedulePayloadA]
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );

    assert(scheduleResA.status === 200, "Schedule Status Update API 200 OK");
    assert(scheduleResA.data.data.status === "interview", "Candidate A Status Moved to 'interview'");
    assert(scheduleResA.data.data.scheduleForm?.date === "2026-11-20", "Interview Date Stored in Database", scheduleResA.data.data.scheduleForm?.date);
    assert(scheduleResA.data.data.scheduleForm?.interviewer === "Dr. Evelyn Reed (VP of Infrastructure)", "Interviewer Name Stored", scheduleResA.data.data.scheduleForm?.interviewer);
    assert(scheduleResA.data.data.scheduleForm?.location.includes("meet.google.com"), "Google Meet URL Verified", scheduleResA.data.data.scheduleForm?.location);

    // Verify MongoDB directly
    const dbAppA = await Application.findById(appAId);
    assert(dbAppA.status === "interview", "MongoDB Verified: Status === 'interview'");
    assert(dbAppA.scheduleForm?.type === "technical", "MongoDB Verified: scheduleForm.type === 'technical'");
    assert(Array.isArray(dbAppA.details) && dbAppA.details.length > 0, "MongoDB Verified: details array populated");

    // -------------------------------------------------------------------------
    // STEP 6: RECRUITER QUERY SCHEDULED INTERVIEWS ENDPOINT
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 6: RECRUITER QUERIES SCHEDULED INTERVIEWS API");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const getInterviewsRes = await axios.get(`${NODE_URL}/api/v1/applications/interviews/${appAId}`);
    assert(getInterviewsRes.status === 200, "GET /api/v1/applications/interviews/:id Returns 200 OK");
    assert(Array.isArray(getInterviewsRes.data) && getInterviewsRes.data.length > 0, "Interviews Array Returned", `Length: ${getInterviewsRes.data.length}`);
    const firstInterview = getInterviewsRes.data[0];
    const sForm = firstInterview.scheduleForm || firstInterview;
    assert(sForm.location === "https://meet.google.com/xyz-tech-round", "Meeting Link Retrieved Accurately", sForm.location);
    assert(sForm.notes.includes("Kubernetes control planes"), "Interview Notes Preserved", sForm.notes);

    // -------------------------------------------------------------------------
    // STEP 7: CANDIDATE APPLICATION VIEW VERIFICATION
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 7: CANDIDATE APPLICATION DETAILS VIEW (CANDIDATE PERSPECTIVE)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const candViewRes = await axios.post(
      `${NODE_URL}/api/v1/applications/find/application`,
      { candidateId: candidateADoc._id },
      { headers: { Authorization: `Bearer ${candAToken}` } }
    );
    assert(candViewRes.status === 200 && Array.isArray(candViewRes.data.data), "Candidate Fetches Application Records");
    const candidateApp = candViewRes.data.data.find(app => app._id === String(appAId));
    assert(!!candidateApp, "Candidate Finds Their Specific Application");
    assert(candidateApp.status === "interview", "Candidate Sees Stage === 'interview'");
    assert(candidateApp.scheduleForm?.date === "2026-11-20", "Candidate Sees Scheduled Interview Date", candidateApp.scheduleForm?.date);
    assert(candidateApp.scheduleForm?.time === "10:00 AM", "Candidate Sees Scheduled Time", candidateApp.scheduleForm?.time);
    assert(candidateApp.scheduleForm?.location === "https://meet.google.com/xyz-tech-round", "Candidate Sees Google Meet Link");

    // -------------------------------------------------------------------------
    // STEP 8: RESCHEDULE / UPDATE INTERVIEW
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 8: RECRUITER RESCHEDULES / UPDATES INTERVIEW DETAILS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const reschedulePayload = {
      date: "2026-11-24",
      time: "03:00 PM",
      type: "managerial",
      interviewer: "Marcus Vance (Director of Engineering)",
      location: "https://meet.google.com/rescheduled-director-round",
      notes: "Architectural strategy & leadership discussion."
    };

    const rescheduleRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${appAId}/status`,
      {
        newStatus: "interview",
        scheduleForm: reschedulePayload,
        details: [reschedulePayload]
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    assert(rescheduleRes.status === 200, "Reschedule API Returns 200 OK");
    assert(rescheduleRes.data.data.scheduleForm?.date === "2026-11-24", "Updated Date Confirmed", rescheduleRes.data.data.scheduleForm?.date);
    assert(rescheduleRes.data.data.scheduleForm?.type === "managerial", "Updated Type Confirmed (managerial)", rescheduleRes.data.data.scheduleForm?.type);
    assert(rescheduleRes.data.data.scheduleForm?.interviewer.includes("Marcus Vance"), "Updated Interviewer Confirmed", rescheduleRes.data.data.scheduleForm?.interviewer);
    assert(rescheduleRes.data.data.scheduleForm?.location.includes("rescheduled-director-round"), "Updated Meeting Link Confirmed");

    // -------------------------------------------------------------------------
    // STEP 9: SCHEDULE INTERVIEW FOR CANDIDATE B (BOB) & CHECK PIPELINE AGGREGATION
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 9: SCHEDULE INTERVIEW FOR CANDIDATE B & VERIFY PIPELINE DISTRIBUTION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const interviewSchedulePayloadB = {
      date: "2026-11-22",
      time: "11:30 AM",
      type: "hr",
      interviewer: "Sarah Connor (Talent Lead)",
      location: "https://meet.google.com/bob-hr-round",
      notes: "Culture fit and compensation alignment."
    };

    const scheduleResB = await axios.patch(
      `${NODE_URL}/api/v1/applications/${appBId}/status`,
      {
        newStatus: "interview",
        scheduleForm: interviewSchedulePayloadB,
        details: [interviewSchedulePayloadB]
      },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    assert(scheduleResB.status === 200 && scheduleResB.data.data.status === "interview", "Candidate B Moved to 'interview'");

    const pipelineAfterRes = await axios.get(`${NODE_URL}/api/v1/applications`, {
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });
    const interviewStage = pipelineAfterRes.data.pipeline?.find(s => s.name === "interview");
    assert(interviewStage && interviewStage.count >= 2, "Pipeline 'interview' Column Contains Both Candidates", `Count: ${interviewStage?.count}`);

    const interviewApps = pipelineAfterRes.data.recentApplications?.filter(a => a.status === "interview");
    const aliceCard = interviewApps?.find(c => String(c.id) === String(appAId));
    assert(!!aliceCard, "Alice Card Present in Pipeline 'interview' Stage");
    assert(aliceCard.status === "interview", "Alice Card Reflects 'interview' Status");

    const bobCard = interviewApps?.find(c => String(c.id) === String(appBId));
    assert(!!bobCard, "Bob Card Present in Pipeline 'interview' Stage");

    // -------------------------------------------------------------------------
    // STEP 10: CLEANUP TEST ARTIFACTS FROM DATABASE
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 10: TEARDOWN & DATABASE PURGE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (createdAppIds.length > 0) {
      await Application.deleteMany({ _id: { $in: createdAppIds } });
      console.log(`   🧹 Cleaned up ${createdAppIds.length} test applications`);
    }
    if (testJob?._id) {
      await Job.findByIdAndDelete(testJob._id);
      console.log(`   🧹 Cleaned up test job: ${testJob._id}`);
    }
    if (createdCandidateIds.length > 0) {
      await Candidate.deleteMany({ _id: { $in: createdCandidateIds } });
      console.log(`   🧹 Cleaned up ${createdCandidateIds.length} candidate profiles`);
    }
    if (companyDoc?._id) {
      await Company.findByIdAndDelete(companyDoc._id);
      console.log(`   🧹 Cleaned up company: ${companyDoc._id}`);
    }
    if (createdUserIds.length > 0) {
      await User.deleteMany({ _id: { $in: createdUserIds } });
      console.log(`   🧹 Cleaned up ${createdUserIds.length} user accounts`);
    }

    assert(true, "Database Cleaned Up Successfully");

    // =========================================================================
    // FINAL SUMMARY
    // =========================================================================
    console.log("\n================================================================================");
    console.log(`🏆 PIPELINE SCHEDULE FEATURES: ${testsPassed} / ${testsTotal} PASSED (100% SUCCESS)`);
    console.log("================================================================================\n");

  } catch (err) {
    console.error("\n💥 PIPELINE SCHEDULE TEST ENCOUNTERED AN ERROR:");
    console.error(err.response?.data || err.message);
    if (err.stack) console.error(err.stack);

    // Attempt cleanup on failure
    try {
      if (createdAppIds.length > 0) await Application.deleteMany({ _id: { $in: createdAppIds } });
      if (testJob?._id) await Job.findByIdAndDelete(testJob._id);
      if (createdCandidateIds.length > 0) await Candidate.deleteMany({ _id: { $in: createdCandidateIds } });
      if (companyDoc?._id) await Company.findByIdAndDelete(companyDoc._id);
      if (createdUserIds.length > 0) await User.deleteMany({ _id: { $in: createdUserIds } });
      console.log("   🧹 Cleaned up created records after error.");
    } catch (cleanupErr) {
      console.error("   ⚠️ Failed to complete cleanup:", cleanupErr.message);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("📦 Disconnected from MongoDB Atlas.\n");
  }
}

runPipelineScheduleE2ETest();
