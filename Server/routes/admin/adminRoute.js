import Router from "express";
import {
  getUsers,
  getallCompany,
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
adminRouter.get("/allusers", getUsers); // GET all users
adminRouter.delete("/user/:id", deleteUser); // DELETE user

// --- COMPANY/JOBS MANAGEMENT ---
adminRouter.get("/allcompany", getallCompany); // Get companies with stats
adminRouter.get("/alljobs", getAllJobs); // GET all jobs

// --- APPLICATIONS MANAGEMENT ---
adminRouter.get("/allapplications", getAllApplications); // GET all applications
adminRouter.put("/application/:id", updateApplicationStatus); // UPDATE application status

adminRouter.put("/user/status/:id", updateUserStatus); // UPDATE application status
export default adminRouter;
