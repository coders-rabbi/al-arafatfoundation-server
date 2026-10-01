import { Document, Types } from "mongoose";

export interface IVisit extends Document {
  userId?: Types.ObjectId; // থাকলে registered visitor, না থাকলে guest
  path?: string; // কোন পেজে visit হয়েছে
  source?: string; // traffic source: google, facebook, direct, referral ইত্যাদি
  createdAt?: Date;
}

export type TTrafficStats = {
  totalVisits: number;
  registeredVisits: number;
  guestVisits: number;
  bySource: Record<string, number>;
};