import Candidate from "../../model/Candidate.js";
import { User } from "../../model/UserModel.js";
import { sendVerificationEmail } from "../../utils/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registration = async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      status: accountType === "company" ? "pending" : "accepted",

      verificationCode: code,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000, // 10 min
    });

    await sendVerificationEmail(email, code);

    res.status(201).json({
      message: "User registered. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.verificationCode !== code ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//pandinfg this work resend otp frontend side
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendVerificationEmail(email, code);

    res.json({ message: "OTP resent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before login",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //  Access Token (short)
    const accessToken = jwt.sign(
      { id: user._id, role: user.accountType },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    //  Refresh Token (long)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    //  Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    //  Send as cookie used for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "Strict",
    });

    if (user.accountType === "candidate") {
      const candidateExists = await Candidate.findOne({ user_id: user._id });
      if (!candidateExists) {
        const candidate = new Candidate({
          user_id: user._id,
        });
        await candidate.save();
      }
    }
    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { password, newpassword } = req.body;
    const id = req.user.id;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "Not found user" });
    }

    const isVerified = await bcrypt.compare(password, user.password);

    if (!isVerified) {
      return res.status(409).json({ message: "Invalid Password" });
    }

    const hashPassword = await bcrypt.hash(newpassword, 10);

    await User.findByIdAndUpdate(user._id, {
      $set: { password: hashPassword },
    });

    res.status(200).json({ message: "Password Change Successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
