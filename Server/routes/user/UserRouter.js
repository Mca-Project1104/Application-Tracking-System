import Router from "express";
import {
  registration,
  login,
  verifyEmail,
  forgotPassword,
  resendOTP,
} from "../../controller/user/UserController.js";
import authMiddleware from "../../middleware/auth.js";

const userRouter = Router();

userRouter.post("/register", registration);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend", resendOTP);
userRouter.post("/login", login);
userRouter.post("/forgetpass", authMiddleware, forgotPassword);

export default userRouter;
