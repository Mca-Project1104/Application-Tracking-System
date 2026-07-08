import Candidate from "../../model/CandidateModel.js";
import User  from "../../model/UserModel.js";
import { upload_image } from "../../services/multerServices.js";


export const downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate || !candidate.resumeFile) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const filePath = `uploads/${candidate.resumeFile}`;

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { personal } = req.body;
    const file = req.file;

    if (!id) {
      return res.status(400).json({ message: "Detail missing" });
    }

    let updateData = {};
    if (file) {
      const url = await upload_image(file);
      updateData.profile_image = url;
    }

    if (personal) {
      updateData.personal = personal;
    }

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
