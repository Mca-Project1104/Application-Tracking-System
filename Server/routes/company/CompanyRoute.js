import { Router } from "express";
import {
  companyAuthMiddleware,
  authorizeRecruiter,
} from "../../middleware/companyAuth.js";
import {
  createCompanyProfile,
  companyProfile,
} from "../../controller/company/CompanyController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { upload } from "../../services/multerServices.js";
const companyRouter = Router();

companyRouter.post(
  "/jobs",
  companyAuthMiddleware,
  authorizeRecruiter,
);

companyRouter.get("/profile", authMiddleware, companyProfile);

companyRouter.post(
  "/profile",
  authMiddleware, 
  upload.single("logo"),
  createCompanyProfile,
);

export default companyRouter;
