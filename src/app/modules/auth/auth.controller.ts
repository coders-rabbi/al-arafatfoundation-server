import { CookieOptions, Request } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendreponse";
import { authServices } from "./auth.service";
import config from "../../config";

const ROOT_DOMAIN = "alarafatfoundation.org";

// Request dekhe cookie options thik kore (NODE_ENV er upor depend kore na)
const getCookieOptions = (req: Request): CookieOptions => {
  // trust proxy on thakle Render er HTTPS e req.secure = true hoy
  const isHttps = req.secure;
  const isOwnDomain =
    req.hostname === ROOT_DOMAIN || req.hostname.endsWith(`.${ROOT_DOMAIN}`);

  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    path: "/",
    // sudhu api.alarafatfoundation.org e hole domain set hobe
    // onrender.com ba localhost e domain dile cookie reject hoy
    domain: isOwnDomain ? `.${ROOT_DOMAIN}` : undefined,
  };
};

const loginController = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await authServices.loginService(
    req.body,
  );

  const cookieOptions = getCookieOptions(req);

  // DEBUG: Render Logs e dekho, pore delete korte paro
  console.log("LOGIN DEBUG:", {
    nodeEnv: config.node_env,
    origin: req.headers.origin,
    hostname: req.hostname,
    secure: req.secure,
    xForwardedProto: req.headers["x-forwarded-proto"],
    cookieOptions,
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
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
  // set korar option ar clear korar option same hote hobe
  const cookieOptions = getCookieOptions(req);

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

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
