import { User } from "../model/UserModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const refreshToken = async (req, res) => {
  const oldToken = req.cookies.refreshToken;

  if (!oldToken) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== oldToken) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7d
    });
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.accountType },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Expired token" });
  }
};
