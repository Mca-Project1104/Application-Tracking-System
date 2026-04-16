import Router from "express";
import {
  applyJob,
  getapplications,
  manageStatus,
  getCompanyDashboard,
} from "../controller/applicationController.js";
import authMiddleware from "../middleware/auth.js";
import { companyAuthMiddleware } from "../middleware/companyAuth.js";

const applicationRoute = Router();

applicationRoute.post("/apply", authMiddleware, applyJob);
applicationRoute.post("/find/application", authMiddleware, getapplications);

applicationRoute.patch(`/applications/:id/status`, manageStatus);

applicationRoute.get("/", companyAuthMiddleware, getCompanyDashboard);

export default applicationRoute;
