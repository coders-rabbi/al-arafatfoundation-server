// blog.model.ts
import { Schema, model } from "mongoose";
import { IBlog } from "./blog.interface";

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

blogSchema.pre("find", function () {
  this.find({ isDeleted: { $ne: true } });
});

blogSchema.pre("findOne", function () {
  this.find({ isDeleted: { $ne: true } });
});

blogSchema.pre("countDocuments", function () {
  this.where({ isDeleted: { $ne: true } });
});

// Aggregate use korle
blogSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

export const Blog = model<IBlog>("Blog", blogSchema);
