import { StatusCodes } from "http-status-codes";
import { Donation } from "./donation.model";
import { TDonation, TDonationStatus } from "./donation.interface";
import AppError from "../../error/AppError";

const createDonationIntoDB = async (payload: TDonation) => {
  const exists = await Donation.findOne({
    method: payload.method,
    trxId: payload.trxId,
  });

  if (exists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "This Transaction ID has already been submitted",
    );
  }

  const result = await Donation.create(payload);
  return result;
};

const getAllDonationsFromDB = async (status?: TDonationStatus) => {
  const filter: { status?: TDonationStatus } = status ? { status } : {};
  const result = await Donation.find(filter).sort({ createdAt: -1 });
  return result;
};

const updateDonationStatusIntoDB = async (
  id: string,
  status: TDonationStatus,
) => {
  const result = await Donation.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Donation not found");
  }

  return result;
};

export const DonationServices = {
  createDonationIntoDB,
  getAllDonationsFromDB,
  updateDonationStatusIntoDB,
};