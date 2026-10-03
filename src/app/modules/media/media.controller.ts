import sendResponse from "../../utils/sendreponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { MediaServices } from "./media.service";
import { MEDIA_TYPES } from "./media.constant";
import { TMediaType } from "./media.interface";

const createMediaController = catchAsync(async (req, res) => {
  const result = await MediaServices.createMediaIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Media created successfully",
    data: result,
  });
});

const getAllMediaController = catchAsync(async (req, res) => {
  // optional filter: GET /media?type=image
  const type = MEDIA_TYPES.includes(req.query.type as TMediaType)
    ? (req.query.type as TMediaType)
    : undefined;

  const result = await MediaServices.getAllMediaFromDB(type);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All media are successfully retrieved from the database",
    data: result,
  });
});

const getSingleMediaController = catchAsync(async (req, res) => {
  const result = await MediaServices.getSingleMediaFromDB(
    req.params.mediaId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Media is successfully retrieved from the database",
    data: result,
  });
});

const updateMediaController = catchAsync(async (req, res) => {
  const result = await MediaServices.updateMediaInDB(
    req.params.mediaId as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Media is successfully updated",
    data: result,
  });
});

const deleteMediaController = catchAsync(async (req, res) => {
  const result = await MediaServices.deleteMediaFromDB(
    req.params.mediaId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Media is successfully deleted",
    data: result,
  });
});

const bulkDeleteMediaController = catchAsync(async (req, res) => {
  const result = await MediaServices.bulkDeleteMediaFromDB(req.body.ids);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Selected media are successfully deleted",
    data: result,
  });
});

export const MediaControllers = {
  createMediaController,
  getAllMediaController,
  getSingleMediaController,
  updateMediaController,
  deleteMediaController,
  bulkDeleteMediaController,
};
