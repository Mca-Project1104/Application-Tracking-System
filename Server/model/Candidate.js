import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    email: { type: String },

    profile_image: { type: String, default: "not found" },

    phone: {
      type: String,
      default: "+91 -",
    },
    location: {
      type: String,
      default: null,
    },

    linkedin: {
      type: String,
      default: null,
    },
    github: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    twitter: {
      type: String,
      default: null,
    },

    summary: {
      type: String,
      default: null,
    },

    education: {
      type: [String],
      default: [],
    },
    experience: {
      type: [String],
      default: [],
    },
    projects: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },

    resumeUrl: {
      type: String,
      default: null,
    },
    resumeText: {
      type: String,
      default: null,
      select: true, // Don't return raw text in normal queries (perf)
    },

    ats_score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  },
);

const Candidate = mongoose.model("Candidate", CandidateSchema);
export default Candidate;
