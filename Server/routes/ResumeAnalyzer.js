// routes/analyzerRouter.js
import { Router } from "express";
import { upload } from "../services/multerServices.js";
import { analyzeResume } from "../controller/ResumeController.js";
import authMiddleware from "../middleware/auth.js";

const analyzerRouter = Router();

analyzerRouter.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"), //lmulter services stored in localdisk
  analyzeResume,
);

export default analyzerRouter;
