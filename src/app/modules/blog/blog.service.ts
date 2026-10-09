import { StatusCodes } from "http-status-codes";
import { IBlog } from "./blog.interface";
import { Blog } from "./blog.model";
import AppError from "../../error/AppError";

const createBlog = async (payload: IBlog) => {
  const result = await Blog.create(payload);
  return result;
};

const getAllBlogsFromDB = async () => {
  // shobcheye notun post age
  const result = await Blog.find().sort({ createdAt: -1 });
  return result;
};

const getSingleBlogFromDB = async (blogId: string) => {
  const result = await Blog.findById(blogId);

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Blog not found");
  }

  return result;
};

const updateBlogInDB = async (blogId: string, payload: Partial<IBlog>) => {
  const result = await Blog.findByIdAndUpdate(blogId, payload, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Blog not found");
  }

  return result;
};

const deleteBlogFromDB = async (blogId: string) => {
  const result = await Blog.findOneAndUpdate(
    { _id: blogId, isDeleted: false },
    { isDeleted: true },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Blog not found");
  }

  return null;
};

export const BlogServices = {
  createBlog,
  getAllBlogsFromDB,
  getSingleBlogFromDB,
  updateBlogInDB,
  deleteBlogFromDB,
};
