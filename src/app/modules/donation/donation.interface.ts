import { DONATION_METHODS, DONATION_STATUS } from "./donation.constant";

export type TDonationMethod = (typeof DONATION_METHODS)[number];
export type TDonationStatus = (typeof DONATION_STATUS)[number];

export interface TDonation {
  amount: number;
  method: TDonationMethod;
  name: string;
  phone: string;
  trxId: string;
  note?: string;
  status: TDonationStatus;
}