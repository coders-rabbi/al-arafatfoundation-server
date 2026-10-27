import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendreponse";
import { authServices } from "./auth.service";
import config from "../../config";

const loginController = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await authServices.loginService(
    req.body,
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.node_env === "production", // dev e false
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admin Login successfull",
    data: { accessToken },
  });
});


const logoutController = catchAsync(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Logout successful",
    data: null,
  });
});

export const authController = {
  loginController,
  logoutController,
};