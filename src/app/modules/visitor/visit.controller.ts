import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { visitServices } from "./visit.service";
import sendResponse from "../../utils/sendreponse";
import { getTrafficSource } from "../../utils/getTrafficSource";

const trackVisitController = catchAsync(async (req, res) => {
  const { path, referrer } = req.body;
  const userId = req.user?._id;
  const source = getTrafficSource(referrer);

  const visit = await visitServices.trackVisit(userId, path, source);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Visit tracked successfully",
    data: visit,
  });
});

const getTrafficStatsController = catchAsync(async (req, res) => {
  const stats = await visitServices.getTrafficStats();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Traffic stats retrieved successfully",
    data: stats,
  });
});

export const visitControllers = {
  trackVisitController,
  getTrafficStatsController,
};
