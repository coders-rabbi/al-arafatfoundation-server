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

postSchema.pre(
  ["find", "findOne", "findOneAndUpdate", "findOneAndDelete", "countDocuments"],
  function () {
    const filter = this.getFilter();

    // query-তে যদি নিজে থেকে status দেওয়া থাকে (যেমন admin trash দেখতে চাইলে
    // { status: "deleted" }), তাহলে সেটা বদলাবে না
    if (filter.status === undefined) {
      this.where({ status: { $ne: "deleted" } });
    }
  },
);

postSchema.pre("aggregate", function () {
  const pipeline = this.pipeline();
  const firstStage = pipeline[0] as Record<string, unknown> | undefined;

  // $geoNear সবসময় প্রথম stage হতে হয়, তাই তার পরে বসাতে হবে
  const index = firstStage && "$geoNear" in firstStage ? 1 : 0;
  pipeline.splice(index, 0, { $match: { status: { $ne: "deleted" } } });
});

export const Post = model<IPost>("Post", postSchema);
