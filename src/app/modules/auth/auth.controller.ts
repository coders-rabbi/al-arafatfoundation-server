import { CookieOptions } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendreponse";
import { authServices } from "./auth.service";
import config from "../../config";

const isProd = config.node_env === "production";

// Login ar logout e same options thakte hobe, na hole clearCookie kaj korbe na
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd, // dev e false
  sameSite: "lax", // frontend ar backend same-site (alarafatfoundation.org)
  path: "/",
  domain: isProd ? ".alarafatfoundation.org" : undefined,
};

const loginController = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await authServices.loginService(
    req.body,
  );

  res.cookie("accessToken", accessToken, {
    ...baseCookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
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
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);

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
