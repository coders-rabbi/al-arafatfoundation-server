import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendreponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { PostServices } from "./post.service";

const createActivitieController = catchAsync(async (req, res) => {
  const result = await PostServices.createPostIntroBD(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post created successfully",
    data: result,
  });
});

const getAllActivitieController = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All posts are successfully retrieved from the database",
    data: result,
  });
});

const getSingleActivitieController = catchAsync(async (req, res) => {
  const result = await PostServices.getSinglePostFromDB(
    req.params.activitieId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Activitie is successfully retrieved from the database",
    data: result,
  });
});

const updateActivitieController = catchAsync(async (req, res) => {
  const result = await PostServices.updatePostInDB(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post is successfully updated",
    data: result,
  });
});

const deleteActivitieController = catchAsync(async (req, res) => {
  const result = await PostServices.deletePostFromDB(
    req.params.activitieId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post is successfully deleted",
    data: result,
  });
});

export const ActivitieControllers = {
  createActivitieController,
  getAllActivitieController,
  getSingleActivitieController,
  updateActivitieController,
  deleteActivitieController,
};
