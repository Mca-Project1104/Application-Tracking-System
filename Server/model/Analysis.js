import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },

    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    ats_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },

    keyword_match_percentage: {
      type: Number,
      default: 0,
    },

    matched_skills: {
      type: [String],
      default: [],
    },

    missing_skills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    experience_match: {
      type: String,
      default: "",
    },

    education_match: {
      type: String,
      default: "",
    },

    raw_response: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      enum: ["applied", "review", "shortlisted", "rejected"],
      default: "applied",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Analysis = mongoose.model("Analysis", analysisSchema);

//work is stop 7-4-2026 01:18AM
