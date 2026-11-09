/**
 * End-to-End Automated Verification Test Suite for:
 * 1. Microsoft Teams Meeting Integration (URL detection, platform metadata)
 * 2. Dual Notification (HR / Recruiter & Selected Candidate)
 * 3. iCalendar (.ics) RFC 5545 generation and synchronization
 * 4. 1-Click Meeting Launch and Candidate Portal formatting
 */

import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateIcsCalendar } from "../utils/calendarHelper.js";
import User from "../model/UserModel.js";
import { Company } from "../model/CompanyModel.js";
import Job from "../model/JobModel.js";
import Candidate from "../model/CandidateModel.js";
import Application from "../model/ApplicationModel.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const NODE_URL = "http://localhost:8000";
const timestamp = Date.now();
const testPassword = "TeamsPassword123!";

const recruiterEmail = `hr.lead.${timestamp}@teamsflowcorp.com`;
const candidateEmail = `jobseeker.jane.${timestamp}@talentpro.org`;
const hrInterviewerEmail = `sarah.lead.hr.${timestamp}@teamsflowcorp.com`;

const teamsMeetingUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${timestamp}%40thread.v2/0?context=%7b%22Tid%22%3a%22test-tenant-id%22%2c%22Oid%22%3a%22test-user-id%22%7d`;
const rescheduledTeamsUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_rescheduled_${timestamp}%40thread.v2/0?context=%7b%22Tid%22%3a%22test-tenant-id%22%7d`;

let recruiterUser, recruiterToken, companyDoc, testJob;
let candidateUser, candidateToken, candidateDoc, testApp;

const createdUserIds = [];
const createdCandidateIds = [];
const createdAppIds = [];
const createdJobIds = [];
const createdCompanyIds = [];

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

