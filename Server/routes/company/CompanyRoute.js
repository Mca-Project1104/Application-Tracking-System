import { Router } from "express";
import {
  companyAuthMiddleware,
  authorizeRecruiter,
} from "../../middleware/companyAuth.js";
import {
  createCompanyProfile,
  companyProfile,
  getSubscription,
} from "../../controller/company/CompanyController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { upload } from "../../services/multerServices.js";
const companyRouter = Router();

companyRouter.post("/jobs", companyAuthMiddleware, authorizeRecruiter);

companyRouter.get("/profile", authMiddleware, companyProfile);

companyRouter.get("/subscription", companyAuthMiddleware, getSubscription);

companyRouter.post(
  "/profile",
  authMiddleware,
  upload.single("logo"),
  createCompanyProfile,
);

export default companyRouter;
