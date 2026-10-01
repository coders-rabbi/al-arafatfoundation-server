import { z } from "zod";

const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required"),

    content: z.string().trim().min(1, "Content is required"),

    imageUrl: z
      .array(z.url("Each image must be a valid URL"))
      .max(10, "Maximum 10 images allowed")
      .optional(),

    videoUrl: z.url("Video URL must be valid").optional().or(z.literal("")),

    projectAim: z.string().trim().min(1, "Project aim is required"),

    benificiary: z.string().trim().min(1, "Beneficiary is required"),

    expense_details: z.string().trim().min(1, "Expense details are required"),

    projectLocation: z.string().trim().min(1, "Project location is required"),

    duration: z.string().trim().min(1, "Duration is required"),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required").optional(),

    content: z.string().trim().min(1, "Content is required").optional(),

    imageUrl: z
      .array(z.url("Each image must be a valid URL"))
      .max(10, "Maximum 10 images allowed")
      .optional(),

    videoUrl: z.url("Video URL must be valid").optional().or(z.literal("")),

    projectAim: z.string().trim().min(1, "Project aim is required").optional(),

    benificiary: z.string().trim().min(1, "Beneficiary is required").optional(),

    expense_details: z
      .string()
      .trim()
      .min(1, "Expense details are required")
      .optional(),

    projectLocation: z
      .string()
      .trim()
      .min(1, "Project location is required")
      .optional(),

    duration: z.string().trim().min(1, "Duration is required").optional(),
  }),
});

export const postValidations = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
