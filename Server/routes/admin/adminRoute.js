import Router from "express";
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

adminRouter.get("/users", getUsers);
adminRouter.post("/user/detail", getUsreDetail);
adminRouter.get("/jobs", getAllJobs);
adminRouter.get("/companys", getAllCompanies);
adminRouter.delete("/user/:id", deleteUser);
adminRouter.get("/applications", getAllApplications);
adminRouter.put("/application/:id", updateApplicationStatus);
adminRouter.put("/user/status/:id", updateUserStatus);

export default adminRouter;
