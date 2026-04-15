import Router from "express";
import {
  getUsers,
  getallCompany,
} from "../../controller/admin/adminController.js";

const adminRouter = Router();

adminRouter.get("/", (_, res) => {
  console.log("Admin Router running");
  res.status(200).json({ message: "Admin Router Running Succeessfully .." });
});

adminRouter.get("/allusers", getUsers);
adminRouter.get("/allcompany", getallCompany);

export default adminRouter;
