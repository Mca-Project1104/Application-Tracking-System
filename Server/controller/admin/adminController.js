import JobModel from "../../model/JobModel.js";
import { User } from "../../model/UserModel.js";
import Application from "../../model/ApplicationModel.js";

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
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Failed to count users",
    });
  }
};

export const getallCompany = async (req, res) => {
  try {
    const result = await JobModel.aggregate([
      {
        $group: {
          _id: "$company",
          jobCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "companyData",
        },
      },
      {
        $unwind: {
          path: "$companyData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          jobCount: 1,
          "companyData.name": 1,
          "companyData.location": 1,
          "companyData.logo": 1,
          "companyData.email": 1,
        },
      },
      {
        $sort: { jobCount: -1 },
      },
    ]);

    const totalJobs = await JobModel.countDocuments({
      status: "Open",
    });

    res.status(200).json({ message: "Data found", totalJobs, company: result });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobModel.find({})
      .populate("company", "name logo email") // Get company details for charts
      .sort({ createdAt: -1 });

    res.status(200).json({ data: jobs });
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate("candidateId", "name email location skills") // Populate candidate details
      .populate("jobId", "title status company createdAt") // Populate Job details
      .sort({ createdAt: -1 });

    res.status(200).json({ data: applications });
  } catch (error) {
    console.error("Error fetching all applications:", error);
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

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
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
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findById(req.params.id).select(
      "-refreshToken -password -verificationCode",
    );

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "user status updated", user });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
