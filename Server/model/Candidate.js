{
  /* import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, //used mongoose to retrived user document
      ref: "User",
      required: true,
      unique: true,
    },
    phone: { type: String },
    location: { type: String },
    profile_image: { type: String },
    personal: { type: String },

    resumeUrl: String, // full URL (http://localhost:8000/uploads/filename.pdf)

    skills: [String],

    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    ats_score: { type: String, default: "0" }, //only candidate point of view

    education: [String],
    resumeText: { type: String },

    projects: [
      {
        name: String,
        description: String,
        link: String,
        technologies: [String],
      },
    ],

    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        credentialId: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Candidate", candidateSchema);
*/
}

import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profile_image: { type: String, default: "not found" },

    // ─── Personal / Contact Info ─────────────────────────
    phone: {
      type: String,
      default: "+91 -",
    },
    location: {
      type: String,
      default: null,
    },

    // ─── Social / Online Presence ────────────────────────
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

    // ─── About / Summary ─────────────────────────────────
    summary: {
      type: String,
      default: null,
    },

    // ─── Resume Content Sections ─────────────────────────
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

    // ─── Resume File ──────────────────────────────────────
    resumeUrl: {
      type: String,
      default: null,
    },
    resumeText: {
      type: String,
      default: null,
      select: true, // Don't return raw text in normal queries (perf)
    },

    // ─── ATS Score ────────────────────────────────────────
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
