import { z } from "zod";
import { DONATION_METHODS, DONATION_STATUS } from "./donation.constant";

const createDonationValidationSchema = z.object({
  body: z.object({
    amount: z
      .number({ error: "Amount is required" })
      .min(10, "Minimum donation amount is 10 BDT")
      .max(10000000, "Amount is too large"),

    method: z.enum(DONATION_METHODS, {
      error: "Payment method must be bkash, nagad, rocket or upay",
    }),

    name: z
      .string({ error: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),

    phone: z
      .string({ error: "Phone number is required" })
      .trim()
      .regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number"),

    trxId: z
      .string({ error: "Transaction ID is required" })
      .trim()
      .toUpperCase()
      .min(5, "Transaction ID is too short")
      .max(30, "Transaction ID is too long")
      .regex(/^[A-Z0-9]+$/, "Transaction ID can only contain letters and numbers"),

    note: z.string().trim().max(500, "Note is too long").optional(),
  }),
});

const updateDonationStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(DONATION_STATUS, {
      error: "Status must be pending, verified or rejected",
    }),
  }),
});

export const donationValidations = {
  createDonationValidationSchema,
  updateDonationStatusValidationSchema,
};