import jwt from "jsonwebtoken";
import { User } from "../model/UserModel.js";

// Company-specific authentication middleware
const companyAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ msg: "Token not found!" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id)
      .populate({
        path: "company",
        select: "_id",
      })
      .select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.accountType !== "company")
      return res.status(403).json({ msg: "Only recruiters allowed" });

    if (user.status !== "accepted")
      return res
        .status(403)
        .json({ msg: "Admin has not authorized your company" });

    req.user = {
      id: decoded.id,
      company: user.company,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Company auth error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Authorization middleware for recruiters
const authorizeRecruiter = (req, res, next) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Only recruiters allowed" });
  }

  if (req.user.status !== "approved") {
    return res.status(403).json({
      message: "Recruiter not approved yet",
    });
  }

  next();
};

export { companyAuthMiddleware, authorizeRecruiter };
