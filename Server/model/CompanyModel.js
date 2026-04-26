import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    logo: { type: String, required: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isVerified: { type: Boolean, default: false },

    subscription: {
      plan: {
        type: String,
        enum: ["FREE", "BASIC", "PRO"],
        default: "FREE",
      },

      status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
        default: "ACTIVE",
      },

      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },

      paymentId: { type: String, default: null },
    },

    limits: {
      maxJobs: {
        type: Number,
        default: 3,
      },
      activeJobs: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
);

export const Company = mongoose.model("Company", companySchema);
