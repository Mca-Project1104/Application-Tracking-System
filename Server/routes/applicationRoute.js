import Router from "express";
import {
  applyJob,
  getapplications,
  updateApplication,
  getCompanyDashboard,
  allInterviews,
} from "../controller/applicationController.js";
import authMiddleware from "../middleware/auth.js";
import authCMiddleware from "../middleware/authMiddleware.js";
import { companyAuthMiddleware } from "../middleware/companyAuth.js";

const applicationRoute = Router();

applicationRoute.patch("/:id/status", authMiddleware, updateApplication);
applicationRoute.post("/apply", authMiddleware, applyJob);
applicationRoute.get("/interviews/:id", allInterviews);
applicationRoute.get("/", authCMiddleware, getCompanyDashboard);
applicationRoute.post("/find/application", authMiddleware, getapplications);

export default applicationRoute;
