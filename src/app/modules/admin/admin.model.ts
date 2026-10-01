import { model, Schema } from "mongoose";
import { TAdmin } from "./admin.interface";
import { ADMIN_ROLE } from "./admin.constant";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import config from "../../config";

const AdminSchema = new Schema<TAdmin>(
  {
    adminName: { type: String, required: true, message: "Name is required" },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    profileImage: {
      type: String,
      default: ""
    },
    password: { type: String, required: true, select: false },
    passwordChangeAt: { type: Date },
    role: {
      type: String,
      enum: Object.values(ADMIN_ROLE),
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

AdminSchema.pre("save", async function () {
  if (!this.isNew) return;
  const existingAdmin = await Admin.findOne({
    email: this.email,
  });
  if (existingAdmin) {
    throw new AppError(StatusCodes.CONFLICT, "User already exists!");
  }
});

AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds) || 10,
  );
});

AdminSchema.pre("find", function () {
  this.where({
    role: { $ne: "super_admin" },
    isDeleted: false,
    isActive: "active",
  });
});

export const Admin = model<TAdmin>("admin", AdminSchema);
