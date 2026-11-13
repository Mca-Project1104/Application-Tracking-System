import Application from "../model/ApplicationModel.js";
import Job from "../model/JobModel.js";
import { Company } from "../model/CompanyModel.js";
import Candidate from "../model/CandidateModel.js";
import fs from "fs";
import { application } from "express";
import { scoreResumeWithGroq } from "../services/groqAtsScorer.js";
import {
  InterviewEmail,
  InterviewEmailToRecruiter,
  sendDualInterviewEmail,
  hiredEmail,
} from "../utils/sendEmail.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    const job = await Job.findById(jobId);

    if (!job)
      return res
        .status(404)
        .json({ msg: "Job not found", message: "Job not found" });

    const existingApplication = await Application.findOne({
      jobId,
      candidateId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({
          msg: "You have already applied for this job",
          message: "You have already applied for this job",
        });
    }

    const U_candidate = await Candidate.findById(candidateId).select("-_id");

    if (!U_candidate) {
      return res.status(404).json({ message: "user not found" });
    }
    const resume = U_candidate.resumeText;

    if (!resume) {
      return res.status(404).json({ message: "Please upload resume" });
    }

    const jobDescription = job?.requirements || job?.responsibilities;
    if (typeof jobDescription !== "string" || !jobDescription.trim()) {
      return res
        .status(400)
        .json({ message: "A job description is required to score the resume" });
    }

    const score = await scoreResumeWithGroq(resume, jobDescription);
    const application = new Application({
      jobId,
      candidateId: candidateId,
      candidateSnapshot: U_candidate,
      resumeText: JSON.stringify(resume),
      resumeUrl: U_candidate.resumeUrl,
      resume_Analyse: score,
      score: score.match_score,
    });

    application.status = "applied";
    await application.save();

    job.applicationsCount += 1;
    await job.save();

    res.status(201).json({ msg: "Applied successfully" });
  } catch (err) {
    console.error("applyJob error:", err);
    res
      .status(500)
      .json({
        error: "Could not score this application. Please try again later.",
      });
  }
};

export const getapplications = async (req, res) => {
  try {
    const targetCandidateId = req.body.candidateId || req.user?.candidate;

    if (!targetCandidateId) {
      return res.status(400).json({ message: "Candidate ID required" });
    }

    const application = await Application.find({
      candidateId: targetCandidateId,
    })
      .populate({
        path: "jobId",
        populate: {
          path: "company",
          select: "logo",
        },
      })
      .populate({
        path: "candidateId",
      })
      .sort({ createdAt: -1 }) //arrange descending order
      .select("-candidateSnapshot -resumeText");

    if (application.length === 0) {
      return res
        .status(200)
        .json({ message: "No applications found", data: [] });
    }

    res
      .status(200)
      .json({ message: "Successfully find application", data: application });
  } catch (error) {
    res.status(500).json({ message: "Internal server error !" });
  }
};

