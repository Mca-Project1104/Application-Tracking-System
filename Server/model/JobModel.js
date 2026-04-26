import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", //  FIXED (was "User")
      required: true,
    },
    companyName: { type: String },

    description: String,
    location: String,

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Temporary"],
    },

    experienceLevel: {
      type: String,
      enum: [
        "Entry-level",
        "Associate",
        "Mid-level",
        "Senior-level",
        "Director",
        "Executive",
      ],
    },

    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
    },

    openingJob: { type: Number, required: true, default: 0 },

    skillsRequired: [String],

    salaryMin: Number,
    salaryMax: Number,

    department: String,

    benefits: [String],

    requirements: String,
    responsibilities: String,

    applicationDeadline: Date,
    contactEmail: String,

    isFeatured: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["Draft", "Open", "Closed", "On Hold"],
      default: "Draft",
    },

    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
