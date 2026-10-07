import config from "../../config";
import { ADMIN_ROLE } from "../admin/admin.constant";
import { Admin } from "../admin/admin.model";

export const seedSuperAdmin = async () => {
  try {
    const superAdminPass = config.super_admin_pass;

    if (!superAdminPass) {
      throw new Error("SUPER_ADMIN_PASS is not defined in env");
    }

    const isSuperAdminExist = await Admin.findOne({
      role: ADMIN_ROLE.SUPER_ADMIN,
    });

    if (isSuperAdminExist) {
      console.log("Super admin already exists");
      return;
    }

    await Admin.create({
      adminName: "Arafat Foundation",
      email: "info.alarafatfoundation@gmail.com",
      profileImage: "",
      password: superAdminPass, // এখন টাইপ string
      role: ADMIN_ROLE.SUPER_ADMIN,
      isDeleted: false,
    });

    console.log("Super admin created");
  } catch (error) {
    console.error("Super admin seed failed:", error);
  }
};
