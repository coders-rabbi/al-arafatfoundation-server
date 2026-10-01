import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notfound";
import router from "./app/routes";
import config from "./app/config";
import cookieParser from "cookie-parser";

export const app: Application = express();
export const port = 3000;

//parser
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",
  "https://alarafatfoundation.org",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ---- DB connect middleware (router register হওয়ার আগে) ----
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(config.database_url as string)
      .then((m) => {
        console.log("MongoDB connected");
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.log("MongoDB connection error:", err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req: Request, res: Response, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});
// ---------------------------------------------------------------

app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.send("Al Arafat Foundation Server is running...");
});

//middleware
app.use(globalErrorHandler);
app.use(notFound);
