import { z } from "zod";

const createProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required"),
    duration: z.string().trim().min(1, "Duration is required"),
    location: z.string().trim().min(1, "Location is required"),
    beneficiary: z.number().min(0, "Beneficiary cannot be negative"),
    expense: z.number().min(0, "Expense cannot be negative"),
    status: z.enum(["Ongoing", "Completed"]).optional(),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required").optional(),
    duration: z.string().trim().min(1, "Duration is required").optional(),
    location: z.string().trim().min(1, "Location is required").optional(),
    beneficiary: z.number().min(0, "Beneficiary cannot be negative").optional(),
    expense: z.number().min(0, "Expense cannot be negative").optional(),
    status: z.enum(["Ongoing", "Completed"]).optional(),
  }),
});

export const projectValidations = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
