import JobModel from "../../model/JobModel.js";
import User from "../../model/UserModel.js";
import Application from "../../model/ApplicationModel.js";
import { Company } from "../../model/CompanyModel.js";
import Candidate from "../../model/CandidateModel.js";

export const getUsers = async (_, res) => {
  try {
    const [users, totalUsers, totalCandidates, totalCompanies] =
      await Promise.all([
        User.find({ accountType: { $ne: "admin" } })
          .select("-password -refreshToken")
          .sort({ createdAt: -1 })
          .populate({
            path: "company",
            select: "name location logo",
          })
          .populate({ path: "candidate", select: "profile_image resumeUrl" }),

        User.countDocuments({ accountType: { $ne: "admin" } }),
        User.countDocuments({ accountType: "candidate" }),
        User.countDocuments({ accountType: "company" }),
      ]);

    return res.status(200).json({
      totalUsers,
      totalCandidates,
      totalCompanies,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to count users",
    });
  }
};

export const getUsreDetail = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.body.id }).select(
      "-password -refreshToken",
    );

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    let typeData = null;
    if (data.accountType === "candidate") {
      typeData = await Candidate.findOne({ user_id: data._id });
    } else {
      typeData = await Company.findOne({ userId: data._id });
    }
    const detail = {
      user: data,
      type: typeData,
    };

    res.status(200).json({ message: "User Found", data: detail });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const matchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Use Aggregation to count jobs dynamically
    const result = await Company.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "company",
          as: "postedJobs",
        },
      },
      {
        $addFields: {
          jobsUsed: { $size: "$postedJobs" },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ]);

    const companies = result[0].data;
    const total = result[0].metadata[0]?.total || 0;
    const totalJobs = await JobModel.countDocuments({ status: "Open" });

    res.status(200).json({
      message: "Companies fetched successfully",
      company: companies,
      totalJobs,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobModel.find({})
      .populate("company", "name logo email")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: jobs });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate("candidateId", "name email location skills")
      .populate("jobId", "title status company createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: applications });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.accountType === "admin") {
      return res
        .status(403)
        .json({ message: "Cannot delete an admin account" });
    }

    await Candidate.deleteMany({ user_id: req.params.id });
    await Company.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    const [users, totalUsers, totalCandidates, totalCompanies] =
      await Promise.all([
        User.find({ accountType: { $ne: "admin" } })
          .select("-password -refreshToken")
          .sort({ createdAt: -1 })
          .populate({
            path: "company",
            select: "name location logo",
          })
          .populate({ path: "candidate", select: "profile_image resumeUrl" }),

        User.countDocuments({ accountType: { $ne: "admin" } }),
        User.countDocuments({ accountType: "candidate" }),
        User.countDocuments({ accountType: "company" }),
      ]);

    res.status(200).json({
      message: "User deleted successfully",
      users,
      totalUsers,
      totalCandidates,
      totalCompanies,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res
      .status(200)
      .json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findById(req.params.id).select(
      " -password -verificationCode",
    );

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "user status updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
