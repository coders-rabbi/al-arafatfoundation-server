import { z } from "zod";
import { getYouTubeId } from "./media.utils";

const imageBody = z.object({
  title: z.string().trim().min(1, "Title is required"),
  type: z.literal("image"),
  url: z.url("Image URL must be valid"),
  publicId: z.string().trim().min(1, "Image publicId is required"),
});

const videoBody = z.object({
  title: z.string().trim().min(1, "Title is required"),
  type: z.literal("video"),
  url: z
    .url("Video URL must be valid")
    .refine((value) => !!getYouTubeId(value), "Must be a valid YouTube link"),
});

const createMediaValidationSchema = z.object({
  body: z.discriminatedUnion("type", [imageBody, videoBody]),
});

const updateMediaValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required"),
  }),
});

const bulkDeleteMediaValidationSchema = z.object({
  body: z.object({
    ids: z.array(z.string().min(1)).min(1, "At least one id is required"),
  }),
});

export const mediaValidations = {
  createMediaValidationSchema,
  updateMediaValidationSchema,
  bulkDeleteMediaValidationSchema,
};
