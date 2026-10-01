import { Model } from "mongoose";
import { ADMIN_ROLE } from "./admin.constant";

export type TAdminRole = (typeof ADMIN_ROLE)[keyof typeof ADMIN_ROLE];

export type TAdmin = {
  adminName: string;
  email: string;
  profileImage: string;
  password: string;
  passwordChangeAt?: Date;
  role: TAdminRole;
  isDeleted: boolean;
  isActive?: "active" | "blocked";
  comparePassword(candidate: string): Promise<boolean>;
};

// export interface UserModel extends Model<TAdmin> {
//   isUserExisting(id: string): Promise<TAdmin | null>;
//   isJWTIssuedBeforePasswordChanged(
//     passwordChangeTimestamp: Date,
//     jwtIssuedTimestamp: number,
//   ): boolean;
// }
