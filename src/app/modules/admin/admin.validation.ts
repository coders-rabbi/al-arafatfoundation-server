// admin.validation.ts
import { z } from "zod";
import { ADMIN_ROLE } from "./admin.constant";

const createAdminValidationSchema = z.object({
  body: z.object({
    adminName: z
      .string({ message: "Name is required" })
      .min(1, "Name cannot be empty")
      .trim(),
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format")
      .trim()
      .toLowerCase(),
    profileImage: z.string().optional(),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    role: z.enum(Object.values(ADMIN_ROLE) as [string, ...string[]], {
      message: "Role is required",
    }),
    isActive: z.enum(["active", "blocked"]).optional(),
  }),
});

const updateAdminValidationSchema = z.object({
  body: z.object({
    adminName: z.string().min(1, "Name cannot be empty").trim().optional(),
    email: z
      .string()
      .email("Invalid email format")
      .trim()
      .toLowerCase()
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    role: z.enum(Object.values(ADMIN_ROLE) as [string, ...string[]]).optional(),
    isDeleted: z.boolean().optional(),
    isActive: z.enum(["active", "blocked"]).optional(),
  }),
});

export const AdminValidation = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
