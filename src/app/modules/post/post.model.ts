import { Schema, model } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    imageUrl: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      default: "",
    },
    projectAim: {
      type: String,
      required: [true, "Project aim is required"],
    },
    benificiary: {
      type: String,
      required: [true, "Beneficiary is required"],
    },
    expense_details: {
      type: String,
      required: [true, "Expense details are required"],
    },
    projectLocation: {
      type: String,
      required: [true, "Project location is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "deleted", "draft"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Post = model<IPost>("Post", postSchema);
