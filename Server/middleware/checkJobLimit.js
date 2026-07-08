import e from "express";
import { Company } from "../model/CompanyModel.js";

const checkJobLimit = async (req, res, next) => {
  const company = await Company.findById(req.user.company);

  // if (company.subscription.status !== "ACTIVE") {
  //   return res.status(403).json({ message: "Subscription expired" });
  // }

  if (company.subscription.endDate < new Date().toISOString()) {
  }

  if (
    new Date(company.subscription.endDate).toLocaleDateString() <
    new Date().toLocaleDateString()
  ) {
    await Company.findByIdAndUpdate(req.user.company, {
      $set: { subscription: null },
    });
    return res.status(403).json({ message: "Your plan expire!" });
  }

  if (
    company.limits.maxJobs !== -1 &&
    company.limits.activeJobs >= company.limits.maxJobs
  ) {
    return res.status(403).json({ message: "Upgrade your plan !" });
  }

  next();
};

export default checkJobLimit;
