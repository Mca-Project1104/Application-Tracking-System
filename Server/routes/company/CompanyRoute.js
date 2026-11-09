import { Router } from "express";
import { companyAuthMiddleware } from "../../middleware/companyAuth.js";
import {
  createCompanyProfile,
  companyProfile,
  getSubscription,
  updateCompanyProfile,
} from "../../controller/company/CompanyController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { upload } from "../../services/multerServices.js";

const companyRouter = Router();

companyRouter.get("/profile", authMiddleware, companyProfile);
companyRouter.get("/subscriptions", companyAuthMiddleware, getSubscription);
companyRouter.post(
  "/profile",
  authMiddleware,
  upload.single("logo"),
  createCompanyProfile,
);
companyRouter.put(
  "/profile",
  authMiddleware,
  upload.single("logo"),
  updateCompanyProfile,
);

export default companyRouter;
