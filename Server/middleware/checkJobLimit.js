import { Company } from "../model/CompanyModel.js";

const checkJobLimit = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.company);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (
      company.subscription?.endDate &&
      new Date(company.subscription.endDate).getTime() < Date.now()
    ) {
      await Company.findByIdAndUpdate(req.user.company, {
        $set: { "subscription.status": "EXPIRED" },
      });
      return res.status(403).json({ message: "Your plan has expired! Please renew." });
    }

    if (
      company.limits?.maxJobs !== -1 &&
      company.limits?.activeJobs >= company.limits?.maxJobs
    ) {
      return res.status(403).json({ message: "Job limit reached. Please upgrade your plan!" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Failed to verify job limits" });
  }
};

export default checkJobLimit;
