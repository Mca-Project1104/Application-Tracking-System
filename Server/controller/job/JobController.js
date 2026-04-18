import Job from "../../model/JobModel.js";
import { User } from "../../model/UserModel.js";

export const createJob = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's company
    const user = await User.findById(userId);

    if (!user.company) {
      return res.status(400).json({
        message: "Please create company profile first",
      });
    }

    const job = await Job.create({
      ...req.body,
      company: user.company,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const id = req.user.company;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({ company: id })
      .populate({
        path: "company",
        select: "name logo location",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments({ company: id });

    if (jobs.length === 0) {
      return res
        .status(200)
        .json({ message: "No jobs found", data: [], total: 0, page, limit });
    }

    res.status(200).json({
      message: "ok",
      data: jobs,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const response = await Job.find(query)
      .populate({
        path: "company",
        select: "name logo location",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(query);

    if (response.length === 0) {
      return res
        .status(200)
        .json({ message: "No jobs found", data: [], total: 0, page, limit });
    }

    res.status(200).json({
      message: "ok",
      data: response,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await JobModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server Error" });
  }
};