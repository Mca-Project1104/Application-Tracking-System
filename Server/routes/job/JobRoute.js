import Router from "express";
import {
  createJob,
  getJobs,
  getAllJobs,
} from "../../controller/job/JobController.js";
import { companyAuthMiddleware } from "../../middleware/companyAuth.js";
import userAuth from "../../middleware/auth.js";

const jobRouter = Router();

jobRouter.post("/create", companyAuthMiddleware, createJob);

jobRouter.get("/company", companyAuthMiddleware, getJobs); //company middleware

jobRouter.get("/candidate", userAuth, getAllJobs); //candidate middleware

export default jobRouter;
