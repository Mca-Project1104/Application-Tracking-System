import { Company } from "../../model/CompanyModel.js";
import User from "../../model/UserModel.js";
import { upload_image } from "../../services/multerServices.js";

export const createCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, location } = req.body;

    const existingUser = await User.findById(userId)
      .populate("company")
      .select("-password");

    if (existingUser.company) {
      return res.status(400).json({
        success: false,
        message: "recruiter profile already exists",
      });
    }

    // Create new company
    const url = req.file
      ? await upload_image(req.file)
      : req.body.logo ||
        "https://res.cloudinary.com/djkgybvjp/image/upload/q_auto/f_auto/v1775588313/HIRE_FLOW_eg829b.png";
    const company = await Company.create({
      name,
      location,
      logo: url,
      userId,
    });

    // Attach company to user
    existingUser.company = company._id;
    await existingUser.save();

    res.status(201).json({
      success: true,
      message: "recruiter profile created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const companyProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const companyData = await User.findById(id)
      .populate({
        path: "company",
        select: "logo name location subscription isVerified limits createdAt updatedAt",
      })
      .select("-password");

    if (!companyData) {
      return res.status(400).json({ message: "recruiter not found" });
    }

    res
      .status(200)
      .json({ message: "recruiter find successfully", companyData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSubscription = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const details = await Company.findById(req.user.company).select(
      "subscription",
    );

    if (!details) {
      return res.status(404).json({ message: "Details not found" });
    }

    if (
      details.subscription?.endDate &&
      new Date(details.subscription.endDate).getTime() < Date.now()
    ) {
      await Company.findByIdAndUpdate(req.user.company, {
        $set: { "subscription.status": "EXPIRED" },
      });
      return res.status(403).json({ message: "Your plan expire!" });
    }

    res.status(200).json({ message: "find details", data: details });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.company?._id || req.user.company;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "No company profile associated with this account",
      });
    }

    const { name, location } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;

    if (req.file) {
      updateData.logo = await upload_image(req.file);
    } else if (req.body.logo) {
      updateData.logo = req.body.logo;
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $set: updateData },
      { new: true },
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company profile updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
