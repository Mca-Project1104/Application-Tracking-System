import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    candidateSnapshot: {
      type: mongoose.Schema.Types.Mixed,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    resume_Analyse: { type: Object },

    status: {
      type: String,
      enum: [
        "applied",
        "screening",
        "shortlisted",
        "interview",
        "offer",
        "hired",
        "rejected",
      ],
      default: "applied",
    },

    notes: [
      {
        text: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
