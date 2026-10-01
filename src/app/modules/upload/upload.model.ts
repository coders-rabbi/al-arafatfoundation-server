// src/modules/upload/upload.model.ts
//
// Adjust the schema fields / model name to match your existing conventions
// (e.g. if other models use `Schema.Types.ObjectId` refs for uploadedBy).

import { Schema, model, Document, Types } from "mongoose";

export type TUploadType = "image" | "video";

export interface IUpload extends Document {
  url: string;
  publicId: string;
  type: TUploadType;
  format: string;
  size: number;
  uploadedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const uploadSchema = new Schema<IUpload>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    format: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Reporter" },
  },
  { timestamps: true },
);

export const UploadModel = model<IUpload>("Upload", uploadSchema);
