// import { NextFunction, Request, Response } from "express";
// import { Model } from "mongoose";
// import catchAsync from "../utils/catchAsync";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../config";
// import { User } from "../modules/users/user.model";
// import { Admin } from "../modules/admin/admin.model";
// import { ADMIN_ROLE } from "../modules/admin/admin.constant";
// import { USER_ROLE } from "../modules/users/user.constant";

// const ROLE_MODEL_MAP: Record<string, Model<any>> = {
//   [ADMIN_ROLE.SUPER_ADMIN]: Admin,
//   [ADMIN_ROLE.ADMIN]: Admin,
//   [ADMIN_ROLE.EDITOR]: Admin,
//   [USER_ROLE.REPORTER]: User,
//   [USER_ROLE.VIEWER]: User,
// };

// const optionalAuth = () => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;

//     // token ই নেই → guest হিসেবে চালিয়ে যাও
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return next();
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return next();
//     }

//     let decoded: JwtPayload;

//     try {
//       decoded = jwt.verify(
//         token,
//         config.jwt_access_token as string,
//       ) as JwtPayload;
//     } catch (err) {
//       // invalid/expired token → block না করে guest হিসেবে চালাও
//       return next();
//     }

//     const { email, role } = decoded;

//     const AccountModel = ROLE_MODEL_MAP[role];
//     if (!AccountModel) {
//       return next(); // অচেনা role হলেও guest হিসেবে চালাও
//     }

//     const isUserExist = await AccountModel.findOne({ email });

//     // user না পাওয়া গেলে, deleted বা blocked হলে guest হিসেবে চালাও
//     if (
//       !isUserExist ||
//       isUserExist.isDeleted ||
//       isUserExist.isActive === "blocked"
//     ) {
//       return next();
//     }

//     // সব ঠিক থাকলে req.user set করে দাও
//     req.user = decoded;
//     next();
//   });
// };

// export default optionalAuth;