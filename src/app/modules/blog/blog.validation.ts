// blog.validation.ts
import { z } from "zod";

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required"),

    content: z.string().trim().min(1, "Content is required"),

    images: z
      .array(z.url("Each image must be a valid URL"))
      .max(10, "Maximum 10 images allowed")
      .default([]),
  }),
});

const updateBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required").optional(),

    content: z.string().trim().min(1, "Content is required").optional(),

    images: z
      .array(z.url("Each image must be a valid URL"))
      .max(10, "Maximum 10 images allowed")
      .optional(),
  }),
});

export const blogValidations = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
