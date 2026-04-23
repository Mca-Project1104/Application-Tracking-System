import Application from "../model/ApplicationModel.js";
import Job from "../model/JobModel.js";
import { Company } from "../model/CompanyModel.js";
import Candidate from "../model/Candidate.js";
import axios from "axios";
import { application } from "express";
import { InterviewEmail, HiredEmial } from "../utils/sendEmail.js";

// APPLY JOB
export const applyJob = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    const job = await Job.findById(jobId);

    if (!job) return res.status(404).json({ msg: "Job not found" });

    const U_candidate = await Candidate.findById(candidateId).select("-_id");

    if (!U_candidate) {
      return res.status(404).json({ message: "user not found" });
    }
    const resume = U_candidate.resumeText;

    const payload = {
      resume: resume,
      JD: job?.requirements || job?.responsibilities,
    };

    // groq endpoint calling
    const response = await axios.post(
      "http://localhost:8080/api/ats/score",
      payload,
    );

    const score = response.data;
    const application = new Application({
      jobId,
      candidateId: candidateId,
      candidateSnapshot: U_candidate,
      resumeText: JSON.stringify(resume), // convert to string
      resumeUrl: U_candidate.resumeUrl, //statically add iresume path
      resume_Analyse: score,
      score: score.match_score,
    });

    await application.save();

    // update application count
    job.applicationsCount += 1;
    await job.save();

    res.status(201).json({ msg: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
};

export const getapplications = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const application = await Application.find({
      candidateId: candidateId,
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
      });

    if (application.length <= 0) {
      return res.status(303).json({ message: "application not found" });
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
    const company = await Company.findOne({ _id: req.user.company });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobs = await Job.find({ company: company._id }).sort("-createdAt");
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      jobId: { $in: jobIds },
    }).populate({
      path: "candidateId",
      select: "user_id profile_image skills location",
      populate: {
        path: "user_id",
        model: "User",
        select: "firstName lastName email profile_image",
      },
    });

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

    const recentApplications = applications
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 6)
      .map((app) => ({
        id: app._id,
        jobId: app.jobId,
        candidate: app.candidateId,
        resumeUrl: app.resumeUrl,
        score: app.score,
        resume_Analyse: app.resume_Analyse,
        position: jobs.find((j) => j._id.equals(app.jobId))?.title,
        status: app.status,
      }));

    const jobPostings = jobs.map((job) => ({
      id: job._id,
      position: job.title,
      department: job.department,
      applicants: applications.filter((a) => a.jobId.equals(job._id)).length,
      status: job.status,
      posted: job.createdAt,
    }));

    res.status(200).json({
      stats,
      pipeline,
      recentApplications,
      jobs: jobPostings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//update status application
export const manageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, details = "" } = req.body;
    const { email } = req.user;

    if (!id || !details) {
      return res.stats(422).json({ message: "id and details not found " });
    }

    const response = await Application.findByIdAndUpdate(
      { _id: id, status: { $ne: "hired" } },
      {
        $set: { status: newStatus, details: details },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("-resumeText")
      .populate({
        path: "jobId",
        select: "companyName location",
      })
      .populate("candidateId", "email");

    const candidateEmail = response.candidateId.email;

    if (!candidateEmail) {
      return res.status(404).json({ message: " Candidate Email not found" });
    }

    if (newStatus === "interview" && response.status === "interview") {
      if (!response.details) {
        return res
          .status(400)
          .json({ message: "Details not fount please set interview detail ." });
      }
      //manage this response not complete
      const data = {
        userName: response?.details[0].candidateName,
        status: response?.status,
        resumeScore: response.score,
        skills: response?.resume_Analyse?.matched_skills,
        feedback: response?.details[0].notes,
        interviewDate: response?.details[0]?.date,
        interviewTime: response.details[0].time,
        interviewLocation: response.details[0].location,
      };

      await InterviewEmail({ email: response.candidateId.email, data: data });
    }

    //send mail successfully hired candidate
    if (newStatus === "hired" && response.status === "hired") {
      if (!response.details) {
        return res
          .status(400)
          .json({ message: "Details not fount please set interview detail ." });
      }

      const data = {
        username: response?.details[0]?.candidateName,
        companyName: response.jobId.companyName,
        joiningDate: response?.details[0]?.date,
        jobLocation: response.jobId.location,
      };

      await HiredEmial({ email: response.candidateId.email, data: data });
    }

    res.status(200).json({ message: "Update Successfully .", data: response });
  } catch (error) {
    res.status(500).json({ message: "server error " });
  }
};
