import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendreponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { PostServices } from "./post.service";

const createPostController = catchAsync(async (req, res) => {
  const result = await PostServices.createPostIntroBD(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post created successfully",
    data: result,
  });
});

const getAllPostsController = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All posts are successfully retrieved from the database",
    data: result,
  });
});

const getSinglePostController = catchAsync(async (req, res) => {
  
  const result = await PostServices.getSinglePostFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post is successfully retrieved from the database",
    data: result,
  });
});


const updatePostController = catchAsync(async (req, res) => {
  const result = await PostServices.updatePostInDB(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post is successfully updated",
    data: result,
  });
});

const deletePostController = catchAsync(async (req, res) => {
  const result = await PostServices.deletePostFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Post is successfully deleted",
    data: result,
  });
});

    
export const PostControllers = {
  createPostController,
  getAllPostsController,
  getSinglePostController,
  updatePostController,
  deletePostController,
};
