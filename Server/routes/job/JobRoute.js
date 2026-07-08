import Router from "express";
import {
  createJob,
  getJobs,
  getAllJobs,
  deleteJob,
  updateJob,
  getJob,
} from "../../controller/job/JobController.js";
import { companyAuthMiddleware } from "../../middleware/companyAuth.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import userAuth from "../../middleware/auth.js";
import checkJobLimit from "../../middleware/checkJobLimit.js";

const jobRouter = Router();

jobRouter.post("/add", companyAuthMiddleware, checkJobLimit, createJob);
jobRouter.get("/company", authMiddleware, getJobs);
jobRouter.get("/candidate", userAuth, getAllJobs);
jobRouter.delete("/delete/:id", companyAuthMiddleware, deleteJob);
jobRouter.get("/:jobId", getJob);
jobRouter.patch("/update/:jobId", updateJob);

export default jobRouter;
