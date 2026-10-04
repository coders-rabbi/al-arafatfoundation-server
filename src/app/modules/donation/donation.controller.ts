import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendreponse";
import AppError from "../../error/AppError";
import { DonationServices } from "./donation.service";
import { DONATION_STATUS } from "./donation.constant";
import { TDonationStatus } from "./donation.interface";
import { string } from "zod";

const createDonationController = catchAsync(async (req, res) => {
  const result = await DonationServices.createDonationIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Donation submitted successfully. We will verify it soon.",
    data: result,
  });
});

const getAllDonationsController = catchAsync(async (req, res) => {
  const status = req.query.status as string | undefined;

  if (status && !DONATION_STATUS.includes(status as TDonationStatus)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Status must be pending, verified or rejected",
    );
  }

  const result = await DonationServices.getAllDonationsFromDB(
    status as TDonationStatus | undefined,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Donations retrieved successfully",
    data: result,
  });
});

const updateDonationStatusController = catchAsync(async (req, res) => {
  const result = await DonationServices.updateDonationStatusIntoDB(
    req.params.donationId as string,
    req.body.status,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Donation status updated successfully",
    data: result,
  });
});

export const DonationControllers = {
  createDonationController,
  getAllDonationsController,
  updateDonationStatusController,
};
