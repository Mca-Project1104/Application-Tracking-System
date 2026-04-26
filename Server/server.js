import express from "express";
import "dotenv/config";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import jobRouter from "./routes/job/JobRoute.js";
import connectDB from "./database/Connection.js";
import userRouter from "./routes/user/UserRouter.js";
import adminRouter from "./routes/admin/adminRoute.js";
import analyzerRouter from "./routes/ResumeAnalyzer.js";
import { refreshToken } from "./services/refreshToken.js";
import applicationRoute from "./routes/applicationRoute.js";
import companyRouter from "./routes/company/CompanyRoute.js";
import candidateRouter from "./routes/candidate/CandidateRoute.js";

import Stripe from "stripe";
import {
  createCheckoutSession,
  stripeWebhookHandler,
} from "./services/StripServices.js";

const stripe = new Stripe(process.env.SECRET_KEY);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

let cached = global.mongoose || { conn: null, promise: null };

const connect = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = connectDB()
      .then((db) => {
        console.log("MongoDB connected");
        return db;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;

  return cached.conn;
};

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Server Running :- Resume Ranking System",
  });
});

app.use("/api/user", userRouter);
app.use("/api/resume", analyzerRouter);
app.use("/api/candidates", candidateRouter);
app.use("/api/company", companyRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRoute);
app.use("/api/admin", adminRouter);

app.post("/api/refresh", refreshToken);
app.post("/api/payment/create-checkout-session", createCheckoutSession);

const startServer = async () => {
  try {
    await connect();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

startServer();
