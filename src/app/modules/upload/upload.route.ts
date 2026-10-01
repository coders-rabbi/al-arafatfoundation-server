// src/modules/upload/upload.router.ts
import express from "express";
import { uploadFileController } from "./upload.controller";
import { uploadMiddleware } from "../../middleware/multer";

const router = express.Router();

// Mirrors your existing route naming, e.g. "/news/create_news"
router.post(
  "/upload_file",
  uploadMiddleware.single("file"),
  uploadFileController,
);

export const uploadhRoutes = router;