export const getCompanyDashboard = async (req, res) => {
  try {
    const companyId = req.user.company;
    if (!companyId) {
      return res.status(404).json({ message: "Company not found" });
    }

    const [company, jobs] = await Promise.all([
      Company.findById(companyId).lean(),
      Job.find({ company: companyId })
        .select("title department location status openingJob createdAt")
        .sort("-createdAt")
        .lean(),
    ]);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      jobId: { $in: jobIds },
    })
      .select("-resumeText -candidateSnapshot")
      .populate({
        path: "candidateId",
        select: "user_id profile_image skills location phone",
        populate: {
          path: "user_id",
          model: "User",
          select: "firstName lastName email profile_image",
        },
      })
      .lean();

    const stats = {
      totalApplicants: applications.length,
      activeJobs: jobs.filter((j) => j.status === "Open").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted")
        .length,
      interviewsToday: applications.filter((a) => a.status === "interview")
        .length,
    };

    const pipeline = [
      "applied",
      "screening",
      "shortlisted",
      "interview",
      "offer",
      "hired",
      "rejected",
    ].map((stage) => ({
      name: stage,
      count: applications.filter((a) => a.status === stage).length,
    }));

    const jobTitleMap = new Map(jobs.map((j) => [String(j._id), j.title]));
    const applicantCountMap = new Map();
    for (const app of applications) {
      const jId = String(app.jobId);
      applicantCountMap.set(jId, (applicantCountMap.get(jId) || 0) + 1);
    }

    const recentApplications = [...applications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((app) => ({
        id: app._id,
        _id: app._id,
        jobId: app.jobId,
        candidate: app.candidateId,
        candidateId: app.candidateId,
        resumeUrl: app.resumeUrl,
        score: app.score,
        resume_Analyse: app.resume_Analyse,
        position: jobTitleMap.get(String(app.jobId)) || "Job Position",
        status: app.status,
        scheduleForm: app.scheduleForm,
        details: app.details,
      }));

    const jobPostings = jobs.map((job) => ({
      id: job._id,
      position: job.title,
      department: job.department,
      applicants: applicantCountMap.get(String(job._id)) || 0,
      status: job.status,
      opening: job.openingJob,
      posted: job.createdAt,
    }));

    res.status(200).json({
      stats,
      pipeline,
      recentApplications,
      jobs: jobPostings,
      company: company,
    });
  } catch (error) {
    console.error("Error in getCompanyDashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, details, scheduleForm } = req.body;
    const { email } = req.user;

    if (!id) {
      return res.status(422).json({ message: "id and details not found " });
    }

    const updateFields = {
      status: newStatus,
    };
    if (details !== undefined) updateFields.details = details;
    if (scheduleForm !== undefined) {
      const loc = scheduleForm.location || "";
      const isTeams =
        loc.includes("teams.microsoft.com") ||
        loc.includes("teams.live.com") ||
        scheduleForm.platform === "teams";
      const detectedPlatform = isTeams
        ? "teams"
        : loc.includes("meet.google.com") || scheduleForm.platform === "meet"
          ? "meet"
          : loc.includes("zoom.us") || scheduleForm.platform === "zoom"
            ? "zoom"
            : scheduleForm.platform || "custom";

      updateFields.scheduleForm = {
        ...scheduleForm,
        platform: detectedPlatform,
        interviewerEmail: scheduleForm.interviewerEmail || email,
      };
    }

    const response = await Application.findOneAndUpdate(
      { _id: id, status: { $ne: "hired" } },
      { $set: updateFields },
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
      .populate({
        path: "jobId",
        select: "companyName location title",
      })
      .populate({
        path: "candidateId",
        populate: {
          path: "user_id",
          select: "email firstName lastName",
        },
      })
      .select("-resumeText");

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Application not found or already finalized as hired.",
      });
    }

    const candidateEmail =
      response.candidateId?.email || response.candidateId?.user_id?.email;

    if (!candidateEmail) {
      return res.status(404).json({ message: " Candidate Email not found" });
    }

    if (newStatus === "interview" && response.status === "interview") {
      const interviewInfo =
        response.scheduleForm ||
        (Array.isArray(response.details)
          ? response.details[0]
          : response.details);

      if (!interviewInfo) {
        return res
          .status(400)
          .json({ message: "Details not found. Please set interview detail." });
      }

      const candidateName =
        [
          response?.candidateId?.user_id?.firstName,
          response?.candidateId?.user_id?.lastName,
        ]
          .filter(Boolean)
          .join(" ") || "Candidate";

      const jobPosition = response?.jobId?.title || "Job Position";
      const companyName = response?.jobId?.companyName || "HireFlow";
      const meetingLoc = interviewInfo?.location || "Online";
      const platform =
        interviewInfo?.platform ||
        (meetingLoc.includes("teams.microsoft.com") ||
        meetingLoc.includes("teams.live.com")
          ? "teams"
          : meetingLoc.includes("meet.google.com")
            ? "meet"
            : meetingLoc.includes("zoom.us")
              ? "zoom"
              : "custom");

      const recruiterEmail =
        interviewInfo?.interviewerEmail || email || req.user?.email;
      const interviewerName = interviewInfo?.interviewer || "Hiring Team";

      const candidateData = {
        username: candidateName,
        userName: candidateName,
        jobPosition: jobPosition,
        companyName: companyName,
        status: response?.status,
        resumeScore: response.score || 0,
        skills: response?.resume_Analyse?.matched_skills || [],
        feedback: interviewInfo?.notes || "Interview scheduled",
        interviewDate: interviewInfo?.date || new Date().toLocaleDateString(),
        interviewTime: interviewInfo?.time || "10:00 AM",
        interviewLocation: meetingLoc,
        roundType: interviewInfo?.type || "technical",
        interviewer: interviewerName,
        platform: platform,
        recruiterEmail: recruiterEmail,
      };

      const recruiterData = {
        candidateName: candidateName,
        candidateEmail: candidateEmail,
        jobPosition: jobPosition,
        companyName: companyName,
        status: response?.status,
        resumeScore: response.score || 0,
        skills: response?.resume_Analyse?.matched_skills || [],
        feedback: interviewInfo?.notes || "Interview scheduled",
        interviewDate: interviewInfo?.date || new Date().toLocaleDateString(),
        interviewTime: interviewInfo?.time || "10:00 AM",
        interviewLocation: meetingLoc,
        roundType: interviewInfo?.type || "technical",
        interviewer: interviewerName,
        platform: platform,
      };

      await sendDualInterviewEmail({
        candidateEmail: candidateEmail,
        recruiterEmail: recruiterEmail,
        candidateData: candidateData,
        recruiterData: recruiterData,
      });
    }

    if (newStatus === "hired" && response.status === "hired") {
      const hireInfo =
        (Array.isArray(response.details)
          ? response.details[0]
          : response.details) || {};

      const data = {
        username: response?.candidateId?.user_id?.firstName,
        companyName: response?.jobId?.companyName || "Company",
        jobPosition: response?.jobId?.title || "N/A",
        joiningDate: hireInfo?.date || new Date().toLocaleDateString(),
        jobLocation: response?.jobId?.location || "Remote",
      };

      await hiredEmail({
        email: response?.candidateId?.user_id?.email,
        data,
      });
    }

    res.status(200).json({ message: "Update Successfully .", data: response });
  } catch (error) {
    res.status(500).json({ message: "server error " });
  }
};

