import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendreponse";
import { BlogServices } from "./blog.service";

const createBlogController = catchAsync(async (req, res) => {
  const result = await BlogServices.createBlog(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

const getAllBlogsController = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllBlogsFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blogs retrieved successfully",
    data: result,
  });
});

const getSingleBlogController = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await BlogServices.getSingleBlogFromDB(blogId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blog retrieved successfully",
    data: result,
  });
});

const updateBlogController = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await BlogServices.updateBlogInDB(blogId as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});

const deleteBlogController = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await BlogServices.deleteBlogFromDB(blogId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blog deleted successfully",
    data: result,
  });
});

export const BlogControllers = {
  createBlogController,
  getAllBlogsController,
  getSingleBlogController,
  updateBlogController,
  deleteBlogController,
};