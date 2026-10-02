import { Schema, model } from "mongoose";
import { IBlog } from "./blog.interface";

// blog.model.ts
const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Blog = model<IBlog>("Blog", blogSchema);
