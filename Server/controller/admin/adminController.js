import JobModel from "../../model/JobModel.js";
import { User } from "../../model/UserModel.js";

export const getUsers = async (_, res) => {
  try {
    const [users, totalUsers, totalCandidates, totalCompanies] =
      await Promise.all([
        User.find({ accountType: { $ne: "admin" } }, { refreshToken: 0 })
          .select("-password")
          .sort({ createdAt: -1 })
          .populate({
            path: "company",
            select: "name location logo",
          })
          .populate({ path: "candidate", select: "profile_image resumeUrl" }),

        User.countDocuments({ accountType: { $ne: "admin" } }), //operator used a not equal $ne

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
          from: "companies", // collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "companyData",
        },
      },
      {
        $unwind: "$companyData",
      },
      {
        $project: {
          jobCount: 1,
          "companyData.name": 1,
          "companyData.location": 1,
          "companyData.logo": 1,
        },
      },
    ]);

    const totalJobs = await JobModel.countDocuments({
      status: { $eq: "Open" },
    });

    res.status(200).json({ message: "find data", totalJobs, company: result });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
