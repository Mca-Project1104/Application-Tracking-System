import Candidate from "../../model/Candidate.js";
import { User } from "../../model/UserModel.js";
import { upload_image } from "../../services/multerServices.js";

// Get ranked candidates
export const getRankedCandidates = async (req, res) => {
  const candidates = await Candidate.find().sort({ score: -1 });

  res.json(candidates);
};

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

// controllers/candidateController.js
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const file = req.file;

    console.log("FILE:", file);

    if (!id) {
      return res.status(400).json({ message: "Candidate ID is required" });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (status) {
      candidate.status = status;
    }

    if (file) {
      const url = await upload_image(file);
      console.log(url);
      candidate.profile_image = url;
    }
    else if (req.body.profile_image === "") {
      candidate.profile_image = undefined;
    }

    const updatedCandidate = await candidate.save();

    res.status(200).json({
      message: "Candidate updated successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Update error:", error);
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
    res.status(200).json({ data: candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
