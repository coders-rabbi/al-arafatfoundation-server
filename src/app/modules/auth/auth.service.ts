import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError";
import config from "../../config";
import { createToken } from "../../utils/jwt";
import { Admin } from "../admin/admin.model";
import { ILogin } from "./auth.interface";
import { string } from "zod";

const loginService = async (payload: ILogin) => {
  const isAdminExist = await Admin.findOne({ email: payload.email }).select(
    "+password",
  );

  // ইমেইল আর পাসওয়ার্ড ভুলে একই মেসেজ, যাতে ইমেইল আছে কিনা বোঝা না যায়
  if (!isAdminExist) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  if (isAdminExist.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "This account has been deleted");
  }

  if (isAdminExist.isActive === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, "This account is blocked");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isAdminExist.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload = {
    _id: isAdminExist._id.toString(),
    adminName: isAdminExist?.adminName,
    email: isAdminExist.email,
    role: isAdminExist.role,
    profileImage: isAdminExist?.profileImage,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_expires_in as string,
  );

  return { accessToken, refreshToken };
};

export const authServices = {
  loginService,
};