export const allInterviews = async (req, res) => {
  try {
    const data = await Application.find(
      { _id: req.params.id },
      { scheduleForm: 1 },
    );

    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

export const getCompanyInterviews = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.user.company });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobs = await Job.find({ company: company._id }).select(
      "title department location companyName",
    );
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({
      jobId: { $in: jobIds },
      $or: [
        { status: "interview" },
        { "scheduleForm.date": { $exists: true, $ne: "" } },
      ],
    })
      .populate({
        path: "jobId",
        select: "title department location companyName",
      })
      .populate({
        path: "candidateId",
        select: "user_id profile_image skills location phone",
        populate: {
          path: "user_id",
          model: "User",
          select: "firstName lastName email profile_image",
        },
      })
      .sort({ updatedAt: -1 });

    const todayStr = new Date().toISOString().split("T")[0];
    const stats = {
      total: applications.length,
      teams: applications.filter(
        (a) =>
          a.scheduleForm?.platform === "teams" ||
          /teams\.microsoft\.com|teams\.live\.com/i.test(
            a.scheduleForm?.location || "",
          ),
      ).length,
      zoom: applications.filter(
        (a) =>
          a.scheduleForm?.platform === "zoom" ||
          /zoom\.us/i.test(a.scheduleForm?.location || ""),
      ).length,
      meet: applications.filter(
        (a) =>
          a.scheduleForm?.platform === "meet" ||
          /meet\.google\.com/i.test(a.scheduleForm?.location || ""),
      ).length,
      today: applications.filter((a) => a.scheduleForm?.date === todayStr)
        .length,
    };

    res.status(200).json({
      success: true,
      interviews: applications,
      stats,
    });
  } catch (error) {
    console.error("Error fetching company interviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadApplicationResume = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app || !app.resumeUrl) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const directPath = app.resumeUrl;
    if (fs.existsSync(directPath)) {
      return res.download(directPath);
    }

    const parts = directPath.split("/");
    const fileName = parts.pop();
    const dir = parts.join("/");
    const spacedPath = `${dir}/ ${fileName}`;
    if (fs.existsSync(spacedPath)) {
      return res.download(spacedPath);
    }
    const trimmedPath = `${dir}/${fileName.trim()}`;
    if (fs.existsSync(trimmedPath)) {
      return res.download(trimmedPath);
    }

    return res
      .status(404)
      .json({ error: "Resume file does not exist on server" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
