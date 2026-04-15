import { Company } from "../../model/CompanyModel.js";
import { User } from "../../model/UserModel.js";

// Create company profile
export const createCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has a company
    const existingUser = await User.findById(userId).populate("company");
    if (existingUser.company) {
      return res.status(400).json({
        success: false,
        message: "Company profile already exists",
      });
    }

    const { name, location } = req.body;
    const logo = req.file;
    // Create new company
    const company = await Company.create({
      name,
      location,
      logo: logo.filename,
      userId,
    });

    // Attach company to user
    existingUser.company = company._id;
    await existingUser.save();

    res.status(201).json({
      success: true,
      message: "Company profile created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const companyProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const companyData = await User.findById(id).populate({
      path: "company",
      select: "logo name location",
    }).select("-password");

    if (!companyData) {
      return res.status(400).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company find successfully", companyData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
