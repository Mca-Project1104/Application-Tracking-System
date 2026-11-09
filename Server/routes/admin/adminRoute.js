import Router from "express";
import authMiddleware from "../../middleware/auth.js";
import {
  getUsers,
  getAllCompanies,
  getAllJobs,
  getAllApplications,
  deleteUser,
  updateApplicationStatus,
  updateUserStatus,
  getUsreDetail
} from "../../controller/admin/adminController.js";

const adminRouter = Router();

const requireAdmin = (req, res, next) => {
  if (req.user?.accountType !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

adminRouter.use(authMiddleware, requireAdmin);

adminRouter.get("/users", getUsers);
adminRouter.post("/user/detail", getUsreDetail);
adminRouter.get("/jobs", getAllJobs);
adminRouter.get("/companys", getAllCompanies);
adminRouter.delete("/user/:id", deleteUser);
adminRouter.get("/applications", getAllApplications);
adminRouter.put("/application/:id", updateApplicationStatus);
adminRouter.put("/user/status/:id", updateUserStatus);

export default adminRouter;
