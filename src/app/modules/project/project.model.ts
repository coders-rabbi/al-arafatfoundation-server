import { Schema, model } from "mongoose";
import { IProject } from "./project.interface";

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    beneficiary: {
      type: Number,
      required: [true, "Beneficiary is required"],
      min: [0, "Beneficiary cannot be negative"],
    },
    expense: {
      type: Number,
      required: [true, "Expense is required"],
      min: [0, "Expense cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed"],
      default: "Ongoing",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Soft deleted project query theke bad dibe
projectSchema.pre(
  ["find", "findOne", "findOneAndUpdate", "findOneAndDelete", "countDocuments"],
  function () {
    const filter = this.getFilter();

    // nijer theke isDeleted deya thakle (admin trash dekhte chaile) bodlabe na
    if (filter.isDeleted === undefined) {
      this.where({ isDeleted: { $ne: true } });
    }
  },
);

projectSchema.pre("aggregate", function () {
  const pipeline = this.pipeline();
  const firstStage = pipeline[0] as Record<string, unknown> | undefined;

  const index = firstStage && "$geoNear" in firstStage ? 1 : 0;
  pipeline.splice(index, 0, { $match: { isDeleted: { $ne: true } } });
});

export const Project = model<IProject>("Project", projectSchema);