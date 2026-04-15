import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, min: 8, max: 20 },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "candidate",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "application",
      required: true,
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
