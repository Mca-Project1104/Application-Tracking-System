import Candidate from "../../model/CandidateModel.js";
import User  from "../../model/UserModel.js";
import { upload_image } from "../../services/multerServices.js";
import fs from "fs";

export const downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    const resumePath =
      candidate?.resumeUrl ||
      (candidate?.resumeFile ? `uploads/${candidate.resumeFile}` : null);

    if (!candidate || !resumePath) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (fs.existsSync(resumePath)) {
      return res.download(resumePath);
    }

    const parts = resumePath.split("/");
    const fileName = parts.pop();
    const dir = parts.join("/");
    const spacedPath = `${dir}/ ${fileName}`;
    if (fs.existsSync(spacedPath)) {
      return res.download(spacedPath);
    }
    const trimmedPath = `${dir}/${fileName.trim()}`;
    if (fs.existsSync(trimmedPath)) {
      return res.download(trimmedPath);
    }

    return res.status(404).json({ error: "Resume file does not exist on server" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!id) {
      return res.status(400).json({ message: "Detail missing" });
    }

    const targetCandidate = await Candidate.findById(id);
    if (!targetCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const callerCandidateId = req.user?.candidate?.toString?.();
    const callerUserId = req.user?.id?.toString?.();
    const isOwner =
      (callerCandidateId && callerCandidateId === id.toString()) ||
      (callerUserId && targetCandidate.user_id && targetCandidate.user_id.toString() === callerUserId);
    const isAdmin = req.user?.accountType === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized: You cannot edit another candidate's profile" });
    }

    let updateData = {};
    if (file) {
      const url = await upload_image(file);
      updateData.profile_image = url;
    }

    const allowedFields = [
      "personal",
      "phone",
      "location",
      "linkedin",
      "github",
      "website",
      "twitter",
      "education",
      "experience",
      "projects",
      "certifications",
      "languages",
      "skills",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).select("-resumeText");

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({
      message: "Candidate updated successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCandidate = async (req, res) => {
  try {
    const userId = req.user.id;
    const candidate = await Candidate.findOne({ user_id: userId }).populate({
      path: "user_id",
      select: "firstName lastName",
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json({ message: "Candidate found", data: candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