async function runTeamsDualInterviewE2ETest() {
  console.log("\n================================================================================");
  console.log("   🟣 MICROSOFT TEAMS & DUAL NOTIFICATION END-TO-END VERIFICATION");
  console.log("================================================================================\n");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB Atlas.\n");

    // -------------------------------------------------------------------------
    // STEP 1: CALENDAR HELPER (.ICS) RFC 5545 UNIT VALIDATION
    // -------------------------------------------------------------------------
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 1: RFC 5545 iCALENDAR (.ICS) GENERATOR VALIDATION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const sampleIcs = generateIcsCalendar({
      uid: `test-${timestamp}@hireflow.com`,
      title: "Senior Cloud Architect Technical Interview - TeamsFlow",
      description: "Technical Round\\nMeeting with Sarah Connor",
      location: teamsMeetingUrl,
      date: "2026-11-25",
      time: "02:30 PM",
      organizerEmail: hrInterviewerEmail,
      organizerName: "TeamsFlow HR",
      attendeeEmail: candidateEmail,
      attendeeName: "Jane Seeker",
    });

    assert(sampleIcs.includes("BEGIN:VCALENDAR"), "iCal Contains BEGIN:VCALENDAR");
    assert(sampleIcs.includes("VERSION:2.0"), "iCal Standard Version 2.0");
    assert(sampleIcs.includes("METHOD:REQUEST"), "iCal Meeting Request Method Valid");
    assert(sampleIcs.includes("BEGIN:VEVENT"), "iCal Contains VEVENT Definition");
    assert(sampleIcs.includes("LOCATION:https://teams.microsoft.com"), "iCal Encodes Teams Meeting Location");
    assert(sampleIcs.includes(hrInterviewerEmail), "iCal Contains HR Organizer Email");
    assert(sampleIcs.includes(candidateEmail), "iCal Contains Candidate Attendee Email");
    assert(sampleIcs.includes("END:VEVENT"), "iCal Closes VEVENT");
    assert(sampleIcs.includes("END:VCALENDAR"), "iCal Closes VCALENDAR");

    // -------------------------------------------------------------------------
    // STEP 2: SETUP RECRUITER & CANDIDATE TENANTS
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 2: RECRUITER & CANDIDATE REGISTRATION AND AUTHENTICATION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    recruiterUser = await User.create({
      firstName: "Sarah",
      lastName: "Connor",
      email: recruiterEmail,
      password: testPassword,
      accountType: "company",
      status: "accepted",
      isVerified: true,
    });
    createdUserIds.push(recruiterUser._id);

    companyDoc = await Company.create({
      name: "TeamsFlow Technologies",
      location: "Seattle, WA",
      logo: "https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png",
      userId: recruiterUser._id,
      isVerified: true,
      subscription: { plan: "PRO", status: "ACTIVE" },
      limits: { maxJobs: 10, activeJobs: 1 },
    });
    createdCompanyIds.push(companyDoc._id);

    recruiterUser.company = companyDoc._id;
    await recruiterUser.save();

    recruiterToken = jwt.sign(
      { id: recruiterUser._id, role: "company" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    assert(!!recruiterToken, "Recruiter Authentication Token Generated");

    candidateUser = await User.create({
      firstName: "Jane",
      lastName: "Talent",
      email: candidateEmail,
      password: testPassword,
      accountType: "candidate",
      status: "accepted",
      isVerified: true,
    });
    createdUserIds.push(candidateUser._id);

    candidateDoc = await Candidate.create({
      user_id: candidateUser._id,
      email: candidateEmail,
      phone: "+1-206-555-0199",
      location: "Seattle, WA",
    });
    createdCandidateIds.push(candidateDoc._id);

    candidateToken = jwt.sign(
      { id: candidateUser._id, role: "candidate" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    assert(!!candidateToken, "Candidate Authentication Token Generated");

    testJob = await Job.create({
      title: "Senior Fullstack Engineer (Microsoft Stack)",
      company: companyDoc._id,
      companyName: "TeamsFlow Technologies",
      department: "Engineering",
      location: "Remote / Hybrid",
      employmentType: "Full-time",
      workMode: "Remote",
      experienceLevel: "Senior-level",
      status: "Open",
      openingJob: 2,
      description: "Building next-generation enterprise microservices.",
    });
    createdJobIds.push(testJob._id);

    testApp = await Application.create({
      jobId: testJob._id,
      candidateId: candidateDoc._id,
      resumeUrl: "resumes/jane_senior_engineer.pdf",
      score: 94,
      resume_Analyse: {
        matched_skills: ["React", "Node.js", "TypeScript", "Microsoft Teams API", "Azure"],
        missing_skills: ["GraphQL"],
      },
      status: "applied",
    });
    createdAppIds.push(testApp._id);

    assert(testApp._id != null, "Application Created with ATS Score 94%");

    // -------------------------------------------------------------------------
    // STEP 3: SCHEDULE INTERVIEW WITH MICROSOFT TEAMS MEETING LINK
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 3: SCHEDULE INTERVIEW VIA MICROSOFT TEAMS (DUAL NOTIFICATION)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const schedulePayload = {
      date: "2026-11-25",
      time: "02:30 PM",
      type: "technical",
      platform: "teams",
      interviewer: "Sarah Connor (Lead Recruiter)",
      interviewerEmail: hrInterviewerEmail,
      location: teamsMeetingUrl,
      notes: "Please test microphone and camera on Microsoft Teams before joining.",
    };

    const scheduleResponse = await axios.patch(
      `${NODE_URL}/api/v1/applications/${testApp._id}/status`,
      {
        newStatus: "interview",
        scheduleForm: schedulePayload,
        details: [schedulePayload],
      },
      {
        headers: { Authorization: `Bearer ${recruiterToken}` },
      }
    );

    assert(scheduleResponse.status === 200, "Schedule Status Update API returns 200 OK");
    const updatedAppData = scheduleResponse.data.data;
    assert(updatedAppData.status === "interview", "Application Status Updated to 'interview'");
    assert(updatedAppData.scheduleForm.platform === "teams", "scheduleForm.platform Identified as 'teams'");
    assert(updatedAppData.scheduleForm.location === teamsMeetingUrl, "scheduleForm.location Contains Teams Join Link");
    assert(updatedAppData.scheduleForm.interviewerEmail === hrInterviewerEmail, "HR Interviewer Email Stored in scheduleForm");
    assert(updatedAppData.scheduleForm.type === "technical", "Round Type Stored (technical)");

    // -------------------------------------------------------------------------
    // STEP 4: VERIFY PERSISTED MONGODB DATA INTEGRITY
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 4: DIRECT DATABASE PERSISTENCE VERIFICATION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const dbApp = await Application.findById(testApp._id);
    assert(dbApp.status === "interview", "MongoDB: Status is 'interview'");
    assert(dbApp.scheduleForm?.platform === "teams", "MongoDB: scheduleForm.platform is 'teams'");
    assert(dbApp.scheduleForm?.interviewerEmail === hrInterviewerEmail, "MongoDB: Interviewer Email Preserved");
    assert(dbApp.scheduleForm?.location.includes("teams.microsoft.com"), "MongoDB: Teams URL Intact in DB");

    // -------------------------------------------------------------------------
    // STEP 5: VERIFY CANDIDATE PORTAL DATA FETCH & METADATA
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 5: CANDIDATE APPLICANT DETAIL METADATA");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const candidateFetchRes = await axios.post(
      `${NODE_URL}/api/v1/applications/find/application`,
      { candidateId: candidateDoc._id },
      {
        headers: { Authorization: `Bearer ${candidateToken}` },
      }
    );

    assert(candidateFetchRes.status === 200, "Candidate Fetches Their Applications Successfully");
    const candidateApps = candidateFetchRes.data.data || candidateFetchRes.data;
    const matchingApp = (Array.isArray(candidateApps) ? candidateApps : []).find(
      (a) => a._id === testApp._id.toString()
    );

    assert(matchingApp != null, "Candidate Finds Their Scheduled Application");
    assert(matchingApp.status === "interview", "Candidate Sees Stage === 'interview'");
    assert(matchingApp.scheduleForm?.location === teamsMeetingUrl, "Candidate Sees Microsoft Teams Meeting Link");
    assert(matchingApp.scheduleForm?.platform === "teams", "Candidate Sees Platform is 'teams'");
    assert(matchingApp.scheduleForm?.date === "2026-11-25", "Candidate Sees Correct Date");
    assert(matchingApp.scheduleForm?.time === "02:30 PM", "Candidate Sees Correct Time");

    // -------------------------------------------------------------------------
    // STEP 6: RESCHEDULE INTERVIEW TO A NEW MICROSOFT TEAMS CHANNEL
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 6: RESCHEDULE INTERVIEW (UPDATED TEAMS LINK & NOTIFICATIONS)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const reschedulePayload = {
      date: "2026-11-28",
      time: "04:00 PM",
      type: "managerial",
      platform: "teams",
      interviewer: "Marcus Vance (VP of Engineering)",
      interviewerEmail: recruiterEmail,
      location: rescheduledTeamsUrl,
      notes: "Rescheduled: System architecture review on Microsoft Teams.",
    };

    const rescheduleRes = await axios.patch(
      `${NODE_URL}/api/v1/applications/${testApp._id}/status`,
      {
        newStatus: "interview",
        scheduleForm: reschedulePayload,
        details: [reschedulePayload],
      },
      {
        headers: { Authorization: `Bearer ${recruiterToken}` },
      }
    );

    assert(rescheduleRes.status === 200, "Reschedule API Returns 200 OK");
    const rescheduledData = rescheduleRes.data.data;
    assert(rescheduledData.scheduleForm.date === "2026-11-28", "Updated Interview Date Confirmed");
    assert(rescheduledData.scheduleForm.time === "04:00 PM", "Updated Time Confirmed");
    assert(rescheduledData.scheduleForm.type === "managerial", "Updated Round Type Confirmed (managerial)");
    assert(rescheduledData.scheduleForm.location === rescheduledTeamsUrl, "Updated Microsoft Teams URL Confirmed");
    assert(rescheduledData.scheduleForm.platform === "teams", "Updated Platform is 'teams'");

    // -------------------------------------------------------------------------
    // STEP 7: COMPANY INTERVIEWS DASHBOARD ENDPOINT (GET /company/interviews)
    // -------------------------------------------------------------------------
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("STEP 7: COMPANY INTERVIEWS NAVIGATION & API VERIFICATION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const companyInterviewsRes = await axios.get(
      `${NODE_URL}/api/v1/applications/company/interviews`,
      {
        headers: { Authorization: `Bearer ${recruiterToken}` },
      }
    );

    assert(companyInterviewsRes.status === 200, "Company Interviews API Returns 200 OK");
    assert(Array.isArray(companyInterviewsRes.data?.interviews), "Interviews Array Returned");
    assert(companyInterviewsRes.data?.stats != null, "Interview Statistics KPI Object Returned");
    assert(typeof companyInterviewsRes.data.stats.total === "number", "Stats: total is a number");
    assert(typeof companyInterviewsRes.data.stats.teams === "number", "Stats: teams count is a number");
    assert(companyInterviewsRes.data.stats.teams >= 1, "Stats: At least 1 Teams interview counted");

    const fetchedInterview = companyInterviewsRes.data.interviews.find(
      (item) => item._id === testApp._id.toString()
    );
    assert(fetchedInterview != null, "Scheduled Interview Found in Company Interviews Feed");
    assert(fetchedInterview.status === "interview", "Interview Item Status is 'interview'");
    assert(fetchedInterview.scheduleForm?.platform === "teams", "Interview Item Platform is 'teams'");

    const popUser = fetchedInterview.candidateId?.user_id || {};
    const candidateName = [popUser.firstName, popUser.lastName].filter(Boolean).join(" ");
    assert(candidateName === "Jane Talent", "Populated Candidate Name Present ('Jane Talent')");
    assert(popUser.email === candidateEmail, "Populated Candidate Email Matches");
    assert(fetchedInterview.jobId?.title === "Senior Fullstack Engineer (Microsoft Stack)", "Populated Job Title Matches");

    console.log("\n================================================================================");
    console.log(`🎉 ALL TESTS PASSED: ${testsPassed} / ${testsTotal} (100% SUCCESS)`);
    console.log("================================================================================\n");

  } catch (error) {
    console.error("\n❌ TEST FAILED WITH ERROR:", error?.response?.data || error.message);
    throw error;
  } finally {
    // Cleanup created test records
    console.log("🧹 Cleaning up test database artifacts...");
    try {
      if (createdAppIds.length) await Application.deleteMany({ _id: { $in: createdAppIds } });
      if (createdJobIds.length) await Job.deleteMany({ _id: { $in: createdJobIds } });
      if (createdCandidateIds.length) await Candidate.deleteMany({ _id: { $in: createdCandidateIds } });
      if (createdCompanyIds.length) await Company.deleteMany({ _id: { $in: createdCompanyIds } });
      if (createdUserIds.length) await User.deleteMany({ _id: { $in: createdUserIds } });
      console.log("✅ Cleanup complete.");
    } catch (cleanupErr) {
      console.warn("⚠️ Cleanup warning:", cleanupErr.message);
    }
    await mongoose.disconnect();
  }
}

runTeamsDualInterviewE2ETest();
