import { Router } from "express";
import { companyAuthMiddleware, authorizeRecruiter } from "../../middleware/companyAuth.js";
import {
  createCompanyProfile,
  companyProfile,
} from "../../controller/company/CompanyController.js";
import { upload } from "../../services/multerServices.js";
const companyRouter = Router();

companyRouter.post("/jobs", companyAuthMiddleware, authorizeRecruiter, (req, res) => {
  // Only approved recruiters can post jobs
});

companyRouter.get("/profile", companyAuthMiddleware, companyProfile);

companyRouter.post(
  "/profile",
  companyAuthMiddleware,
  upload.single("logo"),
  createCompanyProfile,
);

export default companyRouter;
