import Router from "express";
import {
  getUsers,
  getAllCompanies,
  getAllJobs,
  getAllApplications,
  deleteUser,
  updateApplicationStatus,
  updateUserStatus,
} from "../../controller/admin/adminController.js";

const adminRouter = Router();

// Check route
adminRouter.get("/", (_, res) => {
  res.status(200).json({ message: "Admin Router Running Successfully .." });
});

// --- USER MANAGEMENT ---
adminRouter.get("/allusers", getUsers);
adminRouter.delete("/user/:id", deleteUser);

// --- COMPANY/JOBS MANAGEMENT ---
adminRouter.get("/allcompany", getAllCompanies);
adminRouter.get("/alljobs", getAllJobs);

// --- APPLICATIONS MANAGEMENT ---
adminRouter.get("/allapplications", getAllApplications);
adminRouter.put("/application/:id", updateApplicationStatus);

adminRouter.put("/user/status/:id", updateUserStatus);
export default adminRouter;
