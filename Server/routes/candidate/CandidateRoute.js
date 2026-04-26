import Router from "express";
import {
  updateCandidate,
  getCandidate,
  downloadResume,
} from "../../controller/candidate/CandidateController.js";
import multer from "multer";
import authMiddleware from "../../middleware/auth.js";
import { upload } from "../../services/multerServices.js";

const candidateRouter = Router();

// routes/candidateRoutes.js
candidateRouter.put(
  "/update/:id",
  upload.single("profile_image"),
  updateCandidate,
);

candidateRouter.get("/", authMiddleware, getCandidate);
candidateRouter.get("/resume/:id", downloadResume);

export default candidateRouter;
