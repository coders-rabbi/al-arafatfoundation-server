import { IPost } from "./post.interface";
import { Post } from "./post.model";

const createPostIntroBD = async (payload: IPost) => {
  const result = await Post.create(payload);
  return result;
};

const getAllPostFromDB = async () => {
  const result = await Post.find().sort({ createdAt: -1 });
  return result;
};

const getSinglePostFromDB = async (id: string) => {
  const result = await Post.findById(id);
  return result;
};

const updatePostInDB = async (id: string, payload: Partial<IPost>) => {
  const result = await Post.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deletePostFromDB = async (id: string) => {
  const result = await Post.findByIdAndUpdate(id, {
    status: "deleted",
    returnDocument: "after",
  });
  return result;
};

export const PostServices = {
  createPostIntroBD,
  getAllPostFromDB,
  getSinglePostFromDB,
  updatePostInDB,
  deletePostFromDB,
};
