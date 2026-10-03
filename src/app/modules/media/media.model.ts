import { Schema, model } from "mongoose";
import { IMedia } from "./media.interface";
import { MEDIA_TYPES } from "./media.constant";

const mediaSchema = new Schema<IMedia>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: MEDIA_TYPES,
      required: [true, "Media type is required"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
    },
    publicId: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const Media = model<IMedia>("Media", mediaSchema);
