import { Request, Response } from "express";
import * as uploadService from "./upload.service";

export const uploadFileController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const uploadedBy = req.body?.reporterId as string | undefined;

    const uploadPayload: Parameters<typeof uploadService.uploadFile>[0] = {
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
    };
    if (uploadedBy) {
      uploadPayload.uploadedBy = uploadedBy;
    }
    const record = await uploadService.uploadFile(uploadPayload);

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: record,
      url: record.url, // convenience field so the frontend can read `data.url` directly
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "File upload failed",
    });
  }
};
