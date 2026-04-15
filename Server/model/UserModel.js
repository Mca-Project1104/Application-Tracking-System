import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    accountType: {
      type: String,
      enum: ["candidate", "company", "admin"],
      required: true,
    },

    profile_image: { type: String },

    // Candidate-specific
    skills: [String],
    resume: String,
    experience: Number,

    // Employer-specific
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
    refreshToken: { type: String },

    status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: String,
    verificationCodeExpires: Date,
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
