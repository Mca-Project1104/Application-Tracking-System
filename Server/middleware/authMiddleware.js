import jwt from "jsonwebtoken";
import { User } from "../model/UserModel.js";

const authMiddleware = async (req, res, next) => {
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
    console.error(err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default authMiddleware;
