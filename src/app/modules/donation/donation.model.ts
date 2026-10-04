import { Schema, model } from "mongoose";
import { TDonation } from "./donation.interface";
import { DONATION_METHODS, DONATION_STATUS } from "./donation.constant";

const donationSchema = new Schema<TDonation>(
  {
    amount: { type: Number, required: true, min: 10 },
    method: { type: String, enum: [...DONATION_METHODS], required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    trxId: { type: String, required: true, trim: true, uppercase: true },
    note: { type: String, trim: true, default: "" },
    status: { type: String, enum: [...DONATION_STATUS], default: "pending" },
  },
  { timestamps: true },
);

// একই মাধ্যমে একই Transaction ID দুইবার জমা দেওয়া যাবে না
donationSchema.index({ method: 1, trxId: 1 }, { unique: true });

export const Donation = model<TDonation>("Donation", donationSchema);