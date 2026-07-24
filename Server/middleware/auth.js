import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Account deleted" });
    }
    req.user = user;

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "401 Unauthorized, authentication is required " });
  }
};

export default authMiddleware;
