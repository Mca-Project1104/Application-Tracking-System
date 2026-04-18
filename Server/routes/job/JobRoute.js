import Router from "express";
import {
  createJob,
  getJobs,
  getAllJobs,
  deleteJob,
} from "../../controller/job/JobController.js";
import { companyAuthMiddleware } from "../../middleware/companyAuth.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import userAuth from "../../middleware/auth.js";

const jobRouter = Router();

jobRouter.post("/create", companyAuthMiddleware, createJob);

jobRouter.get("/company", authMiddleware, getJobs); //company middleware

jobRouter.get("/candidate", userAuth, getAllJobs); //candidate middleware

jobRouter.delete("/delete/job/:id", companyAuthMiddleware, deleteJob); //company

export default jobRouter;
