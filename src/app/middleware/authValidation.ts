// import { NextFunction, Request, Response } from "express";
// import { Model } from "mongoose";
// import catchAsync from "../utils/catchAsync";
// import AppError from "../error/AppError";
// import { StatusCodes } from "http-status-codes";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../config";
// import { TUserRole } from "../modules/users/user.interface";
// import { User } from "../modules/users/user.model";
// import { TAdminRole } from "../modules/admin/admin.interface";
// import { Admin } from "../modules/admin/admin.model";
// import { ADMIN_ROLE } from "../modules/admin/admin.constant";
// import { USER_ROLE } from "../modules/users/user.constant";

// type TRole = TUserRole | TAdminRole;

// const ROLE_MODEL_MAP: Record<string, Model<any>> = {
//   [ADMIN_ROLE.SUPER_ADMIN]: Admin,
//   [ADMIN_ROLE.ADMIN]: Admin,
//   [ADMIN_ROLE.EDITOR]: Admin,
//   [USER_ROLE.REPORTER]: User,
//   [USER_ROLE.VIEWER]: User,
// };

// const authValidation = (...requiredRole: TRole[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
//     }

//     let decoded: JwtPayload;

//     try {
//       decoded = jwt.verify(
//         token,
//         config.jwt_access_token as string,
//       ) as JwtPayload;
//     } catch (err) {
//       throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid token");
//     }

//     const { email, role, iat } = decoded;

//     const AccountModel = ROLE_MODEL_MAP[role];
//     if (!AccountModel) {
//       throw new AppError(StatusCodes.FORBIDDEN, "Invalid role!");
//     }

//     const isUserExist = await AccountModel.findOne({ email });
//     if (!isUserExist) {
//       throw new AppError(StatusCodes.NOT_FOUND, `This ${role} is not found!`);
//     }

//     const isDeleted = isUserExist?.isDeleted;
//     if (isDeleted) {
//       throw new AppError(StatusCodes.FORBIDDEN, `This ${role} is deleted!`);
//     }

//     const isBlocked = isUserExist?.isActive;
//     if (isBlocked === "blocked") {
//       throw new AppError(StatusCodes.FORBIDDEN, `This ${role} is blocked!`);
//     }

//     // 🔧 password change check — শুধু সেই model-এই চালানো হবে যাদের এই static method আছে
//     // (এখন এটা শুধু User model-এ আছে, Admin model-এ নেই)
//     if (
//       isUserExist.passwordChangeAt &&
//       typeof (AccountModel as any).isJWTIssuedBeforePasswordChanged ===
//         "function" &&
//       (AccountModel as any).isJWTIssuedBeforePasswordChanged(
//         isUserExist.passwordChangeAt,
//         iat as number,
//       )
//     ) {
//       throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid token");
//     }

//     if (
//       requiredRole.length > 0 &&
//       !requiredRole.includes(decoded.role as TRole)
//     ) {
//       throw new AppError(StatusCodes.FORBIDDEN, "Forbidden access");
//     }

//     req.user = decoded;
//     next();
//   });
// };

// export default authValidation;
